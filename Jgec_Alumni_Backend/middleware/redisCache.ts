import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redis";

export const cacheMiddleware = (durationInSeconds: number = 300) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Only cache GET requests
        if (req.method !== "GET") {
            return next();
        }

        let key = `cache:${req.originalUrl}`;
        // @ts-ignore - assuming req.user might be populated by auth middleware
        if (req.user && req.user.id) {
            // @ts-ignore
            key += `:user:${req.user.id}`;
        }

        try {
            if (!redisClient.isOpen) {
                return next(); 
            }

            const cachedResponse = await redisClient.get(key);
            if (cachedResponse) {
                return res.json(JSON.parse(cachedResponse));
            }

            const originalJson = res.json.bind(res);
            res.json = (body: any) => {
                redisClient.setEx(key, durationInSeconds, JSON.stringify(body)).catch(err => {
                    console.error("Redis Cache Set Error:", err);
                });
                
                return originalJson(body);
            };

            next();
        } catch (error) {
            console.error("Redis Cache Middleware Error:", error);
            next();
        }
    };
};
