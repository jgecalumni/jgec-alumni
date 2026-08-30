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

/**
 * @swagger
 * tags:
 *   name: Receipt
 *   description: API for managing Receipt
 */



// Routes for receipt
/**
 * @swagger
 * /v1/api/receipt/request:
 *   post:
 *     summary: POST /request
 *     tags: [Receipt]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successful operation
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/request").post(receiptRequest);
/**
 * @swagger
 * /v1/api/receipt:
 *   get:
 *     summary: GET /
 *     tags: [Receipt]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successful operation
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/").get(authentication, getAllReceiptRequest);
/**
 * @swagger
 * /v1/api/receipt/delete/{id}:
 *   delete:
 *     summary: DELETE /delete/:id
 *     tags: [Receipt]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successful operation
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/delete/:id").delete(authentication, deleteReceipt);
/**
 * @swagger
 * /v1/api/receipt/approve/{id}:
 *   patch:
 *     summary: PATCH /approve/:id
 *     tags: [Receipt]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successful operation
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/approve/:id").patch(authentication, approveReceipt);
/**
 * @swagger
 * /v1/api/receipt/deny/{id}:
 *   patch:
 *     summary: PATCH /deny/:id
 *     tags: [Receipt]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successful operation
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/deny/:id").patch(authentication, denyReceipt);

export default router;
