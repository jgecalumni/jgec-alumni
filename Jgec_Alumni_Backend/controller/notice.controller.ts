import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../prisma";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";

export const getAllNotices = asyncHandler(async (req: Request, res: Response) => {
    let limit = Number(req.query.limit) || 10;
    let page = Number(req.query.page) || 0;
    const notices = await prisma.notice.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        skip: page * limit,
        take: limit
    })
    res.status(200).json({
        success: true,
        notices,
        message: "All notices fetched successfully",
        error: false,
        limit,
        page,
        totalPages: Math.ceil((await prisma.notice.count()) / limit),
        totalCount: await prisma.notice.count()
    })
})

export const noticeDetails = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            success: false,
            message: "Notice id is required",
            error: true
        })
        return;
    }

    const notice = await prisma.notice.findUnique({
        where: {
            id: parseInt(id as string)
        }
    })

    if (!notice) {
        res.status(404).json({
            success: false,
            message: "Notice not found",
            error: true
        })
        return;
    }

    res.status(200).json({
        success: true,
        data: notice,
        message: "Notice fetched successfully",
        error: false
    })
})

export const createNewNotice = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, date } = req.body;
    const file = (req as any).file;   
    

    if (!(title && description && date)) {
        res.status(400).json({
            success: false,
            message: "All fields are required",
            error: true
        })
        return;
    }

    // check file size less than 2MB or not
    if (file && file.size > 2 * 1024 * 1024) {
        res.status(400).json({
            success: false,
            message: "File size must be less than 2MB",
            error: true
        })
        return;
    }

    const isExists = await prisma.notice.findFirst({ where: { title } });
    if (isExists) {
        res.status(400).json({
            success: false,
            message: "Notice with this title already exists",
            error: true
        })
        return;
    }

    // upload file to cloudinary and get link, delete previous link if exists
    let fileLink = null;
    if (file) {
        fileLink = await uploadOnCloudinary(file.path);
    }

    const notice = await prisma.notice.create({
        data: {
            title,
            description,
            date,
            link: fileLink?.url || "",
            link_public_id: fileLink?.public_id || ""
        }
    })

    res.status(201).json({
        success: true,
        data: notice,
        message: "Notice created successfully",
        error: false
    })
})

export const updateNoticeDetails = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, date } = req.body; 
    const file = (req as any).file; 

    if (!id) {
        res.status(400).json({
            success: false,
            message: "Notice id is required",
            error: true
        })
        return;
    }

    if (!(title && description && date)) {
        res.status(400).json({
            success: false,
            message: "All fields are required",
            error: true
        })
        return;
    }

    // check file size less than 2MB or not
    if (file && file.size > 2 * 1024 * 1024) {
        res.status(400).json({
            success: false,
            message: "File size must be less than 2MB",
            error: true
        })
        return;
    }

    const notice = await prisma.notice.findUnique({
        where: {
            id: parseInt(id as string)
        }
    })

    if (!notice) {
        res.status(404).json({
            success: false,
            message: "Notice not found",
            error: true
        })
        return;
    }

    // delete previous file from cloudinary if exists and upload new file
    let fileLink = null;
    if (file) {
        if (notice.link_public_id) {
            await deleteFromCloudinary(notice.link_public_id);
        }
        fileLink = await uploadOnCloudinary(file.path);
    }

    const updatedNotice = await prisma.notice.update({
        where: {
            id: parseInt(id as string)
        },
        data: {
            title,
            description,
            date,
            link: fileLink?.url || notice.link,
            link_public_id: fileLink?.public_id || notice.link_public_id
        }
    })

    res.status(200).json({
        success: true,
        data: updatedNotice,
        message: "Notice updated successfully",
        error: false
    })
})

export const deleteNotice = asyncHandler(async (req: Request, res: Response) => {
    const { id, link_id } = req.params;
    if (!id) {
        res.status(400).json({
            success: false,
            message: "Notice id is required",
            error: true
        })
        return;
    }

    // delete file from cloudinary if exists
    if (link_id) {
        await deleteFromCloudinary(link_id as string);
    }

    await prisma.notice.delete({
        where: {
            id: parseInt(id as string)
        }
    })

    res.status(200).json({
        success: true,
        message: "Notice deleted successfully",
        error: false
    })
});