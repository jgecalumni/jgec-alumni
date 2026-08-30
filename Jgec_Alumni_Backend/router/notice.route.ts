

import express from "express";
import { createNewNotice, deleteNotice, getAllNotices, noticeDetails, updateNoticeDetails } from "../controller/notice.controller";
import authentication from "../middleware/authentication";
import { upload } from "../middleware/photo-upload";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notice
 *   description: API for managing Notice
 */



/**
 * @swagger
 * /v1/api/notice:
 *   get:
 *     summary: GET /
 *     tags: [Notice]
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
router.route('/').get(getAllNotices);
/**
 * @swagger
 * /v1/api/notice/{id}:
 *   get:
 *     summary: GET /:id
 *     tags: [Notice]
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
router.route('/:id').get(noticeDetails);
/**
 * @swagger
 * /v1/api/notice/add:
 *   post:
 *     summary: POST /add
 *     tags: [Notice]
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
router.route('/add').post(authentication, upload.single('file'), createNewNotice);
/**
 * @swagger
 * /v1/api/notice/update/{id}:
 *   patch:
 *     summary: PATCH /update/:id
 *     tags: [Notice]
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
router.route('/update/:id').patch(authentication, upload.single('file'), updateNoticeDetails);
/**
 * @swagger
 * /v1/api/notice/delete/{id}:
 *   delete:
 *     summary: DELETE /delete/:id
 *     tags: [Notice]
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
router.route('/delete/:id').delete(authentication, deleteNotice);


export default router;