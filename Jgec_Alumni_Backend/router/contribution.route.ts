import express from "express";
import {
	createContribution,
	getAllContributions,
	getContributionById,
	updateContribution,
	deleteContribution,
	bulkCreateContributions,
	sendContributionReceipt,
} from "../controller/contribution.controller";
import authentication from "../middleware/authentication";

const router = express.Router();

// Routes for contribution
router.route("/").post(authentication, createContribution);
router.route("/").get(authentication, getAllContributions);
router.route("/bulk").post(authentication, bulkCreateContributions);
router.route("/:id").get(authentication, getContributionById);
router.route("/:id").put(authentication, updateContribution);
router.route("/:id").delete(authentication, deleteContribution);
router.route("/:id/send-receipt").post(authentication, sendContributionReceipt);

export default router;