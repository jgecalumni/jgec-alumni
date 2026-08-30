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

/**
 * @swagger
 * tags:
 *   name: Contributions
 *   description: API for managing contributions
 */

/**
 * @swagger
 * /v1/api/contributions:
 *   post:
 *     summary: Create a new contribution
 *     tags: [Contributions]
 *     responses:
 *       201:
 *         description: Contribution created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contribution created successfully
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 *   get:
 *     summary: Retrieve all contributions
 *     tags: [Contributions]
 *     responses:
 *       200:
 *         description: List of contributions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: List of contributions
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/").post(authentication, createContribution);
router.route("/").get(authentication, getAllContributions);

/**
 * @swagger
 * /v1/api/contributions/bulk:
 *   post:
 *     summary: Bulk create contributions
 *     tags: [Contributions]
 *     responses:
 *       201:
 *         description: Contributions created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contributions created successfully
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/bulk").post(authentication, bulkCreateContributions);

/**
 * @swagger
 * /v1/api/contributions/{id}:
 *   get:
 *     summary: Get contribution by ID
 *     tags: [Contributions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contribution details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contribution details
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 *   put:
 *     summary: Update a contribution
 *     tags: [Contributions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contribution updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contribution updated
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 *   delete:
 *     summary: Delete a contribution
 *     tags: [Contributions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contribution deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contribution deleted
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/:id").get(authentication, getContributionById);
router.route("/:id").put(authentication, updateContribution);
router.route("/:id").delete(authentication, deleteContribution);

/**
 * @swagger
 * /v1/api/contributions/{id}/send-receipt:
 *   post:
 *     summary: Send receipt for contribution
 *     tags: [Contributions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Receipt sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Receipt sent
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/:id/send-receipt").post(authentication, sendContributionReceipt);


export default router;