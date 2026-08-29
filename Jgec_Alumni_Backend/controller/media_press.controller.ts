import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import {
	deleteFromCloudinary,
	uploadMediaPressFileToCloudinary,
} from "../utils/cloudinary";

import prisma from "../prisma";

export const createNews = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { title, excerpt, date, location, tag, videoLinks } = req.body;
		const mediaData: { type: string; url: string }[] = [];

		if (req.files && Array.isArray(req.files)) {
			for (const file of req.files as Express.Multer.File[]) {
				const result = await uploadMediaPressFileToCloudinary(file.path);
				mediaData.push({ type: "image", url: result.secure_url });
			}
		}
		if (videoLinks) {
			const parsedVideos = JSON.parse(videoLinks);
			parsedVideos.forEach((video: { type: string; url: string }) => {
				mediaData.push({
					type: video.type,
					url: video.url,
				});
			});
		}

		const newsEntry = await prisma.news.create({
			data: {
				title,
				excerpt,
				date,
				location,
				tag,
				media: {
					create: mediaData,
				},
			},
			include: { media: true },
		});

		res.status(201).json({ success: true, error: false, data: newsEntry });
	} catch (error) {
		console.error("Gazette Creation Error:", error);
		res
			.status(500)
			.json({ success: false, error: true, message: "Failed to publish news" });
	}
});

export const updateNews = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { title, excerpt, date, location, tag, videoLinks, deleteMediaIds } =
		req.body;

	try {
		const newMediaToCreate: any[] = [];

		if (deleteMediaIds) {
			const idsToDelete = JSON.parse(deleteMediaIds).map(Number);

			const mediaItems = await prisma.media.findMany({
				where: { id: { in: idsToDelete } },
			});

			for (const item of mediaItems) {
				if (item.type === "image") {
					const publicId = item.url
						.split("/")
						.slice(-3)
						.join("/")
						.split(".")[0];
					await deleteFromCloudinary(publicId);
				}
			}

			await prisma.media.deleteMany({
				where: { id: { in: idsToDelete } },
			});
		}

		if (videoLinks) {
			const parsedVideos = JSON.parse(videoLinks);
			for (const video of parsedVideos) {
				await prisma.media.upsert({
					where: { id: video.id || 0 },
					update: { type: video.type, url: video.url },
					create: { newsId: Number(id), type: video.type, url: video.url },
				});
			}
		}

		if (req.files && Array.isArray(req.files)) {
			for (const file of req.files as Express.Multer.File[]) {
				const result = await uploadMediaPressFileToCloudinary(file.path);
				newMediaToCreate.push({
					type: "image",
					url: result.secure_url,
				});
			}
		}

		const updatedEntry = await prisma.news.update({
			where: { id: Number(id) },
			data: {
				title,
				excerpt,
				date,
				location,
				tag,
				media: {
					create: newMediaToCreate,
				},
			},
			include: { media: true },
		});

		res.status(200).json({ success: true, error: false, data: updatedEntry });
		return;
	} catch (error: any) {
		console.error("Update Error:", error);
		res
			.status(500)
			.json({ success: false, error: true, message: error.message });
		return;
	}
});

export const deleteNews = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const newsItem = await prisma.news.findUnique({
			where: { id: Number(id) },
			include: { media: true },
		});

		if (!newsItem) {
			res
				.status(404)
				.json({ success: false, error: true, message: "News not found" });

			return;
		}
		for (const media of newsItem.media) {
			if (media.type === "image") {
				const publicId = media.url.split("/").slice(-3).join("/").split(".")[0];
				await deleteFromCloudinary(publicId);
			}
		}

		await prisma.news.delete({ where: { id: Number(id) } });

		res.status(200).json({
			success: true,
			error: false,
			message: "News deleted successfully",
		});
	} catch (error: any) {
		res
			.status(500)
			.json({ success: false, error: true, message: error.message });
	}
});

export const getNews = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { search } = req.query;
		const where: any = {};

		if (search && typeof search === "string" && search.trim().length > 0) {
			const s = search.trim();
			where.OR = [
				{ title: { contains: s } },
				{ tag: { contains: s } },
				{ excerpt: { contains: s } },
			];
		}

		const news = await prisma.news.findMany({
			where,
			include: { media: true },
			orderBy: { createdAt: "desc" },
		});
		res.status(200).json({ success: true, error: false, data: news });
	} catch (error: any) {
		console.error("Error fetching news:", error);
		res
			.status(500)
			.json({ success: false, error: true, message: error.message });
	}
});
