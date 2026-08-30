import express from "express";

import authentication from "../middleware/authentication";
import { upload } from "../middleware/photo-upload";
import {
	addAgmMomDocs,
	addauditReportDocs,
	addGivingBackDocs,
	addKanchenjungaDocs,
	addScholarshipDocs,
	deleteAgmMomkDocs,
	deleteauditReportkDocs,
	deleteGivingBackDocs,
	deleteKanchenjungaDocs,
	deleteScholarshipDocs,
	getAllAgmMomDocs,
	getAllauditReportDocs,
	getAllGivingBackDocs,
	getAllKanchenjungaDocs,
	getAllScholarshipDocs,
	updateAgmMomDocs,
	updateauditReportDocs,
	updateGivingBackDocs,
	updateKanchenjungaDocs,
	updateScholarshipDocs,
} from "../controller/document.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Document
 *   description: API for managing Document
 */



/**
 * @swagger
 * /v1/api/documents/scholarshipDocs:
 *   get:
 *     summary: GET /scholarshipDocs
 *     tags: [Document]
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
router.route("/scholarshipDocs").get(getAllScholarshipDocs);
/**
 * @swagger
 * /v1/api/documents/add/scholarshipDocs:
 *   post:
 *     summary: POST /add/scholarshipDocs
 *     tags: [Document]
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
	.route("/add/scholarshipDocs")
	.post(authentication, upload.single("file"), addScholarshipDocs);
/**
 * @swagger
 * /v1/api/documents/update/scholarshipDocs/{id}:
 *   patch:
 *     summary: PATCH /update/scholarshipDocs/:id
 *     tags: [Document]
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
	.route("/update/scholarshipDocs/:id")
	.patch(authentication, upload.single("file"), updateScholarshipDocs);
/**
 * @swagger
 * /v1/api/documents/delete/scholarshipDocs/{id}:
 *   delete:
 *     summary: DELETE /delete/scholarshipDocs/:id
 *     tags: [Document]
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
	.route("/delete/scholarshipDocs/:id")
	.delete(authentication, deleteScholarshipDocs);

/**
 * @swagger
 * /v1/api/documents/kanchenjungaDocs:
 *   get:
 *     summary: GET /kanchenjungaDocs
 *     tags: [Document]
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
router.route("/kanchenjungaDocs").get(getAllKanchenjungaDocs);
/**
 * @swagger
 * /v1/api/documents/add/kanchenjungaDocs:
 *   post:
 *     summary: POST /add/kanchenjungaDocs
 *     tags: [Document]
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
	.route("/add/kanchenjungaDocs")
	.post(authentication, upload.single("file"), addKanchenjungaDocs);
/**
 * @swagger
 * /v1/api/documents/update/kanchenjungaDocs/{id}:
 *   patch:
 *     summary: PATCH /update/kanchenjungaDocs/:id
 *     tags: [Document]
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
	.route("/update/kanchenjungaDocs/:id")
	.patch(authentication, upload.single("file"), updateKanchenjungaDocs);
/**
 * @swagger
 * /v1/api/documents/delete/kanchenjungaDocs/{id}:
 *   delete:
 *     summary: DELETE /delete/kanchenjungaDocs/:id
 *     tags: [Document]
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
	.route("/delete/kanchenjungaDocs/:id")
	.delete(authentication, deleteKanchenjungaDocs);
/**
 * @swagger
 * /v1/api/documents/givingBackDocs:
 *   get:
 *     summary: GET /givingBackDocs
 *     tags: [Document]
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
router.route("/givingBackDocs").get(getAllGivingBackDocs);
/**
 * @swagger
 * /v1/api/documents/add/givingBackDocs:
 *   post:
 *     summary: POST /add/givingBackDocs
 *     tags: [Document]
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
	.route("/add/givingBackDocs")
	.post(authentication, upload.single("file"), addGivingBackDocs);
/**
 * @swagger
 * /v1/api/documents/update/givingBackDocs/{id}:
 *   patch:
 *     summary: PATCH /update/givingBackDocs/:id
 *     tags: [Document]
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
	.route("/update/givingBackDocs/:id")
	.patch(authentication, upload.single("file"), updateGivingBackDocs);
/**
 * @swagger
 * /v1/api/documents/delete/givingBackDocs/{id}:
 *   delete:
 *     summary: DELETE /delete/givingBackDocs/:id
 *     tags: [Document]
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
	.route("/delete/givingBackDocs/:id")
	.delete(authentication, deleteGivingBackDocs);

/**
 * @swagger
 * /v1/api/documents/auditReportDocs:
 *   get:
 *     summary: GET /auditReportDocs
 *     tags: [Document]
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
router.route("/auditReportDocs").get(getAllauditReportDocs);
/**
 * @swagger
 * /v1/api/documents/add/auditReportDocs:
 *   post:
 *     summary: POST /add/auditReportDocs
 *     tags: [Document]
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
	.route("/add/auditReportDocs")
	.post(authentication, upload.single("file"), addauditReportDocs);
/**
 * @swagger
 * /v1/api/documents/update/auditReportDocs/{id}:
 *   patch:
 *     summary: PATCH /update/auditReportDocs/:id
 *     tags: [Document]
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
	.route("/update/auditReportDocs/:id")
	.patch(authentication, upload.single("file"), updateauditReportDocs);
/**
 * @swagger
 * /v1/api/documents/delete/auditReportDocs/{id}:
 *   delete:
 *     summary: DELETE /delete/auditReportDocs/:id
 *     tags: [Document]
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
	.route("/delete/auditReportDocs/:id")
	.delete(authentication, deleteauditReportkDocs);

/**
 * @swagger
 * /v1/api/documents/AgmMomDocs:
 *   get:
 *     summary: GET /AgmMomDocs
 *     tags: [Document]
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
router.route("/AgmMomDocs").get(getAllAgmMomDocs);
/**
 * @swagger
 * /v1/api/documents/add/AgmMomDocs:
 *   post:
 *     summary: POST /add/AgmMomDocs
 *     tags: [Document]
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
	.route("/add/AgmMomDocs")
	.post(authentication, upload.single("file"), addAgmMomDocs);
/**
 * @swagger
 * /v1/api/documents/update/AgmMomDocs/{id}:
 *   patch:
 *     summary: PATCH /update/AgmMomDocs/:id
 *     tags: [Document]
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
	.route("/update/AgmMomDocs/:id")
	.patch(authentication, upload.single("file"), updateAgmMomDocs);
/**
 * @swagger
 * /v1/api/documents/delete/AgmMomDocs/{id}:
 *   delete:
 *     summary: DELETE /delete/AgmMomDocs/:id
 *     tags: [Document]
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
	.route("/delete/AgmMomDocs/:id")
	.delete(authentication, deleteAgmMomkDocs);

export default router;
