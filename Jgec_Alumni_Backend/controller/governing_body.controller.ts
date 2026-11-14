import { Request, Response } from "express";
import prisma from "../prisma";
import { asyncHandler } from "../utils/asyncHandler";
import {
	uploadGoverningBodyImageToCloudinary,
	deleteFromCloudinary,
} from "../utils/cloudinary";

// GET /v1/api/governing-body - Public listing for frontend & admin
export const getGoverningBody = asyncHandler(
	async (req: Request, res: Response) => {
		const posts = await prisma.governingBodyPost.findMany({
			orderBy: [{ order: "asc" }, { id: "asc" }],
			include: {
				members: {
					orderBy: [{ order: "asc" }, { id: "asc" }],
				},
			},
		});

		// Provide both structured format and backward-compatible aliases
		const formatted = posts.map((p) => ({
			id: p.id,
			title: p.title,
			post: p.title, // alias for frontend compatibility
			order: p.order,
			members: p.members,
			member: p.members, // alias for frontend compatibility
			createdAt: p.createdAt,
			updatedAt: p.updatedAt,
		}));

		return res.status(200).json({
			success: true,
			data: formatted,
		});
	}
);

// GET /v1/api/governing-body/posts - List posts
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
	const posts = await prisma.governingBodyPost.findMany({
		orderBy: [{ order: "asc" }, { id: "asc" }],
		include: {
			_count: {
				select: { members: true },
			},
		},
	});

	return res.status(200).json({
		success: true,
		data: posts,
	});
});

// POST /v1/api/governing-body/posts - Create new designation/post
export const createPost = asyncHandler(async (req: Request, res: Response) => {
	const { title, order } = req.body;

	if (!title || !title.trim()) {
		return res.status(400).json({
			success: false,
			message: "Post designation title is required",
		});
	}

	let postOrder = Number(order);
	if (isNaN(postOrder)) {
		const maxOrder = await prisma.governingBodyPost.aggregate({
			_max: { order: true },
		});
		postOrder = (maxOrder._max.order ?? 0) + 1;
	}

	const newPost = await prisma.governingBodyPost.create({
		data: {
			title: title.trim(),
			order: postOrder,
		},
	});

	return res.status(201).json({
		success: true,
		message: "Post created successfully",
		data: newPost,
	});
});

// PUT /v1/api/governing-body/posts/:id - Update post
export const updatePost = asyncHandler(async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const { title, order } = req.body;

	if (isNaN(id)) {
		return res.status(400).json({ success: false, message: "Invalid post ID" });
	}

	const existing = await prisma.governingBodyPost.findUnique({
		where: { id },
	});

	if (!existing) {
		return res.status(404).json({ success: false, message: "Post not found" });
	}

	const updated = await prisma.governingBodyPost.update({
		where: { id },
		data: {
			...(title ? { title: title.trim() } : {}),
			...(order !== undefined && !isNaN(Number(order))
				? { order: Number(order) }
				: {}),
		},
	});

	return res.status(200).json({
		success: true,
		message: "Post updated successfully",
		data: updated,
	});
});

// DELETE /v1/api/governing-body/posts/:id - Delete post & its members
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
	const id = Number(req.params.id);

	if (isNaN(id)) {
		return res.status(400).json({ success: false, message: "Invalid post ID" });
	}

	const existing = await prisma.governingBodyPost.findUnique({
		where: { id },
		include: { members: true },
	});

	if (!existing) {
		return res.status(404).json({ success: false, message: "Post not found" });
	}

	// Clean up Cloudinary images for all members under this post
	for (const m of existing.members) {
		if (m.image_public_id) {
			try {
				await deleteFromCloudinary(m.image_public_id);
			} catch (err) {
				console.error(`Failed to delete Cloudinary image: ${m.image_public_id}`, err);
			}
		}
	}

	await prisma.governingBodyPost.delete({
		where: { id },
	});

	return res.status(200).json({
		success: true,
		message: "Post and associated members deleted successfully",
	});
});

// POST /v1/api/governing-body/members - Add member under a post
export const createMember = asyncHandler(
	async (req: Request, res: Response) => {
		const { postId, name, timeline, order } = req.body;

		if (!postId || !name) {
			return res.status(400).json({
				success: false,
				message: "Post ID and member name are required",
			});
		}

		const postExists = await prisma.governingBodyPost.findUnique({
			where: { id: Number(postId) },
		});

		if (!postExists) {
			return res.status(404).json({
				success: false,
				message: "Specified post does not exist",
			});
		}

		let imageUrl = "/assets/Members/person-icon-8.png";
		let imagePublicId: string | null = null;

		if (req.file) {
			const uploadRes = await uploadGoverningBodyImageToCloudinary(req.file.path);
			imageUrl = uploadRes.secure_url;
			imagePublicId = uploadRes.public_id;
		} else if (req.body.image) {
			imageUrl = req.body.image;
		}

		let memberOrder = Number(order);
		if (isNaN(memberOrder)) {
			const maxOrder = await prisma.governingBodyMember.aggregate({
				where: { postId: Number(postId) },
				_max: { order: true },
			});
			memberOrder = (maxOrder._max.order ?? 0) + 1;
		}

		const newMember = await prisma.governingBodyMember.create({
			data: {
				postId: Number(postId),
				name: name.trim(),
				timeline: timeline ? timeline.trim() : "",
				image: imageUrl,
				image_public_id: imagePublicId,
				order: memberOrder,
			},
		});

		return res.status(201).json({
			success: true,
			message: "Governing body member added successfully",
			data: newMember,
		});
	}
);

// PUT /v1/api/governing-body/members/:id - Update member
export const updateMember = asyncHandler(
	async (req: Request, res: Response) => {
		const id = Number(req.params.id);
		const { postId, name, timeline, order } = req.body;

		if (isNaN(id)) {
			return res.status(400).json({ success: false, message: "Invalid member ID" });
		}

		const existing = await prisma.governingBodyMember.findUnique({
			where: { id },
		});

		if (!existing) {
			return res.status(404).json({ success: false, message: "Member not found" });
		}

		let imageUrl = existing.image;
		let imagePublicId = existing.image_public_id;

		if (req.file) {
			// Delete old image from Cloudinary if existed
			if (existing.image_public_id) {
				try {
					await deleteFromCloudinary(existing.image_public_id);
				} catch (err) {
					console.error("Failed to delete previous image from Cloudinary", err);
				}
			}

			const uploadRes = await uploadGoverningBodyImageToCloudinary(req.file.path);
			imageUrl = uploadRes.secure_url;
			imagePublicId = uploadRes.public_id;
		} else if (req.body.image && req.body.image !== existing.image) {
			imageUrl = req.body.image;
		}

		const updated = await prisma.governingBodyMember.update({
			where: { id },
			data: {
				...(postId && !isNaN(Number(postId)) ? { postId: Number(postId) } : {}),
				...(name ? { name: name.trim() } : {}),
				...(timeline !== undefined ? { timeline: timeline.trim() } : {}),
				...(order !== undefined && !isNaN(Number(order))
					? { order: Number(order) }
					: {}),
				image: imageUrl,
				image_public_id: imagePublicId,
			},
		});

		return res.status(200).json({
			success: true,
			message: "Member updated successfully",
			data: updated,
		});
	}
);

// DELETE /v1/api/governing-body/members/:id - Delete member
export const deleteMember = asyncHandler(
	async (req: Request, res: Response) => {
		const id = Number(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json({ success: false, message: "Invalid member ID" });
		}

		const existing = await prisma.governingBodyMember.findUnique({
			where: { id },
		});

		if (!existing) {
			return res.status(404).json({ success: false, message: "Member not found" });
		}

		if (existing.image_public_id) {
			try {
				await deleteFromCloudinary(existing.image_public_id);
			} catch (err) {
				console.error("Failed to delete Cloudinary image", err);
			}
		}

		await prisma.governingBodyMember.delete({
			where: { id },
		});

		return res.status(200).json({
			success: true,
			message: "Member removed successfully",
		});
	}
);
