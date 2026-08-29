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
		domain: ".jgecalumni.in",
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

	// generate token & cookies
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
		// domain: ".jgecalumni.in",
	});
	res.clearCookie("tokenMoney", {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		// domain: ".jgecalumni.in",
	});
	res.status(200).json({
		message: "Logout successful",
		error: false,
		success: true,
	});
});
export const adminlogout = asyncHandler(async (req: Request, res: Response) => {
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
