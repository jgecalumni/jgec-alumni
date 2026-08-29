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

router.route("/register").post(
	upload.fields([
		{ name: "photo", maxCount: 1 },
		{ name: "receipt", maxCount: 1 },
	]),
	registerMember
);
router.route("/admin/login").post(adminLogin);
router.route("/login").post(loginMember);
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
