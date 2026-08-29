import prisma from "../prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import {
	generateContributionReceiptPDF,
	generateSingleContributionReceiptPDF,
} from "../utils/pdf";
import { sendMailWithAttachment, sendMail } from "../utils/mailer";
import { contributionReceiptMail } from "../utils/mail-templates";

import {
	uploadContriReceiptToCloudinary,
	uploadReceiptToCloudinary,
} from "../utils/cloudinary";

// Create a new contribution
export const createContribution = asyncHandler(
	async (req: Request, res: Response) => {
		// const { nameOfAluminus, graduationYear, amount, depositedOn, mobileNo } =
		// 	req.body;
		// // Validate required fields
		// if (
		// 	!(nameOfAluminus && graduationYear && amount && depositedOn && mobileNo)
		// ) {
		// 	res.status(400).json({
		// 		success: false,
		// 		message: "Please provide all required fields",
		// 		error: true,
		// 	});
		// 	return;
		// }
		// try {
		// 	const contribution = await prisma.contribution.create({
		// 		data: {
		// 			nameOfAluminus,
		// 			graduationYear: parseInt(graduationYear),
		// 			amount: parseFloat(amount),
		// 			depositedOn: depositedOn,
		// 			mobileNo,
		// 		},
		// 	});
		// 	if (!contribution) {
		// 		res.status(500).json({
		// 			success: false,
		// 			message: "Failed to create contribution",
		// 			error: true,
		// 		});
		// 		return;
		// 	}
		// 	res.status(201).json({
		// 		success: true,
		// 		message: "Contribution created successfully",
		// 		data: contribution,
		// 	});
		// } catch (error) {
		// 	console.error("Error creating contribution:", error);
		// 	res.status(500).json({
		// 		success: false,
		// 		message: "Internal server error",
		// 		error: true,
		// 	});
		// }
	}
);

// Get all contributions with pagination and search
export const getAllContributions = asyncHandler(
	async (req: Request, res: Response) => {
		const { search, limit, page, graduationYear } = req.query;

		try {
			const pageNum = Number(page) || 1;
			const pageSize = Number(limit) || 10;
			const skip = (pageNum - 1) * pageSize;

			const where: any = {};

			// 🎓 Graduation year filter
			if (
				graduationYear !== undefined &&
				String(graduationYear).trim() !== "" &&
				!isNaN(Number(graduationYear))
			) {
				where.graduationYear = Number(graduationYear);
			}

			// 🔍 Search filter (case-insensitive simulation)
			if (search && typeof search === "string" && search.trim().length > 0) {
				const s = search.trim();

				const orArr: any[] = [
					{ nameOfAluminus: { contains: s } },
					{ email: { contains: s } },
				];

				const possibleNum = Number(s);
				if (!isNaN(possibleNum)) {
					orArr.push({ mobileNo: possibleNum });
				}

				where.OR = orArr;
			}

			// 🧾 Paginated contributions
			const [contributions, totalCount] = await Promise.all([
				prisma.contribution.findMany({
					where,
					skip,
					take: pageSize,
				}),
				prisma.contribution.count({ where }),
			]);

			// 📊 Stats
			const allContributions = await prisma.contribution.findMany({
				where,
				select: { amount: true, graduationYear: true, depositedOn: true },
			});

			const allYearsRaw = await prisma.contribution.findMany({
				distinct: ["graduationYear"],
				select: { graduationYear: true },
			});

			const allGraduationYears = allYearsRaw
				.map((y) => y.graduationYear)
				.filter((y) => y !== null && !isNaN(Number(y)));

			const totalAmount = allContributions.reduce(
				(sum, c) => sum + (Number(c.amount) || 0),
				0
			);

			const uniqueBatches = new Set(
				allContributions.map((c) => c.graduationYear)
			).size;

			const now = new Date();
			
			const currentMonth = now.getMonth()+1;
			const currentYear = now.getFullYear();

			const monthlyContributions = allContributions.filter((c) => {
				if (!c.depositedOn) return false;
				
				const date = new Date(c.depositedOn);
				
				return (
					date.getMonth() === currentMonth && date.getFullYear() === currentYear
				);
			}).length;
			

			// 🧾 Collect all PDFs + contributor names (filtered)
			const pdfData = await prisma.contribution.findMany({
				where,
				select: {
					nameOfAluminus: true,
					pdfLink: true, // ✅ ensure this matches your schema field name
					graduationYear: true,
				},
			});

			res.status(200).json({
				success: true,
				error: false,
				message: "Contributions fetched successfully",
				data: contributions,
				docCount: totalCount,
				totalPages: Math.ceil(totalCount / pageSize),
				page: pageNum,
				limit: pageSize,
				stats: {
					totalAmount,
					totalContributions: totalCount,
					uniqueBatches,
					monthlyContributions,
				},
				allGraduationYears,
				pdfLinksAndNames: pdfData.map((c) => ({
					name: c.nameOfAluminus,
					pdf: c.pdfLink,
					graduationYear: c.graduationYear,
				})),
			});
		} catch (error) {
			console.error("Error fetching contributions:", error);
			res.status(500).json({
				success: false,
				message: "Internal server error",
				error: true,
			});
		}
	}
);

// Get a single contribution by ID
export const getContributionById = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			const contribution = await prisma.contribution.findFirst({
				where: { id: parseInt(id as string) },
			});

			if (!contribution) {
				res.status(404).json({
					success: false,
					message: "Contribution not found",
					error: true,
				});
				return;
			}

			res.status(200).json({
				success: true,
				message: "Contribution fetched successfully",
				data: contribution,
			});
		} catch (error) {
			console.error("Error fetching contribution:", error);
			res.status(500).json({
				success: false,
				message: "Internal server error",
				error: true,
			});
		}
	}
);

// Update a contribution
export const updateContribution = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { nameOfAluminus, graduationYear, amount, depositedOn, mobileNo } =
			req.body;

		try {
			const existingContribution = await prisma.contribution.findFirst({
				where: { id: parseInt(id as string) },
			});

			if (!existingContribution) {
				res.status(404).json({
					success: false,
					message: "Contribution not found",
					error: true,
				});
				return;
			}

			const updatedContribution = await prisma.contribution.update({
				where: { id: parseInt(id as string) },
				data: {
					nameOfAluminus: nameOfAluminus || existingContribution.nameOfAluminus,
					graduationYear: graduationYear
						? parseInt(graduationYear)
						: existingContribution.graduationYear,
					amount: amount ? parseFloat(amount) : existingContribution.amount,
					depositedOn: depositedOn || existingContribution.depositedOn,

					mobileNo: mobileNo || existingContribution.mobileNo,
				},
			});

			res.status(200).json({
				success: true,
				message: "Contribution updated successfully",
				data: updatedContribution,
			});
		} catch (error) {
			console.error("Error updating contribution:", error);
			res.status(500).json({
				success: false,
				message: "Internal server error",
				error: true,
			});
		}
	}
);

// Delete a contribution
export const deleteContribution = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			const contribution = await prisma.contribution.findFirst({
				where: { id: parseInt(id as string) },
			});

			if (!contribution) {
				res.status(404).json({
					success: false,
					message: "Contribution not found",
					error: true,
				});
				return;
			}

			await prisma.contribution.delete({
				where: { id: parseInt(id as string) },
			});

			res.status(200).json({
				success: true,
				message: "Contribution deleted successfully",
			});
		} catch (error) {
			console.error("Error deleting contribution:", error);
			res.status(500).json({
				success: false,
				message: "Internal server error",
				error: true,
			});
		}
	}
);

// Send individual contribution receipt via email
export const sendContributionReceipt = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { email } = req.body;

		if (!email) {
			res.status(400).json({
				success: false,
				message: "Email address is required",
				error: true,
			});
			return;
		}

		try {
			const contribution = await prisma.contribution.findFirst({
				where: { id: parseInt(id as string) },
			});

			if (!contribution) {
				res.status(404).json({
					success: false,
					message: "Contribution not found",
					error: true,
				});
				return;
			}

			// Generate receipt PDF
			const receiptPdf = await generateContributionReceiptPDF(contribution);

			// Send email with receipt
			await sendMailWithAttachment(
				email,
				"Alumni Contribution Receipt",
				contributionReceiptMail(
					contribution.nameOfAluminus,
					contribution.amount,
					contribution.graduationYear
				),
				receiptPdf,
				`contribution_receipt_${contribution.nameOfAluminus.replace(
					/\s+/g,
					"_"
				)}`
			);

			res.status(200).json({
				success: true,
				message: "Contribution receipt sent successfully",
			});
		} catch (error) {
			console.error("Error sending contribution receipt:", error);
			res.status(500).json({
				success: false,
				message: "Internal server error",
				error: true,
			});
		}
	}
);

// Bulk create contributions from Excel/CSV data

import fs from "fs";
import path from "path";
import { format } from "date-fns";

export const bulkCreateContributions = asyncHandler(
	async (req: Request, res: Response) => {
		const contributions = req.body;

		if (!Array.isArray(contributions) || contributions.length === 0) {
			res.status(400).json({
				success: false,
				message: "Please provide contributions array",
				error: true,
			});
			return;
		}

		try {
			// 1️⃣ Extract valid slNo numbers
			const slNos = contributions
				.map((c: any) => parseInt(c.SlNo))
				.filter((num: number) => !isNaN(num));

			if (slNos.length === 0) {
				res.status(400).json({
					success: false,
					message: "No valid SlNo values provided.",
					error: true,
				});
				return;
			}

			// 2️⃣ Skip already existing entries
			const existing = await prisma.contribution.findMany({
				where: { slNo: { in: slNos } },
				select: { slNo: true },
			});

			const existingIds = new Set<number>(existing.map((e) => Number(e.slNo)));

			const newContributions = contributions.filter((c: any) => {
				const slNo = Number(c.SlNo);
				return !isNaN(slNo) && !existingIds.has(slNo);
			});

			if (newContributions.length === 0) {
				res.status(200).json({
					success: true,
					message: "All contributions already exist. No new entries added.",
					data: { count: 0 },
				});
				return;
			}

			// 3️⃣ Format data for Prisma
			const formatted = newContributions.map((c: any) => ({
				slNo: Number(c.SlNo),
				nameOfAluminus: c.NameOfAlumnus?.toString() || "Unknown",
				graduationYear: Number(c.GraduationYear) || 0,
				amount: Number(c.AmountINR) || 0,
				depositedOn: c.DepositedOn?.toString() || null,
				mobileNo: c.MobileNo ? c.MobileNo.toString() : null,
				email: c.Email?.toString() || null,
			}));

			const created = await prisma.$transaction(
				formatted.map((data) => prisma.contribution.create({ data }))
			);

			// 4️⃣ Create monthly folder (e.g., "November_2025")
			const monthFolder = format(new Date(), "MMMM_yyyy");
			const baseDir = path.join(
				process.cwd(),
				"public",
				"contributions",
				monthFolder
			);
			fs.mkdirSync(baseDir, { recursive: true });

			const updatedRecords = [];

			for (const contrib of created) {
				try {
					// Generate PDF buffer
					const pdfBuffer = await generateContributionReceiptPDF(contrib);

					// Sanitize file name
					const safeName = contrib.nameOfAluminus
						.replace(/[^\w\s]/gi, "")
						.replace(/\s+/g, "_");

					// Define path inside the monthly folder
					const fileName = `receipt_${contrib.slNo}_${safeName}.pdf`;
					const pdfPath = path.join(baseDir, fileName);
					fs.writeFileSync(pdfPath, pdfBuffer);

					// Save PDF locally
					fs.writeFileSync(pdfPath, pdfBuffer);
					const localhostUrl = `https://backend.jgecalumni.in/public/contributions/${monthFolder}/${fileName}`;

					const updated = await prisma.contribution.update({
						where: { id: contrib.id },
						data: {
							pdfLink: localhostUrl, 
							pdfLink_public_id: null,
						},
					});

					updatedRecords.push(updated);
				} catch (err) {
					console.error(
						`Error generating receipt for SL No ${contrib.slNo}:`,
						err
					);
				}
			}

			res.status(201).json({
				success: true,
				message: `${updatedRecords.length} contributions created successfully. PDFs saved under '${monthFolder}'.`,
				data: {
					count: updatedRecords.length,
					files: updatedRecords.map((r) => ({
						slNo: r.slNo,
						name: r.nameOfAluminus,
						filePath: r.pdfLink,
					})),
				},
			});
		} catch (error) {
			console.error("Error bulk creating contributions:", error);
			res.status(500).json({
				success: false,
				message:
					error instanceof Error ? error.message : "Internal server error",
				error: true,
			});
		}
	}
);
