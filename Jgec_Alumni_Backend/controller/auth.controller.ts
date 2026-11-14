import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import prisma from "../prisma";
import { sendMail } from "../utils/mailer";
import { WelcomeMail } from "../utils/mail-templates";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";

interface FileType {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	destination: string;
	filename: string;
	path: string;
	size: string;
}

interface IResponse extends Response {
	files: {
		photo: FileType[];
		receipt: FileType[];
	};
}

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (!(email && password)) {
		res.status(400).json({
			message: "Email and password are required",
			error: true,
			success: false,
		});
		return;
	}

	let role = null;

	if (
		email === process.env.ADMIN_EMAIL &&
		password === process.env.ADMIN_PASSWORD
	) {
		role = "admin";
	} else if (
		email === process.env.MONEY_EMAIL &&
		password === process.env.MONEY_PASSWORD
	) {
		role = "money";
	} else {
		res.status(401).json({
			message: "Invalid credentials",
			error: true,
			success: false,
		});
		return;
	}

	const accessToken = jwt.sign(
		{ email, role },
		process.env.JWT_SECRET as string,
		{
			expiresIn: "1d",
		}
	);

	const cookieRole = role === "admin" ? "tokenAdmin" : "tokenMoney";

	const response = res.cookie(cookieRole, accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		// domain: ".jgecalumni.in",
	});

	response.status(200).json({
		message: "Login successful",
		role,
		accessToken,
		error: false,
		success: true,
	});
});

export const registerMember = asyncHandler(
	async (req: Request, res: Response) => {
		const {
			name,
			email,
			password,
			studentId,
			passingYear,
			department,
			nickname,
			residentialAddress,
			professionalAddress,
		} = req.body;
		const { photo, receipt } = (req as unknown as IResponse).files;

		// Check if all fields are provided
		if (
			!(
				name &&
				email &&
				password &&
				passingYear &&
				department &&
				residentialAddress &&
				professionalAddress &&
				photo &&
				nickname
			)
		) {
			res.status(400).json({
				message: "All fields are required",
				error: true,
				success: false,
			});
			return;
		}

		// Check if member already exists or not
		const isExist = await prisma.members.findFirst({
			where: {
				OR: [{ email }, { studentId }],
			},
		});
		if (isExist) {
			res.status(409).json({
				message: "Member already exists",
				error: true,
				success: false,
			});
			return;
		}

		// Hash password & save member to database
		const hashedPassword = await bcrypt.hash(password, 10);
		const photoUrl = await uploadOnCloudinary(photo[0].path);
		const receiptUrl = await uploadOnCloudinary(receipt[0].path);

		const newMember = await prisma.members.create({
			data: {
				name,
				email,
				password: hashedPassword,
				studentId,
				nickname,
				passingYear: parseInt(passingYear),
				department,
				residentialAddress,
				professionalAddress,
				photo: photoUrl?.url || "",
				photo_public_id: photoUrl?.public_id || "",
				receipt: receiptUrl?.url || "",
				receipt_public_id: receiptUrl?.public_id || "",
			},
		});

		// send email welcome
		await sendMail(
			email,
			"Welcome to JGEC Alumni Association",
			WelcomeMail(name)
		);

		// generate token & cookies
		const accessToken = jwt.sign(
			{ userId: newMember.id, email: newMember.email, name: newMember.name },
			process.env.JWT_SECRET as string,
			{ expiresIn: "1D" }
		);

		const response = res.cookie("token", accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			domain: ".jgecalumni.in",
		});

		response.status(201).json({
			message: "Member registered successfully",
			data: newMember,
			accessToken,
			error: false,
			success: true,
		});
	}
);

export const loginMember = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!(email && password)) {
		res.status(400).json({
			message: "All fields are required",
			error: true,
			success: false,
		});
		return;
	}

	// Check if member exists or not
	const member = await prisma.members.findFirst({ where: { email } });
	if (!member) {
		res.status(401).json({
			message: "Member not exists",
			error: true,
			success: false,
		});
		return;
	}

	// Check if password is correct or not
	const isCorrectPass = await bcrypt.compare(password, member.password);

	if (!isCorrectPass) {
		res.status(401).json({
			message: "Invalid credentials",
			error: true,
			success: false,
		});
		return;
	}

	const accessToken = jwt.sign(
		{
			userId: member.id,
			userPhoto: member.photo,
			email: member.email,
			name: member.name,
		},
		process.env.JWT_SECRET as string,
		{ expiresIn: "1D" }
	);

	const response = res.cookie("token", accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		domain: ".jgecalumni.in",
	});

	response.status(200).json({
		message: "Login successful",
		data: member,
		accessToken,
		error: false,
		success: true,
	});
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
	res.clearCookie("tokenAdmin", {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		domain: ".jgecalumni.in",
	});
	res.clearCookie("tokenMoney", {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		domain: ".jgecalumni.in",
	});
	res.status(200).json({
		message: "Logout successful",
		error: false,
		success: true,
	});
});
export const adminlogout = asyncHandler(async (req: Request, res: Response) => {

	const { refreshToken } = req.cookies;
	if (refreshToken) {
		await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
	}

	const origin = req.headers.origin || req.headers.referer || "";
	const isJgecDomain =
		origin.includes("jgecalumni.in") ||
		process.env.NODE_ENV === "production";

	const clearOptions: any = {
		httpOnly: true,
		secure: isJgecDomain,
		sameSite: isJgecDomain ? "none" : "lax",
		path: "/",
	};

	res.clearCookie('refreshToken', clearOptions);
	res.clearCookie('accessToken', clearOptions);
	res.clearCookie("tokenAdmin", clearOptions);
	res.clearCookie("tokenMoney", clearOptions);
	res.clearCookie("user_session", { path: "/" });

	if (isJgecDomain) {
		const prodClear = { ...clearOptions, domain: ".jgecalumni.in" };
		res.clearCookie('refreshToken', prodClear);
		res.clearCookie('accessToken', prodClear);
		res.clearCookie("tokenAdmin", prodClear);
		res.clearCookie("tokenMoney", prodClear);
		res.clearCookie("user_session", { ...prodClear, httpOnly: false });
	}
	return res.status(200).json({
		message: "Logout successful",
		error: false,
		success: true,
	});
});

export const allMembers = asyncHandler(async (req: Request, res: Response) => {
	const { limit, page, search } = req.query;
	const lmt = limit ? Number(limit) : 10;
	const pg = page ? Number(page) : 1;

	const totalCount = await prisma.members.count();
	const members = await prisma.members.findMany({
		skip: (pg - 1) * lmt,
		take: lmt,
		orderBy: {
			createdAt: "desc",
		},
		where: {
			OR: [
				{
					name: {
						contains: (search as string) || "",
					},
				},
				{
					email: {
						contains: (search as string) || "",
					},
				},
			],
		},
	});

	res.status(200).json({
		message: "All members fetched successfully",
		members,
		error: false,
		success: true,
		limit: lmt,
		page: pg,
		totalPages: Math.ceil(totalCount / lmt),
		docCount: totalCount,
	});
});

export const memberDetails = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		// Check if member exists or not
		const member = await prisma.members.findFirst({
			where: { id: parseInt(id as string) },
		});
		if (!member) {
			res.status(404).json({
				message: "Member not exists",
				error: true,
				success: false,
			});
			return;
		}

		res.status(200).json({
			data: member,
			error: false,
			success: true,
		});
	}
);

export const updateMemeber = asyncHandler(
	async (req: Request, res: Response) => {
		const {
			name,
			email,
			password,
			studentId,
			passingYear,
			department,
			residentialAddress,
			professionalAddress,
		} = req.body;
		const photo = (req as any).file;
		const { id } = req.params;

		if (
			!(
				name &&
				email &&
				studentId &&
				passingYear &&
				department &&
				residentialAddress &&
				professionalAddress
			)
		) {
			res.status(400).json({
				success: false,
				message: "Please provide all required fields",
				error: true,
			});
			return;
		}

		const isExist = await prisma.members.findFirst({
			where: { id: parseInt(id as string) },
		});
		if (!isExist) {
			res
				.status(404)
				.json({ success: false, message: "Event not found", error: true });
			return;
		}

		if (photo && photo.size > 2 * 1024 * 1024) {
			res.status(400).json({
				success: false,
				message: "File size must be less than 2MB",
				error: true,
			});
			return;
		}
		let fileLinkExist = isExist.photo || "";
		let fileLinkExistId = isExist.photo_public_id || "";
		let fileLink = null;

		if (photo) {
			if (isExist.photo_public_id) {
				await deleteFromCloudinary(isExist.photo_public_id);
			}
			fileLink = await uploadOnCloudinary(photo.path);
		}

		let updatedPassword = isExist.password;

		if (password) {
			updatedPassword = await bcrypt.hash(password, 10);
		}

		const updateMember = await prisma.members.update({
			where: { id: parseInt(id as string) },
			data: {
				name,
				email,
				password: updatedPassword,
				studentId,
				passingYear: parseInt(passingYear),
				photo: fileLink?.url || fileLinkExist,
				photo_public_id: fileLink?.public_id || fileLinkExistId,
				department,
				residentialAddress,
				professionalAddress,
			},
		});

		res.status(200).json({
			message: "User updated successfully",
			data: updateMember,
			error: false,
			success: true,
		});
	}
);


export const login = async (req: any, res: any) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ success: false, message: 'Email and password are required' });
		}

		let user = await prisma.user.findUnique({ where: { email } });

		// Fallback for master admin credentials if not yet created in User table
		if (!user && email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
			const hashedPassword = await bcrypt.hash(password, 10);
			user = await prisma.user.upsert({
				where: { email },
				update: { role: "SUPER_ADMIN", allowedPaths: ["*"] },
				create: {
					email,
					password: hashedPassword,
					name: "Council Super Admin",
					role: "SUPER_ADMIN",
					allowedPaths: ["*"],
					last_login_at: new Date()
				}
			});
		}

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).json({ success: false, message: 'Invalid credentials' });
		}

		const accessSecret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "jgec_alumni_secret";
		const refreshSecret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || "jgec_alumni_refresh_secret";

		const accessToken = jwt.sign(
			{
				userId: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				allowedPaths: user.allowedPaths,
			},
			accessSecret,
			{ expiresIn: '15m' }
		);
		const refreshToken = jwt.sign(
			{ userId: user.id },
			refreshSecret,
			{ expiresIn: '7d' }
		);

		await Promise.all([
			prisma.user.update({
				where: { id: user.id },
				data: { last_login_at: new Date() },
			}),
			prisma.refreshToken.create({
				data: {
					token: refreshToken,
					userId: user.id,
					expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				},
			})
		]);

		const origin = req.headers.origin || req.headers.referer || "";
		const isJgecDomain =
			origin.includes("jgecalumni.in") ||
			process.env.NODE_ENV === "production";

		const cookieOptions: any = {
			httpOnly: true,
			secure: isJgecDomain,
			sameSite: isJgecDomain ? "none" : "lax",
			path: "/",
			...(isJgecDomain ? { domain: ".jgecalumni.in" } : {}),
		};

		res.cookie('refreshToken', refreshToken, {
			...cookieOptions,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.cookie('accessToken', accessToken, {
			...cookieOptions,
			maxAge: 15 * 60 * 1000, // 15 minutes
		});

		res.cookie('user_session', JSON.stringify({
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
			allowedPaths: user.allowedPaths,
		}), {
			...cookieOptions,
			httpOnly: false,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({
			success: true,
			message: "Login successful",
			role: user.role,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
				allowedPaths: user.allowedPaths,
			},
		});
	} catch (error: any) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: error.message || "Internal server error",
		});
	}
};

export const adminMe = asyncHandler(async (req: any, res: any) => {
	let token: string | undefined;

	const authHeader = req.headers?.cookie;
	if (authHeader) {
		const cookies = Object.fromEntries(
			authHeader.split('; ').map((c: string) => c.split('='))
		);
		token = cookies['accessToken'] || cookies['tokenAdmin'] || cookies['token'];
	}

	if (!token && req.headers.authorization?.startsWith("Bearer ")) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		return res.status(401).json({
			success: false,
			error: true,
			message: "Access token is missing",
		});
	}

	const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "jgec_alumni_secret";
	try {
		const decoded: any = jwt.verify(token, secret);
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				allowedPaths: true,
			},
		});

		if (!user) {
			return res.status(404).json({
				success: false,
				error: true,
				message: "User profile not found",
			});
		}

		return res.status(200).json({
			success: true,
			error: false,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				allowedPaths: user.allowedPaths,
			},
		});
	} catch {
		return res.status(401).json({
			success: false,
			error: true,
			message: "Access token expired or invalid",
		});
	}
});
