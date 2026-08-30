import express from "express";
import {
	adminLogin,
	adminlogout,
	allMembers,
	loginMember,
	logout,
	memberDetails,
	registerMember,
	updateMemeber,
} from "../controller/auth.controller";
import { upload } from "../middleware/photo-upload";
import authentication from "../middleware/authentication";

const router = express.Router();

/**
 * @swagger
 * /v1/api/auth/member/register:
 *   post:
 *     summary: Register a new member
 *     tags: [Auth]
 *     description: Register a new member with photo and receipt
 *     responses:
 *       201:
 *         description: Member registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Member registered successfully
 *                 data:
 *                   type: object
 *                 accessToken:
 *                   type: string
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/register").post(
	upload.fields([
		{ name: "photo", maxCount: 1 },
		{ name: "receipt", maxCount: 1 },
	]),
	registerMember
);
router.route("/admin/login").post(adminLogin);
/**
 * @swagger
 * /v1/api/auth/member/login:
 *   post:
 *     summary: Login a member
 *     tags: [Auth]
 *     description: Authenticate a member
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                 accessToken:
 *                   type: string
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/login").post(loginMember);

/**
 * @swagger
 * /v1/api/auth/member/logout:
 *   get:
 *     summary: Logout a member
 *     tags: [Auth]
 *     description: Clear member authentication cookie
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/logout").get(logout);
router.route("/admin/logout").get(adminlogout);
router.route("/").get(authentication, allMembers);
router.route("/profile/:id").get(authentication, memberDetails);
router.route("/update/:id").patch(
	authentication,
	upload.single("photo"),
	updateMemeber
);

export default router;
