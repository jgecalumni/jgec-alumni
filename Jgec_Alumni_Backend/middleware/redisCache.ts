import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redis";

export const cacheMiddleware = (durationInSeconds: number = 300) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Only cache GET requests
        if (req.method !== "GET") {
            return next();
        }

        // Generate a unique cache key based on the URL. 
        // If the user is authenticated (via auth middleware), append their ID so users don't see each other's data.
        let key = `cache:${req.originalUrl}`;
        // @ts-ignore - assuming req.user might be populated by auth middleware
        if (req.user && req.user.id) {
            // @ts-ignore
            key += `:user:${req.user.id}`;
        }

        try {
            if (!redisClient.isOpen) {
                return next(); // Skip caching if Redis isn't connected
            }

            // Check if we have a cached response
            const cachedResponse = await redisClient.get(key);
            if (cachedResponse) {
                return res.json(JSON.parse(cachedResponse));
            }

            // Intercept res.json to capture the response body
            const originalJson = res.json.bind(res);
            res.json = (body: any) => {
                // Save the response to Redis before sending it back
                redisClient.setEx(key, durationInSeconds, JSON.stringify(body)).catch(err => {
                    console.error("Redis Cache Set Error:", err);
                });
                
                // Call the original res.json function to send the response to the user
                return originalJson(body);
            };

            next();
        } catch (error) {
            console.error("Redis Cache Middleware Error:", error);
            next(); // In case of Redis error, just proceed normally without cache
        }
    };
};
