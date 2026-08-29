import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../prisma";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";

export const addScholarshipDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { title } = req.body;
		const file = (req as any).file;
		if (!title) {
			res.status(400).json({
				success: false,
				message: "All fields are required",
				error: true,
			});
			return;
		}
		if (file && file.size > 10* 1024 * 1024) {
			res.status(400).json({
				success: false,
				message: "File size must be less than 10MB",
				error: true,
			});
			return;
		}
		const isExists = await prisma.scholarshipDocuments.findFirst({
			where: { title },
		});
		if (isExists) {
			res.status(400).json({
				success: false,
				message: "Document with this title already exists",
				error: true,
			});
			return;
		}
		let fileLink = null;
		if (file) {
			fileLink = await uploadOnCloudinary(file.path);
		}

		const response = await prisma.scholarshipDocuments.create({
			data: {
				title,
				link: fileLink?.secure_url || "",
				link_public_id: fileLink?.public_id || "",
			},
		});
		res.status(201).json({
			success: true,
			data: response,
			message: "Document added successfully",
			error: false,
		});
	}
);
export const getAllScholarshipDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { search } = req.query;

		const response = await prisma.scholarshipDocuments.findMany({
			// take: Number(limit) || 10,
			// skip: (Number(page) - 1) * Number(limit) || 0,
			// search name if search keyword exist
			where: {
				title: {
					contains: (search as string) || "",
				},
			},
			select: {
				id: true,
				title: true,
				link: true,
			},
		});

		res.status(200).json({
			message: "Documents fetched successfully",
			response,
			error: false,
			success: true,
		});
	}
);
export const deleteScholarshipDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const data = await prisma.scholarshipDocuments.findUnique({
			where: { id: parseInt(id as string) },
		});
		if (!data) {
			res.status(404).json({
				message: "Document not found",
				data: [],
				error: true,
				success: false,
			});
			return;
		}
		const response = await prisma.scholarshipDocuments.delete({
			where: { id: parseInt(id as string) },
		});
		const deleteThumbnail = await deleteFromCloudinary(
			response.link_public_id || ""
		);
		res.status(200).json({
			message: "Document deleted successfully",
			error: false,
			success: true,
		});
	}
);
export const updateScholarshipDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { title } = req.body;

		const file = (req as any).file;

		const { id } = req.params;

		if (!title) {
			res.status(400).json({
				success: false,
				message: "Please provide all required fields",
				error: true,
			});
			return;
		}

		const isExist = await prisma.scholarshipDocuments.findFirst({
			where: { id: parseInt(id as string) },
		});
		if (!isExist) {
			res
				.status(404)
				.json({ success: false, message: "Event not found", error: true });
			return;
		}

		if (file && file.size > 10* 1024 * 1024) {
			res.status(400).json({
				success: false,
				message: "File size must be less than 10MB",
				error: true,
			});
			return;
		}
		let fileLinkExist = "",
			fileLinkExistId = null;
		if (!file) {
			fileLinkExist = isExist.link || "";
			fileLinkExistId = isExist.link_public_id;
		}

		let fileLink = null;
		if (file) {
			if (isExist.link_public_id) {
				await deleteFromCloudinary(isExist.link_public_id);
			}
			fileLink = await uploadOnCloudinary(file.path);
		}

		const updateData = await prisma.scholarshipDocuments.update({
			where: { id: parseInt(id as string) },
			data: {
				title,
				link: fileLink?.secure_url || fileLinkExist,
				link_public_id: fileLink?.public_id || fileLinkExistId,
			},
		});

		res.status(201).json({
			message: "Document updated successfully",
			data: updateData,
			error: false,
			success: true,
		});
	}
);

export const addKanchenjungaDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { title } = req.body;
		const file = (req as any).file;
		if (!title) {
			res.status(400).json({
				success: false,
				message: "All fields are required",
				error: true,
			});
			return;
		}
		if (file && file.size > 10* 1024 * 1024) {
			res.status(400).json({
				success: false,
				message: "File size must be less than 10MB",
				error: true,
			});
			return;
		}
		const isExists = await prisma.kanchenjungaDocuments.findFirst({
			where: { title },
		});
		if (isExists) {
			res.status(400).json({
				success: false,
				message: "Document with this title already exists",
				error: true,
			});
			return;
		}
		let fileLink = null;
		if (file) {
			fileLink = await uploadOnCloudinary(file.path);
		}

		const response = await prisma.kanchenjungaDocuments.create({
			data: {
				title,
				link: fileLink?.secure_url || "",
				link_public_id: fileLink?.public_id || "",
			},
		});
		res.status(201).json({
			success: true,
			data: response,
			message: "Document added successfully",
			error: false,
		});
	}
);
export const getAllKanchenjungaDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { search } = req.query;

		const response = await prisma.kanchenjungaDocuments.findMany({
			// take: Number(limit) || 10,
			// skip: (Number(page) - 1) * Number(limit) || 0,
			// search name if search keyword exist
			where: {
				title: {
					contains: (search as string) || "",
				},
			},
			select: {
				id: true,
				title: true,
				link: true,
			},
		});

		res.status(200).json({
			message: "Documents fetched successfully",
			response,
			error: false,
			success: true,
		});
	}
);
export const deleteKanchenjungaDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const data = await prisma.kanchenjungaDocuments.findUnique({
			where: { id: parseInt(id as string) },
		});
		if (!data) {
			res.status(404).json({
				message: "Document not found",
				data: [],
				error: true,
				success: false,
			});
			return;
		}
		const response = await prisma.kanchenjungaDocuments.delete({
			where: { id: parseInt(id as string) },
		});
		const deleteThumbnail = await deleteFromCloudinary(
			response.link_public_id || ""
		);
		res.status(200).json({
			message: "Document deleted successfully",
			error: false,
			success: true,
		});
	}
);
export const updateKanchenjungaDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { title } = req.body;

		const file = (req as any).file;

		const { id } = req.params;

		if (!title) {
			res.status(400).json({
				success: false,
				message: "Please provide all required fields",
				error: true,
			});
			return;
		}

		const isExist = await prisma.kanchenjungaDocuments.findFirst({
			where: { id: parseInt(id as string) },
		});
		if (!isExist) {
			res
				.status(404)
				.json({ success: false, message: "Event not found", error: true });
			return;
		}

		if (file && file.size > 10* 1024 * 1024) {
			res.status(400).json({
				success: false,
				message: "File size must be less than 10MB",
				error: true,
			});
			return;
		}
		let fileLinkExist = "",
			fileLinkExistId = null;
		if (!file) {
			fileLinkExist = isExist.link || "";
			fileLinkExistId = isExist.link_public_id;
		}

		let fileLink = null;
		if (file) {
			if (isExist.link_public_id) {
				await deleteFromCloudinary(isExist.link_public_id);
			}
			fileLink = await uploadOnCloudinary(file.path);
		}

		const updateData = await prisma.kanchenjungaDocuments.update({
			where: { id: parseInt(id as string) },
			data: {
				title,
				link: fileLink?.secure_url || fileLinkExist,
				link_public_id: fileLink?.public_id || fileLinkExistId,
			},
		});

		res.status(201).json({
			message: "Document updated successfully",
			data: updateData,
			error: false,
			success: true,
		});
	}
);

export const addGivingBackDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { title } = req.body;
		const file = (req as any).file;
		if (!title) {
			res.status(400).json({
				success: false,
				message: "All fields are required",
				error: true,
			});
			return;
		}
		if (file && file.size > 10* 1024 * 1024) {
			res.status(400).json({
				success: false,
				message: "File size must be less than 10MB",
				error: true,
			});
			return;
		}
		const isExists = await prisma.givingBackDocuments.findFirst({
			where: { title },
		});
		if (isExists) {
			res.status(400).json({
				success: false,
				message: "Document with this title already exists",
				error: true,
			});
			return;
		}
		let fileLink = null;
		if (file) {
			fileLink = await uploadOnCloudinary(file.path);
		}

		const response = await prisma.givingBackDocuments.create({
			data: {
				title,
				link: fileLink?.secure_url || "",
				link_public_id: fileLink?.public_id || "",
			},
		});
		res.status(201).json({
			success: true,
			data: response,
			message: "Document added successfully",
			error: false,
		});
	}
);
export const getAllGivingBackDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { search } = req.query;

		const response = await prisma.givingBackDocuments.findMany({
			// take: Number(limit) || 10,
			// skip: (Number(page) - 1) * Number(limit) || 0,
			// search name if search keyword exist
			where: {
				title: {
					contains: (search as string) || "",
				},
			},
			select: {
				id: true,
				title: true,
				link: true,
			},
		});

		res.status(200).json({
			message: "Documents fetched successfully",
			response,
			error: false,
			success: true,
		});
	}
);
export const deleteGivingBackDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const data = await prisma.givingBackDocuments.findUnique({
			where: { id: parseInt(id as string) },
		});
		if (!data) {
			res.status(404).json({
				message: "Document not found",
				data: [],
				error: true,
				success: false,
			});
			return;
		}
		const response = await prisma.givingBackDocuments.delete({
			where: { id: parseInt(id as string) },
		});
		const deleteThumbnail = await deleteFromCloudinary(
			response.link_public_id || ""
		);
		res.status(200).json({
			message: "Document deleted successfully",
			error: false,
			success: true,
		});
	}
);
export const updateGivingBackDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { title } = req.body;

		const file = (req as any).file;

		const { id } = req.params;

		if (!title) {
			res.status(400).json({
				success: false,
				message: "Please provide all required fields",
				error: true,
			});
			return;
		}

		const isExist = await prisma.givingBackDocuments.findFirst({
			where: { id: parseInt(id as string) },
		});
		if (!isExist) {
			res
				.status(404)
				.json({ success: false, message: "Event not found", error: true });
			return;
		}

		if (file && file.size > 10* 1024 * 1024) {
			res.status(400).json({
				success: false,
				message: "File size must be less than 10MB",
				error: true,
			});
			return;
		}
		let fileLinkExist = "",
			fileLinkExistId = null;
		if (!file) {
			fileLinkExist = isExist.link || "";
			fileLinkExistId = isExist.link_public_id;
		}

		let fileLink = null;
		if (file) {
			if (isExist.link_public_id) {
				await deleteFromCloudinary(isExist.link_public_id);
			}
			fileLink = await uploadOnCloudinary(file.path);
		}

		const updateData = await prisma.givingBackDocuments.update({
			where: { id: parseInt(id as string) },
			data: {
				title,
				link: fileLink?.secure_url || fileLinkExist,
				link_public_id: fileLink?.public_id || fileLinkExistId,
			},
		});

		res.status(201).json({
			message: "Document updated successfully",
			data: updateData,
			error: false,
			success: true,
		});
	}
);

export const addauditReportDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { title } = req.body;
		const file = (req as any).file;
		if (!title) {
			res.status(400).json({
				success: false,
				message: "All fields are required",
				error: true,
			});
			return;
		}
		if (file && file.size > 10* 1024 * 1024) {
			res.status(400).json({
				success: false,
				message: "File size must be less than 10MB",
				error: true,
			});
			return;
		}
		const isExists = await prisma.auditReport.findFirst({
			where: { title },
		});
		if (isExists) {
			res.status(400).json({
				success: false,
				message: "Document with this title already exists",
				error: true,
			});
			return;
		}
		let fileLink = null;
		if (file) {
			fileLink = await uploadOnCloudinary(file.path);
		}

		const response = await prisma.auditReport.create({
			data: {
				title,
				link: fileLink?.secure_url || "",
				link_public_id: fileLink?.public_id || "",
			},
		});
		res.status(201).json({
			success: true,
			data: response,
			message: "Document added successfully",
			error: false,
		});
	}
);
export const getAllauditReportDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { search } = req.query;

		const response = await prisma.auditReport.findMany({
			// take: Number(limit) || 10,
			// skip: (Number(page) - 1) * Number(limit) || 0,
			// search name if search keyword exist
			where: {
				title: {
					contains: (search as string) || "",
				},
			},
			select: {
				id: true,
				title: true,
				link: true,
			},
		});

		res.status(200).json({
			message: "Documents fetched successfully",
			response,
			error: false,
			success: true,
		});
	}
);
export const deleteauditReportkDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const data = await prisma.auditReport.findUnique({
			where: { id: parseInt(id as string) },
		});
		if (!data) {
			res.status(404).json({
				message: "Document not found",
				data: [],
				error: true,
				success: false,
			});
			return;
		}
		const response = await prisma.auditReport.delete({
			where: { id: parseInt(id as string) },
		});
		const deleteThumbnail = await deleteFromCloudinary(
			response.link_public_id || ""
		);
		res.status(200).json({
			message: "Document deleted successfully",
			error: false,
			success: true,
		});
	}
);
export const updateauditReportDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { title } = req.body;

		const file = (req as any).file;

		const { id } = req.params;

		if (!title) {
			res.status(400).json({
				success: false,
				message: "Please provide all required fields",
				error: true,
			});
			return;
		}

		const isExist = await prisma.auditReport.findFirst({
			where: { id: parseInt(id as string) },
		});
		if (!isExist) {
			res
				.status(404)
				.json({ success: false, message: "Event not found", error: true });
			return;
		}

		if (file && file.size > 10* 1024 * 1024) {
			res.status(400).json({
				success: false,
				message: "File size must be less than 10MB",
				error: true,
			});
			return;
		}
		let fileLinkExist = "",
			fileLinkExistId = null;
		if (!file) {
			fileLinkExist = isExist.link || "";
			fileLinkExistId = isExist.link_public_id;
		}

		let fileLink = null;
		if (file) {
			if (isExist.link_public_id) {
				await deleteFromCloudinary(isExist.link_public_id);
			}
			fileLink = await uploadOnCloudinary(file.path);
		}

		const updateData = await prisma.auditReport.update({
			where: { id: parseInt(id as string) },
			data: {
				title,
				link: fileLink?.secure_url || fileLinkExist,
				link_public_id: fileLink?.public_id || fileLinkExistId,
			},
		});

		res.status(201).json({
			message: "Document updated successfully",
			data: updateData,
			error: false,
			success: true,
		});
	}
);


export const addAgmMomDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { title } = req.body;
		const file = (req as any).file;
		if (!title) {
			res.status(400).json({
				success: false,
				message: "All fields are required",
				error: true,
			});
			return;
		}
		if (file && file.size > 10* 1024 * 1024) {
			res.status(400).json({
				success: false,
				message: "File size must be less than 10MB",
				error: true,
			});
			return;
		}
		const isExists = await prisma.agmMomDocuments.findFirst({
			where: { title },
		});
		if (isExists) {
			res.status(400).json({
				success: false,
				message: "Document with this title already exists",
				error: true,
			});
			return;
		}
		let fileLink = null;
		if (file) {
			fileLink = await uploadOnCloudinary(file.path);
		}

		const response = await prisma.agmMomDocuments.create({
			data: {
				title,
				link: fileLink?.secure_url || "",
				link_public_id: fileLink?.public_id || "",
			},
		});
		res.status(201).json({
			success: true,
			data: response,
			message: "Document added successfully",
			error: false,
		});
	}
);
export const getAllAgmMomDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { search } = req.query;

		const response = await prisma.agmMomDocuments.findMany({
			// take: Number(limit) || 10,
			// skip: (Number(page) - 1) * Number(limit) || 0,
			// search name if search keyword exist
			where: {
				title: {
					contains: (search as string) || "",
				},
			},
			select: {
				id: true,
				title: true,
				link: true,
			},
		});

		res.status(200).json({
			message: "Documents fetched successfully",
			response,
			error: false,
			success: true,
		});
	}
);
export const deleteAgmMomkDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const data = await prisma.agmMomDocuments.findUnique({
			where: { id: parseInt(id as string) },
		});
		if (!data) {
			res.status(404).json({
				message: "Document not found",
				data: [],
				error: true,
				success: false,
			});
			return;
		}
		const response = await prisma.agmMomDocuments.delete({
			where: { id: parseInt(id as string) },
		});
		const deleteThumbnail = await deleteFromCloudinary(
			response.link_public_id || ""
		);
		res.status(200).json({
			message: "Document deleted successfully",
			error: false,
			success: true,
		});
	}
);
export const updateAgmMomDocs = asyncHandler(
	async (req: Request, res: Response) => {
		const { title } = req.body;

		const file = (req as any).file;

		const { id } = req.params;

		if (!title) {
			res.status(400).json({
				success: false,
				message: "Please provide all required fields",
				error: true,
			});
			return;
		}

		const isExist = await prisma.agmMomDocuments.findFirst({
			where: { id: parseInt(id as string) },
		});
		if (!isExist) {
			res
				.status(404)
				.json({ success: false, message: "Event not found", error: true });
			return;
		}

		if (file && file.size > 10* 1024 * 1024) {
			res.status(400).json({
				success: false,
				message: "File size must be less than 10MB",
				error: true,
			});
			return;
		}
		let fileLinkExist = "",
			fileLinkExistId = null;
		if (!file) {
			fileLinkExist = isExist.link || "";
			fileLinkExistId = isExist.link_public_id;
		}

		let fileLink = null;
		if (file) {
			if (isExist.link_public_id) {
				await deleteFromCloudinary(isExist.link_public_id);
			}
			fileLink = await uploadOnCloudinary(file.path);
		}

		const updateData = await prisma.agmMomDocuments.update({
			where: { id: parseInt(id as string) },
			data: {
				title,
				link: fileLink?.secure_url || fileLinkExist,
				link_public_id: fileLink?.public_id || fileLinkExistId,
			},
		});

		res.status(201).json({
			message: "Document updated successfully",
			data: updateData,
			error: false,
			success: true,
		});
	}
);
