import { Request, Response, NextFunction, RequestHandler } from 'express';

const asyncHandler = (requestHandler: RequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            res.status(500).json({
                message: err?.message || "Internal server error",
                error: true,
                success: false
            });
        });
    };
};

export { asyncHandler };
