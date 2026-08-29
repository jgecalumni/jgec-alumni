import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redis";

export const clearCacheMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // We only care about requests that modify data
        if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
            const originalJson = res.json.bind(res);
            
            res.json = (body: any) => {
                // If the request was successful, clear related caches
                if (res.statusCode >= 200 && res.statusCode < 300 && redisClient.isOpen) {
                    
                    // Extract the base path (e.g., /v1/api/scholarships/123 -> /v1/api/scholarships)
                    const urlParts = req.originalUrl.split('?')[0].split('/');
                    
                    // Typically, our routes are structured like /v1/api/<resource>
                    // So we take the first 4 segments: "", "v1", "api", "resource"
                    let basePath = req.originalUrl;
                    if (urlParts.length >= 4) {
                        basePath = urlParts.slice(0, 4).join('/');
                    }

                    // We want to delete all cached keys that start with this base path
                    const pattern = `cache:${basePath}*`;
                    
                    redisClient.keys(pattern)
                        .then(keys => {
                            if (keys.length > 0) {
                                redisClient.del(keys).catch(err => console.error("Error deleting cache keys:", err));
                                console.log(`[Redis] Cleared ${keys.length} cache keys for pattern: ${pattern}`);
                            }
                        })
                        .catch(err => {
                            console.error("[Redis] Cache Clear Error:", err);
                        });
                }
                
                return originalJson(body);
            };
        }
        
        next();
    };
};
