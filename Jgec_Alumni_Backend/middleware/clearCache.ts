import { NextFunction, Request, Response } from "express";
import { redisClient } from "../utils/redis"; // Make sure this path is correct for your project!

export const clearCacheMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Wait for the request to successfully finish before clearing cache
        res.on("finish", async () => {
            // Only clear cache on successful mutation requests (POST, PUT, PATCH, DELETE)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
                    try {
                        let cursor = '0';
                        const keysToDelete: string[] = [];

                        // Use SCAN instead of KEYS (much safer/faster for production VPS)
                        do {
                            const result = await redisClient.scan(cursor, {
                                MATCH: 'cache:*',
                                COUNT: 100
                            });
                            
                            cursor = result.cursor.toString(); // Update cursor for next iteration
                            keysToDelete.push(...result.keys);
                            
                        } while (cursor !== '0');

                        // If we found keys, delete them
                        if (keysToDelete.length > 0) {
                            // Using spread operator (...) to ensure node-redis handles the array correctly
                            await redisClient.del(...keysToDelete);
                            console.log(`[Cache] Successfully cleared ${keysToDelete.length} cached routes.`);
                        }
                    } catch (error) {
                        console.error("[Cache] Failed to clear Redis cache on VPS:", error);
                    }
                }
            }
        });
        
        next();
    };
};
