import { Request, Response } from "express";
import prisma from "../prisma";
import { asyncHandler } from "../utils/asyncHandler";

export const getGlobalSettings = asyncHandler(
	async (req: Request, res: Response) => {
		let settings = await prisma.globalSettings.findFirst();

		if (!settings) {
			settings = await prisma.globalSettings.create({
				data: {},
			});
		}

		res.status(200).json({
			message: "Global settings fetched successfully",
			data: settings,
			error: false,
			success: true,
		});
	}
);

export const updateGlobalSettings = asyncHandler(
	async (req: Request, res: Response) => {
		const { scholarshipStartDate, scholarshipEndDate } = req.body;

		let settings = await prisma.globalSettings.findFirst();

		if (!settings) {
			settings = await prisma.globalSettings.create({
				data: {
					scholarshipStartDate: scholarshipStartDate ? new Date(scholarshipStartDate) : null,
					scholarshipEndDate: scholarshipEndDate ? new Date(scholarshipEndDate) : null,
				},
			});
		} else {
			settings = await prisma.globalSettings.update({
				where: { id: settings.id },
				data: {
					scholarshipStartDate: scholarshipStartDate ? new Date(scholarshipStartDate) : null,
					scholarshipEndDate: scholarshipEndDate ? new Date(scholarshipEndDate) : null,
				},
			});
		}

		// Implement globally across all scholarships by setting their individual dates
		await prisma.scholarships.updateMany({
			data: {
				startDate: scholarshipStartDate ? new Date(scholarshipStartDate) : null,
				endDate: scholarshipEndDate ? new Date(scholarshipEndDate) : null,
			}
		});

		res.status(200).json({
			message: "Settings updated successfully",
			data: settings,
			error: false,
			success: true,
		});
	}
);
