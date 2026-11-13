import prisma from "../prisma";
import { asyncHandler } from "../utils/asyncHandler";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { AdminCreationMail, ForgotPasswordMail, PasswordResetSuccessMail } from "../utils/mail-templates";
import { sendMail } from "../utils/mailer";

export const createUser = asyncHandler(async (req: any, res: any) => {
    try {
        const { email, password, name, role, allowedPaths } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "Name, email, and password are required" });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ success: false, message: 'Email already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || "ADMIN",
                allowedPaths: allowedPaths || ["*"],
                last_login_at: new Date()
            },
            select: { id: true, email: true, name: true, role: true, allowedPaths: true, createdAt: true },
        });

        const loginUrl = `${process.env.FORNTEND_URI_PROD || "https://admin.jgecalumni.in"}/login`;
        try {
            const emailHtml = AdminCreationMail(name, email, password, loginUrl);
            await sendMail(user.email, "Admin Credentials Created", emailHtml);
        } catch (mailErr) {
            console.error("Failed to dispatch welcome email:", mailErr);
        }

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
});

export const getAllUsers = async (req: any, res: any) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                allowedPaths: true,
                last_login_at: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: "desc" }
        });
        return res.status(200).json({ success: true, data: users });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const updateUser = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { name, role, allowedPaths } = req.body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (role !== undefined) updateData.role = role;
        if (allowedPaths !== undefined) updateData.allowedPaths = allowedPaths;

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: { id: true, email: true, name: true, role: true, allowedPaths: true, updatedAt: true },
        });

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const deleteUser = async (req: any, res: any) => {
    try {
        const { id } = req.params;

        if (req.user?.userId === id) {
            return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
        }

        await prisma.user.delete({ where: { id } });
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const forgotPassword = async (req: any, res: any) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(200).json({ success: true, message: 'If the email exists, a reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token: hashedToken,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            },
        });

        const frontendUrl = process.env.FRONTEND_URL || process.env.FORNTEND_URI_PROD || "https://admin.jgecalumni.in";
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
        
        try {
            const emailHtml = ForgotPasswordMail(user.name || 'Admin', resetUrl);
            await sendMail(user.email, 'Password Reset Request | JGEC Alumni', emailHtml);
        } catch (mailErr) {
            console.error("Failed to send reset email:", mailErr);
        }

        return res.status(200).json({
            success: true,
            message: 'Password reset link sent to registered email address.',
            // Return resetToken in dev if needed for quick testing:
            ...(process.env.NODE_ENV !== "production" ? { debugToken: resetToken } : {})
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const resetPassword = async (req: any, res: any) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: 'Token and new password are required' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const savedToken = await prisma.passwordResetToken.findUnique({
            where: { token: hashedToken },
            include: { user: true },
        });

        if (!savedToken || savedToken.expiresAt < new Date()) {
            return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: savedToken.userId },
                data: { password: hashedPassword },
            }),
            prisma.passwordResetToken.delete({
                where: { id: savedToken.id },
            }),
            prisma.refreshToken.deleteMany({
                where: { userId: savedToken.userId },
            })
        ]);

        try {
            const successEmailHtml = PasswordResetSuccessMail(savedToken.user.name || 'Admin');
            await sendMail(savedToken.user.email, 'Password Updated Successfully | JGEC Alumni', successEmailHtml);
        } catch (mailErr) {
            console.error("Failed to dispatch confirmation email:", mailErr);
        }

        return res.status(200).json({ success: true, message: 'Password has been successfully reset' });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};
