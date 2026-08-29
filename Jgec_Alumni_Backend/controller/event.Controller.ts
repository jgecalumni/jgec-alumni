import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../prisma";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";

export const addNewEvent = asyncHandler(async (req: Request, res: Response) => {
	const {
		name,
		shortDescription,
		details,
		date,
		time,
		location,
		hostName,
		hostDetails,
		schedule,
	} = req.body;

	const event_thumbnail = (req as any).file;
	const schedules = JSON.parse(schedule || "[]");
	if (
		!(
			name &&
			shortDescription &&
			details &&
			date &&
			time &&
			location &&
			hostName &&
			hostDetails
		)
	) {
		res.status(400).json({
			success: false,
			message: "Please provide all required fields",
			error: true,
		});
		return;
	}

	if (event_thumbnail && event_thumbnail.size > 10 * 1024 * 1024) {
		res.status(400).json({
			success: false,
			message: "File size must be less than 10MB",
			error: true,
		});
		return;
	}

	let fileLink = null;
	if (event_thumbnail) {
		fileLink = await uploadOnCloudinary(event_thumbnail.path);
	}

	//Create new event
	const newEvent = await prisma.event.create({
		data: {
			name,
			shortDescription,
			details,
			event_thumbnail: fileLink?.url || "",
			event_thumbnail_id: fileLink?.public_id || "",
			date,
			time,
			location,
			hostName,
			hostDetails,
		},
	});
	for (const scheduleItem of schedules) {
		const newSchedule = await prisma.eventSchedule.create({
			data: {
				eventId: newEvent.id,
				startTime: scheduleItem.startTime,
				endTime: scheduleItem.endTime,
				activity: scheduleItem.activity,
			},
			select: {
				id: true,
				startTime: true,
				endTime: true,
				activity: true,
				eventId: true,
				Event: {
					select: {
						id: true,
						name: true,
						shortDescription: true,
						details: true,
						event_thumbnail: true,
						date: true,
						time: true,
						location: true,
						hostName: true,
						hostDetails: true,
					},
				},
			},
		});
	}
	res.status(201).json({
		message: "Event added successfully",
		data: newEvent,
		error: false,
		success: true,
	});
});

export const getAllEvents = asyncHandler(
	async (req: Request, res: Response) => {
		const { limit, page, search } = req.query;

		const count = await prisma.event.count();
		const events = await prisma.event.findMany({
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
				shortDescription: true,
				details: true,
				event_thumbnail: true,
				date: true,
				time: true,
				location: true,
				hostName: true,
				hostDetails: true,
				schedule: {
					select: {
						id: true,
						startTime: true,
						endTime: true,
						activity: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		res.status(200).json({
			message: "Events fetched successfully",
			events,
			error: false,
			success: true,
			docCount: count,
			totalPages: Math.ceil(count / (Number(limit) || 10)),
			page: Number(page) || 1,
			limit: Number(limit) || 10,
		});
	},
);

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
	const {
		name,
		shortDescription,
		details,
		date,
		time,
		location,
		hostName,
		hostDetails,
		schedule,
	} = req.body;

	const schedules = JSON.parse(schedule || "[]");

	const event_thumbnail = (req as any).file;

	const { id } = req.params;

	if (
		!(
			name &&
			shortDescription &&
			details &&
			date &&
			time &&
			location &&
			hostName &&
			hostDetails
		)
	) {
		res.status(400).json({
			success: false,
			message: "Please provide all required fields",
			error: true,
		});
		return;
	}

	const isExist = await prisma.event.findFirst({ where: { id: parseInt(id as string) } });
	if (!isExist) {
		res
			.status(404)
			.json({ success: false, message: "Event not found", error: true });
		return;
	}

	if (event_thumbnail && event_thumbnail.size > 10 * 1024 * 1024) {
		res.status(400).json({
			success: false,
			message: "File size must be less than 10MB",
			error: true,
		});
		return;
	}
	let fileLinkExist = "",
		fileLinkExistId = null;
	if (!event_thumbnail) {
		fileLinkExist = isExist.event_thumbnail;
		fileLinkExistId = isExist.event_thumbnail_id;
	}

	let fileLink = null;
	if (event_thumbnail) {
		if (isExist.event_thumbnail_id) {
			await deleteFromCloudinary(isExist.event_thumbnail_id);
		}
		fileLink = await uploadOnCloudinary(event_thumbnail.path);
	}

	const updateEvent = await prisma.event.update({
		where: { id: parseInt(id as string) },
		data: {
			name,
			shortDescription,
			details,
			event_thumbnail: fileLink?.url || fileLinkExist,
			event_thumbnail_id: fileLink?.public_id || fileLinkExistId,
			date,
			time,
			location,
			hostName,
			hostDetails,
		},
	});

	for (const scheduleItem of schedules) {
		await prisma.eventSchedule.upsert({
			where: {
				id: parseInt(scheduleItem.id) || 0,
			},
			update: {
				startTime: scheduleItem.startTime,
				endTime: scheduleItem.endTime,
				activity: scheduleItem.activity,
			},
			create: {
				eventId: parseInt(id as string),
				startTime: scheduleItem.startTime,
				endTime: scheduleItem.endTime,
				activity: scheduleItem.activity,
			},
		});
	}
	const eventWithSchedule = await prisma.event.findUnique({
		where: { id: parseInt(id as string) },
		select: {
			id: true,
			name: true,
			shortDescription: true,
			details: true,
			event_thumbnail: true,
			date: true,
			time: true,
			location: true,
			hostName: true,
			hostDetails: true,
			schedule: {
				select: {
					id: true,
					startTime: true,
					endTime: true,
					activity: true,
				},
			},
		},
	});
	res.status(201).json({
		message: "Event updated successfully",
		data: eventWithSchedule,
		error: false,
		success: true,
	});
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const event = await prisma.event.findUnique({ where: { id: parseInt(id as string) } });
	if (!event) {
		res.status(404).json({
			message: "Event not found",
			data: [],
			error: true,
			success: false,
		});
		return;
	}
	const deletedEvent = await prisma.event.delete({
		where: { id: parseInt(id as string) },
	});
	const deleteThumbnail = await deleteFromCloudinary(
		event.event_thumbnail_id || "",
	);
	res.status(200).json({
		message: "Event deleted successfully",
		error: false,
		success: true,
	});
});

export const getEventByID = asyncHandler(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const event = await prisma.event.findUnique({
			where: { id: parseInt(id as string) },
			select: {
				id: true,
				name: true,
				shortDescription: true,
				details: true,
				event_thumbnail: true,
				date: true,
				time: true,
				location: true,
				hostName: true,
				hostDetails: true,
				schedule: {
					select: {
						id: true,
						startTime: true,
						endTime: true,
						activity: true,
					},
				},
			},
		});
		if (!event) {
			res.status(404).json({
				message: "Event not found",
				data: [],
				error: true,
				success: false,
			});
			return;
		}
		res.status(200).json({
			message: "Event found",
			data: event,
			error: false,
			success: true,
		});
	},
);
