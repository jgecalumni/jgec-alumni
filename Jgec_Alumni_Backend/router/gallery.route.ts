import express from "express";

import { upload } from "../middleware/photo-upload";
import {
	createCategory,
	createGalleryImage,
	deleteCategory,
	deleteGalleryImage,
	getAllCategory,
	getAllGalleryImage,
	getCategoryById,
	getImagesById,
	upadateCategory,
	upadateGalleryImage,
} from "../controller/gallery.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Gallery
 *   description: API for managing Gallery
 */



//category route
/**
 * @swagger
 * /v1/api/gallery/add-category:
 *   post:
 *     summary: POST /add-category
 *     tags: [Gallery]
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
router.route("/add-category").post(createCategory);
/**
 * @swagger
 * /v1/api/gallery/all-category:
 *   get:
 *     summary: GET /all-category
 *     tags: [Gallery]
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
router.route("/all-category").get(getAllCategory);
/**
 * @swagger
 * /v1/api/gallery/delete-category/{id}:
 *   delete:
 *     summary: DELETE /delete-category/:id
 *     tags: [Gallery]
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
router.route("/delete-category/:id").delete(deleteCategory);
/**
 * @swagger
 * /v1/api/gallery/update-category/{id}:
 *   patch:
 *     summary: PATCH /update-category/:id
 *     tags: [Gallery]
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
router.route("/update-category/:id").patch(upadateCategory);
/**
 * @swagger
 * /v1/api/gallery/get-category/{id}:
 *   get:
 *     summary: GET /get-category/:id
 *     tags: [Gallery]
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
router.route("/get-category/:id").get(getCategoryById);

//gallery image route
/**
 * @swagger
 * /v1/api/gallery/add-images/{id}:
 *   post:
 *     summary: POST /add-images/:id
 *     tags: [Gallery]
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
	.route("/add-images/:id")
	.post(upload.array("images", 20), createGalleryImage);
/**
 * @swagger
 * /v1/api/gallery/delete-image/{id}:
 *   delete:
 *     summary: DELETE /delete-image/:id
 *     tags: [Gallery]
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
router.route("/delete-image/:id").delete(deleteGalleryImage);
/**
 * @swagger
 * /v1/api/gallery/get-all-images:
 *   get:
 *     summary: GET /get-all-images
 *     tags: [Gallery]
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
router.route("/get-all-images").get(getAllGalleryImage);
/**
 * @swagger
 * /v1/api/gallery/update-image/{id}:
 *   patch:
 *     summary: PATCH /update-image/:id
 *     tags: [Gallery]
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
	.route("/update-image/:id")
	.patch(upload.single("image"), upadateGalleryImage);
/**
 * @swagger
 * /v1/api/gallery/get-image/{id}:
 *   get:
 *     summary: GET /get-image/:id
 *     tags: [Gallery]
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
router.route("/get-image/:id").get(getImagesById);

export default router;
