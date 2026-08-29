import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authentication = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers?.cookie;
	if (!authHeader) {
		res.status(404).json({
			message: "Authorization header is missing",
			error: true,
			success: false,
		});
		return;
	}
	const token =
		authHeader.split("token=")[1] ||
		authHeader.split("tokenAdmin=")[1] ||
		authHeader.split("tokenMoney=")[1];

	jwt.verify(token, process.env.JWT_SECRET as string, (err, data) => {
		if (err) {
			res.status(404).json({
				message: "Invalid token or expired",
				error: true,
				success: false,
			});
		} else {			
			next();
		}
	});
};

export default authentication;
