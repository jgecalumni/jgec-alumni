import prisma from "../prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import {
	deleteFromCloudinary,
	uploadOnCloudinary,
	uploadReceiptToCloudinary,
} from "../utils/cloudinary";
import {
	approvedReceiptMail,
	denyReceiptMail,
	ReceiptApprovalMail,
	ReceiptSubmitMail,
} from "../utils/mail-templates";
import { sendMail, sendMailWithAttachment } from "../utils/mailer";
import { generateReceiptPDF } from "../utils/pdf";
import { error } from "console";
export const receiptRequest = asyncHandler(
	async (req: Request, res: Response) => {
		const {
			name,
			phone,
			email,
			amount,
			panId,
			gender,
			donationFor,
			passoutYear,
			transactionId,
			date,
		} = req.body;
		const receipt = (req as any).file;

		if (!(name && amount && transactionId && donationFor && date && gender)) {
			res.status(400).json({
				success: false,
				message: "Please provide all required fields",
				error: true,
			});
			return;
		}
		// if (!receipt) {
		// 	res.status(400).json({
		// 		success: false,
		// 		message: "Please provide photo",
		// 		error: true,
		// 	});
		// 	return;
		// }
		const isExist = await prisma.receiptDetails.findFirst({
			where: { transactionId },
		});
		if (isExist) {
			res.status(409).json({
				success: false,
				message: "Receipt already delivered or in process",
				error: true,
			});
			return;
		}
		// const receiptImage = await uploadOnCloudinary(receipt.path);
		// if (!receiptImage) {
		// 	res.status(500).json({
		// 		success: false,
		// 		message: "Failed to upload receipt image",
		// 		error: true,
		// 	});
		// 	return;
		// }
		const receiptDetails = await prisma.receiptDetails.create({
			data: {
				name,
				email,
				amount: parseInt(amount),
				date,
				panId,
				gender,
				donationFor,
				phone,
				passoutYear: parseInt(passoutYear),
				transactionId,
				receipt: "",
				receipt_public_id: "",
			},
		});
		if (!receiptDetails) {
			res.status(500).json({
				success: false,
				message: "Something went wrong",
				error: true,
			});
			return;
		}
		if (!email) {
			res.status(201).json({
				success: true,
				message: "Receipt request created successfully",
				data: receiptDetails,
			});
		} else {
			await sendMail(
				email,
				"Receipt Request Confirmation",
				ReceiptSubmitMail(name, amount, transactionId, donationFor)
			);

			// send email to admin
			await sendMail(
				process.env.EMAIL_USERNAME as string,
				"New Receipt Request",
				ReceiptApprovalMail(name, amount, transactionId, donationFor)
			);
			res.status(201).json({
				success: true,
				message: "Receipt request created successfully",
				data: receiptDetails,
			});
		}
	}
);

export const getAllReceiptRequest = asyncHandler(
	async (req: Request, res: Response) => {
		const { search, limit, page } = req.query;
		const count = await prisma.receiptDetails.count();
		const receiptDetails = await prisma.receiptDetails.findMany({
			take: Number(limit) || 10,
			skip: (Number(page) - 1) * Number(limit) || 0,

			orderBy: {
				createdAt: "desc",
			},
			where: {
				OR: [
					{
						transactionId: {
							contains: search as string,
						},
					},
					{
						name: {
							contains: search as string,
						},
					},
					{
						email: {
							contains: search as string,
						},
					},
				],
			},
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
				panId: true,
				gender: true,
				passoutYear: true,
				amount: true,
				donationFor: true,
				transactionId: true,
				receipt: true,
				generatedReceipt: true,
				createdAt: true,
				paymentStatus: true,
			},
		});
		if (!receiptDetails) {
			res.status(404).json({
				success: false,
				message: "No receipt request found",
				error: true,
			});
			return;
		}
		res.status(200).json({
			success: true,
			error: false,
			message: "Receipt request fetched successfully",
			data: receiptDetails,
			docCount: count,
			totalPages: Math.ceil(count / (Number(limit) || 10)),
			page: Number(page) || 1,
			limit: Number(limit) || 10,
		});
	}
);

export const deleteReceipt = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const receipt = await prisma.receiptDetails.findFirst({
			where: { id: parseInt(id as string) },
		});
		if (!receipt) {
			res.status(404).json({
				success: false,
				message: "Receipt not found",
				error: true,
			});
			return;
		}
		await prisma.receiptDetails.delete({
			where: { id: parseInt(id as string) },
		});
		// delete image from cloudinary
		await deleteFromCloudinary(receipt.generatedReceipt_public_id || "");
		res.status(200).json({
			success: true,
			message: "Receipt deleted successfully",
		});
	}
);

export const approveReceipt = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const receipt = await prisma.receiptDetails.findFirst({
			where: { id: parseInt(id as string) },
		});
		if (!receipt) {
			res.status(404).json({
				success: false,
				message: "Receipt not found",
				error: true,
			});
			return;
		}
		const pdfBuffer = await generateReceiptPDF(receipt);
		if (!pdfBuffer) {
			res.status(500).json({
				success: false,
				message: "Failed to generate PDF",
				error: true,
			});
			return;
		}
		const generatedPdf = await uploadReceiptToCloudinary(pdfBuffer);
		await prisma.receiptDetails.update({
			where: { id: parseInt(id as string) },
			data: {
				paymentStatus: "APPROVED",
				generatedReceipt: generatedPdf.secure_url,
				generatedReceipt_public_id: generatedPdf.public_id,
			},
		});
		if (!receipt.email) {
			res.status(200).json({
				success: true,
				message: "Email not provided",
			});
		} else {
			await sendMailWithAttachment(
				receipt.email,
				"Receipt Request Approved",
				approvedReceiptMail(
					receipt.name,
					receipt.amount,
					receipt.transactionId || "Not Given",
					receipt.donationFor
				),
				pdfBuffer,
				receipt.name
			);
			res.status(200).json({
				success: true,
				message: "Receipt approved successfully",
			});
		}
	}
);
export const denyReceipt = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const receipt = await prisma.receiptDetails.findFirst({
		where: { id: parseInt(id as string) },
	});
	if (!receipt) {
		res.status(404).json({
			success: false,
			message: "Receipt not found",
			error: true,
		});
		return;
	}
	await prisma.receiptDetails.update({
		where: { id: parseInt(id as string) },
		data: { paymentStatus: "DENIED" },
	});
	if (!receipt.email) {
		res.status(200).json({
			success: true,
			message: "Receipt denied successfully",
		});
	} else {
		await sendMail(
			receipt.email,
			"Receipt Request Denied",
			denyReceiptMail(
				receipt.name,
				receipt.amount,
				receipt.transactionId || "Not Given",
				receipt.donationFor
			)
		);
		res.status(200).json({
			success: true,
			message: "Receipt denied successfully",
		});
	}
});
