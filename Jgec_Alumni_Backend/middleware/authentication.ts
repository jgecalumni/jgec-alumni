import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

// Extend the Express Request type so TypeScript knows about req.user
export interface AuthRequest extends Request {
	user?: { userId: string; role: string; allowedPaths: string[] };
}

const authentication = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		let token: string | undefined;

		const authHeader = req.headers?.cookie;
		if (authHeader) {
			const cookies = Object.fromEntries(
				authHeader.split('; ').map(c => c.split('='))
			);
			token = cookies['accessToken'] || cookies['tokenAdmin'] || cookies['token'];
		}

		// Also check Authorization: Bearer <token>
		if (!token && req.headers.authorization?.startsWith("Bearer ")) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (!token) {
			res.status(401).json({
				message: "Access token is missing",
				error: true,
				success: false,
			});
			return;
		}

		const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "jgec_alumni_secret";
		jwt.verify(token, secret, (err: any, decoded: any) => {
			if (err) {
				res.status(401).json({
					message: "Access token expired or invalid",
					error: true,
					success: false,
				});
				return;
			}

			req.user = decoded as { userId: string; role: string; allowedPaths: string[] };
			next();
		});
	} catch {
		res.status(500).json({
			message: "Internal server error during authentication",
			error: true,
			success: false
		});
	}
};

export default authentication;

export const refreshSession = async (req: Request, res: Response): Promise<void> => {
	try {
		let refreshToken: string | undefined;

		const authHeader = req.headers?.cookie;
		if (authHeader) {
			const cookies = Object.fromEntries(
				authHeader.split('; ').map(c => c.split('='))
			);
			refreshToken = cookies['refreshToken'];
		}

		if (!refreshToken && req.body?.refreshToken) {
			refreshToken = req.body.refreshToken;
		}

		if (!refreshToken) {
			res.status(401).json({ message: "Refresh token is missing", error: true, success: false });
			return;
		}

		const savedToken = await prisma.refreshToken.findUnique({
			where: { token: refreshToken },
			include: { user: true }
		});

		if (!savedToken || savedToken.expiresAt < new Date()) {
			if (savedToken) {
				await prisma.refreshToken.delete({ where: { id: savedToken.id } });
			}
			res.status(403).json({ message: "Session expired. Please log in again.", error: true, success: false });
			return;
		}

		const refreshSecret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || "jgec_alumni_refresh_secret";
		jwt.verify(refreshToken, refreshSecret, (err: any, decoded: any) => {
			if (err || decoded.userId !== savedToken.userId) {
				res.status(403).json({ message: "Invalid refresh token", error: true, success: false });
				return;
			}

			const accessSecret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "jgec_alumni_secret";
			const newAccessToken = jwt.sign(
				{
					userId: savedToken.user.id,
					name: savedToken.user.name,
					email: savedToken.user.email,
					role: savedToken.user.role,
					allowedPaths: savedToken.user.allowedPaths
				},
				accessSecret,
				{ expiresIn: '15m' }
			);

			const origin = req.headers.origin || req.headers.referer || "";
			const isJgecDomain =
				origin.includes("jgecalumni.in") ||
				process.env.NODE_ENV === "production";

			const cookieOptions: any = {
				httpOnly: true,
				secure: isJgecDomain,
				sameSite: isJgecDomain ? "none" : "lax",
				maxAge: 15 * 60 * 1000,
				path: "/",
				...(isJgecDomain ? { domain: ".jgecalumni.in" } : {}),
			};

			res.cookie('accessToken', newAccessToken, cookieOptions);
			res.cookie('user_session', JSON.stringify({
				id: savedToken.user.id,
				name: savedToken.user.name,
				email: savedToken.user.email,
				role: savedToken.user.role,
				allowedPaths: savedToken.user.allowedPaths,
			}), {
				...cookieOptions,
				httpOnly: false,
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			res.status(200).json({
				success: true,
				message: "Session refreshed successfully",
				accessToken: newAccessToken
			});
		});
	} catch {
		res.status(500).json({ message: "Failed to refresh session", error: true, success: false });
	}
};
