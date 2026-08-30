import express from "express";
import {
	addNewScholarship,
	applicantDetails,
	applyForScholarship,
	deleteApplication,
	deleteScholarship,
	getAllScholarshipApplications,
	getAllScholarships,
	getAllScholarshipsAdmin,
	getScholarshipById,
	updateScholarship,
} from "../controller/scholarships.controller";
import authentication from "../middleware/authentication";
import { upload } from "../middleware/photo-upload";
import { documentUpload } from "../middleware/document-upload";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Scholarship
 *   description: API for managing Scholarship
 */



// Routes for scholarships
/**
 * @swagger
 * /v1/api/scholarships/admin:
 *   get:
 *     summary: GET /admin
 *     tags: [Scholarship]
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
router.route("/admin").get(getAllScholarshipsAdmin);
/**
 * @swagger
 * /v1/api/scholarships:
 *   get:
 *     summary: GET /
 *     tags: [Scholarship]
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
router.route("/").get(getAllScholarships);
/**
 * @swagger
 * /v1/api/scholarships/add:
 *   post:
 *     summary: POST /add
 *     tags: [Scholarship]
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
router
	.route("/add")
	.post(authentication, upload.single("providerImage"), addNewScholarship);
/**
 * @swagger
 * /v1/api/scholarships/update/{id}:
 *   patch:
 *     summary: PATCH /update/:id
 *     tags: [Scholarship]
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
router
	.route("/update/:id")
	.patch(authentication, upload.single("providerImage"), updateScholarship);
/**
 * @swagger
 * /v1/api/scholarships/delete/{id}:
 *   delete:
 *     summary: DELETE /delete/:id
 *     tags: [Scholarship]
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
router.route("/delete/:id").delete(authentication, deleteScholarship);

// Routes for scholarship applications
/**
 * @swagger
 * /v1/api/scholarships/applications:
 *   get:
 *     summary: GET /applications
 *     tags: [Scholarship]
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
router.route("/applications").get(getAllScholarshipApplications);
/**
 * @swagger
 * /v1/api/scholarships/applicant/{id}:
 *   get:
 *     summary: GET /applicant/:id
 *     tags: [Scholarship]
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
router.route("/applicant/:id").get(applicantDetails);
/**
 * @swagger
 * /v1/api/scholarships/apply:
 *   post:
 *     summary: POST /apply
 *     tags: [Scholarship]
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
router.route("/apply").post(documentUpload.single("document"), applyForScholarship);
/**
 * @swagger
 * /v1/api/scholarships/applicants/delete/{id}:
 *   delete:
 *     summary: DELETE /applicants/delete/:id
 *     tags: [Scholarship]
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
router.route("/applicants/delete/:id").delete(deleteApplication);

// Dynamic route should be at the end to avoid intercepting other routes
/**
 * @swagger
 * /v1/api/scholarships/{id}:
 *   get:
 *     summary: GET /:id
 *     tags: [Scholarship]
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
router.route("/:id").get(getScholarshipById);

export default router;
