import express from "express";
import {
	approveReceipt,
	deleteReceipt,
	denyReceipt,
	getAllReceiptRequest,
	receiptRequest,
} from "../controller/receipt.controller";
import authentication from "../middleware/authentication";
import { upload } from "../middleware/photo-upload";

const router = express.Router();

// Routes for receipt
router.route("/request").post(receiptRequest);
router.route("/").get(authentication, getAllReceiptRequest);
router.route("/delete/:id").delete(authentication, deleteReceipt);
router.route("/approve/:id").patch(authentication, approveReceipt);
router.route("/deny/:id").patch(authentication, denyReceipt);

export default router;
