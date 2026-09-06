import { Request, Response } from "express";
import prisma from "../prisma";
import { asyncHandler } from "../utils/asyncHandler";


export const allCounts = asyncHandler(async (req: Request, res: Response) => {
    const members = await prisma.members.count();
    const scholarships = await prisma.scholarships.count();
    const notices = await prisma.notice.count(); 
    const gallery = 0;
    const events = await prisma.event.count();
    const scholarshipApplications = await prisma.scholarshipApplication.count();
    res.status(200).json({
        message: "Counts fetched successfully",
        data: { members, scholarships, notices, gallery, events, scholarshipApplications },
        success: true,
        error: false,
    });
});