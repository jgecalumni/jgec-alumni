import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../prisma";
import {
	deleteFromCloudinary,
	uploadMultipleOnCloudinary,
	uploadOnCloudinary,
} from "../utils/cloudinary";
import { error } from "console";

//gallery category

export const createCategory = asyncHandler(
	async (req: Request, res: Response) => {
		const { name } = req.body;
		if (!name) {
			res.status(400).json({ error: "Name is required" });
			return;
		}
		const isExist = await prisma.galleryCategory.findFirst({
			where: {
				name: name,
			},
		});
		if (isExist) {
			res.status(400).json({
				success: false,
				message: "Category already exists",
				error: true,
			});
			return;
		}
		const category = await prisma.galleryCategory.create({
			data: {
				name: name,
			},
		});
		res.status(201).json({
			success: true,
			data: category,
			message: "Category added successfully",
			error: false,
		});
	}
);

export const upadateCategory = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const { name } = req.body;
		console.log(name);

		if (!name) {
			res.status(400).json({ error: "Name is required" });
			return;
		}
		const isExist = await prisma.galleryCategory.findFirst({
			where: {
				id: parseInt(id as string),
			},
		});
		if (!isExist) {
			res.status(400).json({ error: "Category do not exists" });
			return;
		}
		const category = await prisma.galleryCategory.update({
			where: {
				id: parseInt(id as string),
			},
			data: {
				name: name,
			},
			select: {
				id: true,
				name: true,
				images: {
					select: {
						id: true,
						image: true,
					},
				},
			},
		});
		res.status(201).json({
			success: true,
			data: category,
			message: "Category updated successfully",
			error: false,
		});
	}
);

export const getAllCategory = asyncHandler(
	async (req: Request, res: Response) => {
		const { limit, page, search } = req.query;
		const count = await prisma.galleryCategory.count();
		const category = await prisma.galleryCategory.findMany({
			take: Number(limit) || 10,
			skip: (Number(page) - 1) * Number(limit) || 0,
			where: {
				name: {
					contains: search as string,
				},
			},
			select: {
				id: true,
				name: true,
				images: {
					select: {
						id: true,
						image: true,
					},
				},
			},
		});
		res.status(201).json({
			success: true,
			data: category,
			message: "Categories fetched successfully",
			error: false,
			totalPages: Math.ceil(count / (Number(limit) || 10)),
			page: Number(page) || 1,
			limit: Number(limit) || 10,
		});
	}
);

export const deleteCategory = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const category = await prisma.galleryCategory.findFirst({
			where: { id: parseInt(id as string) },
		});

		if (!category) {
			res.status(400).json({ error: "Category does not exist" });
			return;
		}

		const images = await prisma.galleryImages.findMany({
			where: { galleryCategoryId: parseInt(id as string) },
			select: { image_public_id: true },
		});

		const deletePromises = images.map((img: any) =>
			deleteFromCloudinary(img.image_public_id)
		);
		await Promise.all(deletePromises);

		await prisma.galleryImages.deleteMany({
			where: { galleryCategoryId: parseInt(id as string) },
		});

		const deletedCategory = await prisma.galleryCategory.delete({
			where: { id: parseInt(id as string) },
		});

		res.status(200).json({
			success: true,
			data: deletedCategory,
			message: "Category and its images deleted successfully",
			error: false,
		});
	}
);

export const getCategoryById = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const category = await prisma.galleryCategory.findUnique({
			where: { id: parseInt(id as string) },
			include: {
				images: {
					select: {
						id: true,
						image: true,
					},
				},
			},
		});
		if (!category) {
			res.status(404).json({
				success: false,
				data: [],
				message: "No images found",
				error: true,
			});
			return;
		} else {
			res.status(200).json({
				success: true,
				data: category,
				message: "Images fetched successfully",
				error: false,
			});
		}
	}
);

// gallery images

export const createGalleryImage = asyncHandler(
	async (req: Request, res: Response) => {
		const files = (req as any).files;
		if (!files || files.length === 0) {
			res.status(400).json({
				success: false,
				message: "No images uploaded",
				error: true,
			});
			return;
		}

		// Check file size for each file (30 limit)
		for (const file of files) {
			if (file.size > 30 * 1024 * 1024) {
				res.status(400).json({
					success: false,
					message: "Each file must be less than 30",
					error: true,
				});
				return;
			}
		}

		const category = await prisma.galleryCategory.findFirst({
			where: {
				id: parseInt(req.params.id as string),
			},
		});

		if (!category) {
			res.status(400).json({ error: "Category does not exist" });
			return;
		}

		const uploadedImages = await uploadMultipleOnCloudinary(files);

		if (uploadedImages.length === 0) {
			res.status(500).json({
				success: false,
				message: "Image upload failed",
				error: true,
			});
			return;
		}
		const galleryImages = await prisma.galleryImages.createMany({
			data: uploadedImages.map((img: any) => ({
				galleryCategoryId: parseInt(req.params.id as string),
				image: img.secure_url,
				image_public_id: img.public_id,
			})),
		});
		console.log(galleryImages);

		res.status(201).json({
			success: true,
			data: galleryImages,
			message: "Images uploaded successfully",
			error: false,
		});
	}
);

export const deleteGalleryImage = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const isExist = await prisma.galleryImages.findFirst({
			where: {
				id: parseInt(id as string),
			},
		});
		if (!isExist) {
			res.status(400).json({ error: "Image do not exists" });
			return;
		}
		const deleteImage = await deleteFromCloudinary(
			isExist.image_public_id || ""
		);
		const category = await prisma.galleryImages.delete({
			where: {
				id: parseInt(id as string),
			},
		});
		res.status(201).json({
			success: true,
			data: category,
			message: "Image deleted successfully",
			error: false,
		});
	}
);

export const getAllGalleryImage = asyncHandler(
	async (req: Request, res: Response) => {
		const category = await prisma.galleryImages.findMany({
			select: {
				id: true,
				image: true,
				image_public_id: true,
			},
		});
		res.status(201).json({
			success: true,
			data: category,
			message: "Images fetched successfully",
			error: false,
		});
	}
);

export const upadateGalleryImage = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const file = (req as any).file;

		const isExist = await prisma.galleryImages.findFirst({
			where: {
				id: parseInt(id as string),
			},
		});
		if (!isExist) {
			res.status(404).json({
				message: "Image not found",
				data: [],
				error: true,
				success: false,
			});
			return;
		}
		if (file && file.size > 30 * 1024 * 1024) {
			res.status(400).json({
				success: false,
				message: "File size must be less than 30",
				error: true,
			});
			return;
		}
		let fileLinkExist = "",
			fileLinkExistId = null;
		if (!file) {
			fileLinkExist = isExist.image || "";
			fileLinkExistId = isExist.image_public_id;
		}

		let fileLink = null;
		if (file) {
			if (isExist.image_public_id) {
				await deleteFromCloudinary(isExist.image_public_id);
			}
			fileLink = await uploadOnCloudinary(file.path);
		}

		const updateData = await prisma.galleryImages.update({
			where: { id: parseInt(id as string) },
			data: {
				image: fileLink?.secure_url || fileLinkExist,
				image_public_id: fileLink?.public_id || fileLinkExistId,
			},
		});

		res.status(201).json({
			message: "Image updated successfully",
			data: updateData,
			error: false,
			success: true,
		});
	}
);

export const getImagesById = asyncHandler(
	async (req: Request, res: Response) => {
		const id = req.params.id;
		const images = await prisma.galleryImages.findMany({
			where: {
				galleryCategoryId: parseInt(id as string),
			},
			select: {
				id: true,
				image: true,
				galleryCategoryId: true,
			},
		});
		if (!images) {
			res.status(404).json({
				success: false,
				data: [],
				message: "No images found",
				error: true,
			});
			return;
		}
		res.status(200).json({
			success: true,
			data: images,
			message: "Images fetched successfully",
			error: false,
		});
	}
);
