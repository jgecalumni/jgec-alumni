import { NextFunction, Request, Response } from "express";
import redisClient from "../utils/redis";

export const clearCacheMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        res.on("finish", async () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
                    try {
                        let cursor = '0';
                        const keysToDelete: string[] = [];

                        do {
                            const result = await redisClient.scan(cursor, {
                                MATCH: 'cache:*',
                                COUNT: 100
                            });
                            
                            cursor = result.cursor.toString(); 
                            keysToDelete.push(...result.keys);
                            
                        } while (cursor !== '0');

                        if (keysToDelete.length > 0) {
                            await redisClient.del(keysToDelete);
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
