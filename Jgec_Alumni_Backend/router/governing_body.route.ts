import express from "express";
import {
	getGoverningBody,
	getPosts,
	createPost,
	updatePost,
	deletePost,
	createMember,
	updateMember,
	deleteMember,
} from "../controller/governing_body.controller";
import authentication from "../middleware/authentication";
import { upload } from "../middleware/photo-upload";

const router = express.Router();

// Public routes for website & admin view
router.get("/", getGoverningBody);
router.get("/posts", getPosts);

// Admin-managed routes (requires auth)
router.post("/posts", authentication, createPost);
router.put("/posts/:id", authentication, updatePost);
router.delete("/posts/:id", authentication, deletePost);

router.post("/members", authentication, upload.single("image"), createMember);
router.put("/members/:id", authentication, upload.single("image"), updateMember);
router.delete("/members/:id", authentication, deleteMember);

export default router;
