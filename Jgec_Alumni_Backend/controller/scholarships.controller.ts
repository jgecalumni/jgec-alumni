import { Request, Response } from "express";
import prisma from "../prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import { sendMail } from "../utils/mailer";
import { ScholarshipApplicationMail } from "../utils/mail-templates";
import fs from "fs";
import path from "path";
// all scholarships controller functions - create, update, delete and get all scholarships
export const getAllScholarshipsAdmin = asyncHandler(
	async (req: Request, res: Response) => {
		const { limit, page, search } = req.query;

		const count = await prisma.scholarships.count({
			where: {
				name: {
					contains: (search as string) || "",
				},
			},
		});
		const scholarships = await prisma.scholarships.findMany({
			take: Number(limit) || 10,
			skip: (Number(page) - 1) * Number(limit) || 0,
			// search name if search keyword exist
			where: {
				name: {
					contains: (search as string) || "",
				},
			},
			select: {
				id: true,
				name: true,
				subtitle: true,
				providerName: true,
				providerDepartment: true,
				providerPassingYear: true,
				providerImage: true,
				providerDescription: true,
				description: true,
				whoCanApply: true,
				whenToApply: true,
				ageLimit: true,
				amountDetails: true,
				semRequire: true,
				isActive: true,
				department: true,
				startDate: true,
				endDate: true,
				// scholarshipApplicants: {
				// 	select: {
				// 		id: true,
				// 		name: true,
				// 		email: true,
				// 		contactHome: true,
				// 		contact: true,
				// 		department: true,
				// 		studentId: true,
				// 		dob: true,
				// 		fatherOccupation: true,
				// 		numberofdirectfamilyMembers: true,
				// 		totalEarningMembers: true,
				// 		totalFamilyIncome: true,
				// 		eachFamilyIncome: true,
				// 		jgecIntakeYear: true,
				// 		jgecPassingYear: true,
				// 		extraCurricularActivities: true,
				// 		percentHigherSecondary: true,
				// 		sem_1st: true,
				// 		sem_2nd: true,
				// 		sem_3rd: true,
				// 		sem_4th: true,
				// 		sem_5th: true,
				// 		average: true,
				// 		residentialAddress: true,
				// 		specialAchievement: true,
				// 		jobCampusing: true,
				// 	},
				// },
				_count: {
					select: { scholarshipApplicants: true }
				}
			},
		});

		res.status(200).json({
			message: "Scholarships fetched successfully",
			scholarships,
			error: false,
			success: true,
			docCount: count,
			totalPages: Math.ceil(count / (Number(limit) || 10)),
			page: Number(page) || 1,
			limit: Number(limit) || 10,
		});
	}
);
export const getAllScholarships = asyncHandler(
	async (req: Request, res: Response) => {
		const { search, limit, page } = req.query;

		const count = await prisma.scholarships.count({
			where: {
				name: {
					contains: (search as string) || "",
				},
			},
		});
		const scholarships = await prisma.scholarships.findMany({
			// search name if search keyword exist
			where: {
				name: {
					contains: (search as string) || "",
				},
			},
			select: {
				id: true,
				name: true,
				subtitle: true,
				providerName: true,
				providerDepartment: true,
				providerPassingYear: true,
				providerImage: true,
				providerDescription: true,
				description: true,
				whoCanApply: true,
				whenToApply: true,
				ageLimit: true,
				amountDetails: true,
				semRequire: true,
				isActive: true,
				department: true,
				startDate: true,
				endDate: true,
				// scholarshipApplicants: {
				// 	select: {
				// 		id: true,
				// 		name: true,
				// 		email: true,
				// 		contactHome: true,
				// 		contact: true,
				// 		department: true,
				// 		studentId: true,
				// 		dob: true,
				// 		fatherOccupation: true,
				// 		numberofdirectfamilyMembers: true,
				// 		totalEarningMembers: true,
				// 		totalFamilyIncome: true,
				// 		eachFamilyIncome: true,
				// 		jgecIntakeYear: true,
				// 		jgecPassingYear: true,
				// 		extraCurricularActivities: true,
				// 		percentHigherSecondary: true,
				// 		sem_1st: true,
				// 		sem_2nd: true,
				// 		sem_3rd: true,
				// 		sem_4th: true,
				// 		sem_5th: true,
				// 		average: true,
				// 		residentialAddress: true,
				// 		specialAchievement: true,
				// 		jobCampusing: true,
				// 	},
				// },
				_count: {
					select: { scholarshipApplicants: true }
				}
			},
		});

		res.status(200).json({
			message: "Scholarships fetched successfully",
			scholarships,
			error: false,
			success: true,
			docCount: count,
			totalPages: Math.ceil(count / (Number(limit) || 10)),
			page: Number(page) || 1,
			limit: Number(limit) || 10,
		});
	}
);

export const getScholarshipById = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		// Fetch scholarship details by scholarshipId
		const scholarship = await prisma.scholarships.findUnique({
			where: {
				id: Number(id),
			},
			select: {
				id: true,
				name: true,
				subtitle: true,
				providerName: true,
				providerDepartment: true,
				providerPassingYear: true,
				providerImage: true,
				providerDescription: true,
				description: true,
				whoCanApply: true,
				whenToApply: true,
				ageLimit: true,
				amountDetails: true,
				semRequire: true,
				isActive: true,
				department: true,
				startDate: true,
				endDate: true,
				// scholarshipApplicants: {
				// 	select: {
				// 		id: true,
				// 		name: true,
				// 		email: true,
				// 		contactHome: true,
				// 		contact: true,
				// 		department: true,
				// 		studentId: true,
				// 		dob: true,
				// 		fatherOccupation: true,
				// 		numberofdirectfamilyMembers: true,
				// 		totalEarningMembers: true,
				// 		totalFamilyIncome: true,
				// 		eachFamilyIncome: true,
				// 		jgecIntakeYear: true,
				// 		jgecPassingYear: true,
				// 		extraCurricularActivities: true,
				// 		percentHigherSecondary: true,
				// 		sem_1st: true,
				// 		sem_2nd: true,
				// 		sem_3rd: true,
				// 		sem_4th: true,
				// 		sem_5th: true,
				// 		average: true,
				// 		residentialAddress: true,
				// 		specialAchievement: true,
				// 		jobCampusing: true,
				// 	},
				// },
				_count: {
					select: { scholarshipApplicants: true }
				}
			},
		});

		// If no scholarship is found
		if (!scholarship) {
			res.status(404).json({
				success: false,
				message: "Scholarship not found",
				error: true,
			});
			return;
		}

		res.status(200).json({
			message: "Scholarship fetched successfully",
			data: scholarship,
			error: false,
			success: true,
		});
	}
);

export const addNewScholarship = asyncHandler(
	async (req: Request, res: Response) => {
		const {
			name,
			subtitle,
			providerName,
			providerDepartment,
			providerPassingYear,
			providerDescription,
			description,
			whoCanApply,
			whenToApply,
			ageLimit,
			amountDetails,
			semRequire,
			isActive,
			department,
			startDate,
			endDate,
		} = req.body;
		const providerImage = (req as any).file;
		if (
			!(
				name &&
				subtitle &&
				providerName &&
				providerDepartment &&
				providerPassingYear &&
				providerDescription &&
				description &&
				whoCanApply &&
				whenToApply &&
				ageLimit &&
				amountDetails &&
				semRequire &&
				department
			)
		) {
			res.status(400).json({
				success: false,
				message: "Please provide all required fields",
				error: true,
			});
			return;
		}

		// Check if scholarship already exists
		const updateName = String(name).toLowerCase().trim();
		const isExist = await prisma.scholarships.findFirst({
			where: { name: updateName },
		});

		if (isExist) {
			res.status(400).json({
				success: false,
				message: "Scholarship already exists",
				error: true,
			});
			return;
		}

		const fileLink = await uploadOnCloudinary(providerImage.path);

		// Create new scholarship
		const newScholarship = await prisma.scholarships.create({
			data: {
				name,
				subtitle,
				providerName,
				providerDepartment,
				providerPassingYear: parseInt(providerPassingYear),
				providerImage: fileLink?.url || "",
				providerImage_public_id: fileLink?.public_id || "",
				providerDescription,
				description,
				whoCanApply,
				whenToApply,
				ageLimit,
				amountDetails,
				semRequire,
				isActive: isActive === "Yes" ? true : false,
				department,
				startDate: startDate ? new Date(startDate) : null,
				endDate: endDate ? new Date(endDate) : null,
			},
			select: {
				id: true,
				name: true,
				subtitle: true,
				providerName: true,
				providerDepartment: true,
				providerPassingYear: true,
				providerImage: true,
				providerImage_public_id: true,
				providerDescription: true,
				description: true,
				whoCanApply: true,
				whenToApply: true,
				ageLimit: true,
				amountDetails: true,
				semRequire: true,
				isActive: true,
				department: true,
			},
		});

		res.status(201).json({
			message: "Scholarship added successfully",
			data: newScholarship,
			error: false,
			success: true,
		});
	}
);

export const updateScholarship = asyncHandler(
	async (req: Request, res: Response) => {
		const {
			name,
			subtitle,
			providerName,
			providerDepartment,
			providerPassingYear,
			providerDescription,
			description,
			whoCanApply,
			whenToApply,
			ageLimit,
			amountDetails,
			semRequire,
			isActive,
			department,
			startDate,
			endDate,
		} = req.body;

		const providerImage = (req as any).file;
		const { id } = req.params;

		//  Check if all required fields are provided
		if (
			!(
				name &&
				subtitle &&
				providerName &&
				providerDescription &&
				providerDepartment &&
				providerPassingYear &&
				description &&
				whoCanApply &&
				whenToApply &&
				ageLimit &&
				amountDetails &&
				semRequire &&
				department
			)
		) {
			res.status(400).json({
				success: false,
				message: "Please provide all required fields",
				error: true,
			});
			return;
		}

		// Check if scholarship already exists
		const isExist = await prisma.scholarships.findFirst({
			where: { id: parseInt(id as string) },
		});
		if (!isExist) {
			res.status(404).json({
				success: false,
				message: "Scholarship is not exists",
				error: true,
			});
			return;
		}
		let fileLinkExist = isExist.providerImage || "";
		let fileLinkExistId = isExist.providerImage_public_id || "";
		let fileLink = null;

		if (providerImage) {
			if (isExist.providerImage_public_id) {
				await deleteFromCloudinary(isExist.providerImage_public_id);
			}
			fileLink = await uploadOnCloudinary(providerImage.path);
		}

		// Update scholarship
		const updatedScholarship = await prisma.scholarships.update({
			where: { id: parseInt(id as string) },
			data: {
				name,
				subtitle,
				providerName,
				providerDepartment,
				providerPassingYear: parseInt(providerPassingYear),
				providerImage: fileLink?.url || fileLinkExist,
				providerImage_public_id: fileLink?.public_id || fileLinkExistId,
				providerDescription,
				description,
				whoCanApply,
				whenToApply,
				ageLimit,
				amountDetails,
				semRequire,
				isActive: isActive === "Yes" || isActive === "true" ? true : false,
				department,
				startDate: startDate ? new Date(startDate) : null,
				endDate: endDate ? new Date(endDate) : null,
			},
			select: {
				id: true,
				name: true,
				subtitle: true,
				providerName: true,
				providerDepartment: true,
				providerPassingYear: true,
				providerImage: true,
				providerImage_public_id: true,
				providerDescription: true,
				description: true,
				whoCanApply: true,
				whenToApply: true,
				ageLimit: true,
				amountDetails: true,
				semRequire: true,
				isActive: true,
				department: true,
			},
		});

		res.status(201).json({
			message: "Scholarship updated successfully",
			data: updatedScholarship,
			error: false,
			success: true,
		});
	}
);

export const deleteScholarship = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		// Check if scholarship already exists
		const isExist = await prisma.scholarships.findFirst({
			where: { id: Number(id) },
		});

		if (!isExist) {
			res.status(404).json({
				success: false,
				message: "Scholarship is not exists",
				error: true,
			});
			return;
		}

		// Delete scholarship
		await prisma.scholarships.delete({ where: { id: Number(id) } });
		const deleteThumbnail = await deleteFromCloudinary(
			isExist.providerImage_public_id || ""
		);

		res.status(200).json({
			message: "Scholarship deleted successfully",
			error: false,
			success: true,
		});
	}
);

// apply for scholarship controller functions - create, update, delete and get all applications

export const getAllScholarshipApplications = asyncHandler(
	async (req: Request, res: Response) => {
		const { limit, page, search, scholarshipId } = req.query;

		const totalCount = await prisma.scholarshipApplication.count({
			where: {
				scholarshipId: {
					equals: parseInt(scholarshipId as string) || 0,
				},
				name: {
					contains: (search as string) || "",
				},
			},
		});
		const allApplications = await prisma.scholarshipApplication.findMany({
			take: Number(limit) || 10,
			skip: (Number(page) - 1) * Number(limit) || 0,
			where: {
				scholarshipId: {
					equals: parseInt(scholarshipId as string) || 0,
				},
				name: {
					contains: (search as string) || "",
				},
			},
			select: {
				id: true,
				name: true,
				email: true,
				contactHome: true,
				contact: true,
				department: true,
				studentId: true,
				dob: true,
				fatherOccupation: true,
				numberofdirectfamilyMembers: true,
				totalEarningMembers: true,
				totalFamilyIncome: true,
				eachFamilyIncome: true,
				jgecIntakeYear: true,
				jgecPassingYear: true,
				extraCurricularActivities: true,
				percentHigherSecondary: true,
				sem_1st: true,
				sem_2nd: true,
				sem_3rd: true,
				sem_4th: true,
				sem_5th: true,
				average: true,
				residentialAddress: true,
				specialAchievement: true,
				jobCampusing: true,
				document: true,
				scholarshipDetails: {
					select: {
						id: true,
						name: true,
						description: true,
						providerName: true,
						providerImage: true,
						providerDescription: true,
					},
				},
			},
		});

		res.status(200).json({
			message: "Scholarship applications fetched successfully",
			data: allApplications,
			error: false,
			success: true,
			totalCount: totalCount,
			totalPages: Math.ceil(totalCount / (Number(limit) || 10)),
			page: Number(page) || 1,
			limit: Number(limit) || 10,
		});
	}
);

export const applicantDetails = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const applicant = await prisma.scholarshipApplication.findMany({
			where: { studentId: id as string },
			select: {
				id: true,
				name: true,
				email: true,
				contactHome: true,
				contact: true,
				department: true,
				studentId: true,
				dob: true,
				fatherOccupation: true,
				numberofdirectfamilyMembers: true,
				totalEarningMembers: true,
				totalFamilyIncome: true,
				eachFamilyIncome: true,
				jgecIntakeYear: true,
				jgecPassingYear: true,
				extraCurricularActivities: true,
				percentHigherSecondary: true,
				sem_1st: true,
				sem_2nd: true,
				sem_3rd: true,
				sem_4th: true,
				sem_5th: true,
				average: true,
				residentialAddress: true,
				specialAchievement: true,
				jobCampusing: true,
				document: true,
				scholarshipDetails: {
					select: {
						id: true,
						name: true,
						description: true,
						providerName: true,
						providerImage: true,
						providerDescription: true,
					},
				},
			},
		});

		if (!applicant) {
			res.status(404).json({
				success: false,
				message: "Applicant details not found",
				error: true,
			});
			return;
		}

		res.status(200).json({
			message: "Applicant details fetched successfully",
			data: applicant,
			error: false,
			success: true,
		});
	}
);

export const applyForScholarship = asyncHandler(
	async (req: Request, res: Response) => {
		const {
			name,
			scholarshipId,
			studentId,
			dob,
			contactHome,
			contact,
			email,
			fatherOccupation,
			numberofdirectfamilyMembers,
			totalEarningMembers,
			totalFamilyIncome,
			eachFamilyIncome,
			jgecIntakeYear,
			jgecPassingYear,
			percentHigherSecondary,
			extraCurricularActivities,
			residentialAddress,
			sem_1st,
			sem_2nd,
			sem_3rd,
			sem_4th,
			sem_5th,
			rank,
			average,
			department,
			specialAchievement,
		} = req.body;

		console.log(studentId);

		if (
			!(
				name &&
				scholarshipId &&
				studentId &&
				dob &&
				contactHome &&
				contact &&
				email &&
				fatherOccupation &&
				numberofdirectfamilyMembers &&
				totalEarningMembers &&
				totalFamilyIncome &&
				eachFamilyIncome &&
				jgecIntakeYear &&
				jgecPassingYear &&
				percentHigherSecondary &&
				residentialAddress &&
				department && rank && req.file
			)
		) {
			res.status(400).json({
				success: false,
				message: "Please provide all required fields",
				error: true,
			});
			return;
		}

		// Check application dates
		const targetScholarship = await prisma.scholarships.findUnique({
			where: { id: parseInt(scholarshipId) },
		});

		if (!targetScholarship) {
			res.status(404).json({
				success: false,
				message: "Scholarship not found",
				error: true,
			});
			return;
		}

		const globalSettings = await prisma.globalSettings.findFirst();

		const currentDate = new Date();
		const startDate = targetScholarship.startDate || globalSettings?.scholarshipStartDate;
		const endDate = targetScholarship.endDate || globalSettings?.scholarshipEndDate;

		if (startDate && currentDate < startDate) {
			res.status(400).json({
				success: false,
				message: "Scholarship application window has not started yet.",
				error: true,
			});
			return;
		}

		if (endDate && currentDate > endDate) {
			res.status(400).json({
				success: false,
				message: "Scholarship application window has closed.",
				error: true,
			});
			return;
		}

		// Check if user already applied for scholarship
		const isExist = await prisma.scholarshipApplication.findFirst({
			where: {
				scholarshipId: parseInt(scholarshipId),
				studentId: String(studentId),
			},
		});

		const applicantCount = await prisma.scholarshipApplication.count({
			where: { studentId: String(studentId) },
		});

		if (parseInt(scholarshipId) === 47 || parseInt(scholarshipId) === 48) {
			// No application limit for these scholarships
		}
		else {
			if (applicantCount >= 3) {
				res.status(400).json({
					success: false,
					message: "Maximum limit of 3 applications reached.",
					error: true,
				});
				return;
			}
		}

		if (isExist) {
			res.status(400).json({
				success: false,
				message: "You already applied for this scholarship",
				error: true,
			});
			return;
		}

		// Create new scholarship applicatio
		const newScholarshipApplication =
			await prisma.scholarshipApplication.create({
				data: {
					name,
					email,
					contactHome: String(contactHome),
					contact: String(contact),
					department,
					studentId: String(studentId),
					dob,
					rank: rank ? parseInt(rank as string) : null,
					fatherOccupation,
					numberofdirectfamilyMembers: numberofdirectfamilyMembers ? parseInt(numberofdirectfamilyMembers as string) : 0,
					totalEarningMembers: totalEarningMembers ? parseInt(totalEarningMembers as string) : null,
					totalFamilyIncome: totalFamilyIncome ? parseInt(totalFamilyIncome as string) : 0,
					eachFamilyIncome: eachFamilyIncome ? parseInt(eachFamilyIncome as string) : null,
					jgecIntakeYear,
					jgecPassingYear,
					extraCurricularActivities,
					percentHigherSecondary,
					sem_1st,
					sem_2nd,
					sem_3rd,
					sem_4th,
					sem_5th,
					average,
					residentialAddress,
					specialAchievement,
					document: req.file ? req.file.path.replace(/\\/g, '/') : null,
					scholarshipId: parseInt(scholarshipId),
				},
				select: {
					id: true,
					name: true,
					email: true,
					contactHome: true,
					contact: true,
					department: true,
					studentId: true,
					dob: true,
					rank: true,
					fatherOccupation: true,
					numberofdirectfamilyMembers: true,
					totalEarningMembers: true,
					totalFamilyIncome: true,
					eachFamilyIncome: true,
					jgecIntakeYear: true,
					jgecPassingYear: true,
					extraCurricularActivities: true,
					percentHigherSecondary: true,
					sem_1st: true,
					sem_2nd: true,
					sem_3rd: true,
					sem_4th: true,
					sem_5th: true,
					average: true,
					residentialAddress: true,
					specialAchievement: true,
					jobCampusing: true,
					document: true,
					scholarshipDetails: {
						select: {
							id: true,
							name: true,
							description: true,
							providerName: true,
							providerImage: true,
							providerDescription: true,
						},
					},
				},
			});

		const getScholarshipName = await prisma.scholarships.findFirst({
			where: {
				id: parseInt(scholarshipId),
			},
			select: {
				name: true,
			},
		});

		await sendMail(
			email,
			"Scholarship Application",
			ScholarshipApplicationMail(
				name,
				getScholarshipName?.name || "Scholarship"
			)
		);

		res.status(201).json({
			message: "Scholarship applied successfully",
			data: newScholarshipApplication,
			error: false,
			success: true,
		});
	}
);

export const deleteApplication = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		// Fetch the application first to get the document path
		const application = await prisma.scholarshipApplication.findUnique({
			where: { id: parseInt(id as string) }
		});

		if (!application) {
			return res.status(404).json({
				message: "Application not found",
				error: true,
				success: false,
			});
		}

		// Delete the application from the database
		await prisma.scholarshipApplication.delete({ where: { id: parseInt(id as string) } });

		// If there is a document attached, delete it from the server
		if (application.document) {
			const filePath = path.join(process.cwd(), application.document);
			fs.unlink(filePath, (err) => {
				if (err) {
					console.error("Failed to delete document file:", err);
				} else {
					console.log("Successfully deleted document file:", filePath);
				}
			});
		}

		res.status(200).json({
			message: "Application deleted successfully",
			error: false,
			success: true,
		});
	}
);
