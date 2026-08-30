import express from "express";
import authentication from "../middleware/authentication";
import {
	addNewEvent,
	deleteEvent,
	getAllEvents,
	getEventByID,
	updateEvent,
} from "../controller/event.Controller";
import { upload } from "../middleware/photo-upload";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API for managing events
 */

/**
 * @swagger
 * /v1/api/events/add:
 *   post:
 *     summary: Add a new event
 *     tags: [Events]
 *     responses:
 *       201:
 *         description: Event added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event added
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/add").post(upload.single('event_thumbnail'),addNewEvent);

/**
 * @swagger
 * /v1/api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: List of events
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/").get(getAllEvents);

/**
 * @swagger
 * /v1/api/events/update/{id}:
 *   patch:
 *     summary: Update an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event updated
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/update/:id").patch(upload.single('event_thumbnail'),updateEvent);

/**
 * @swagger
 * /v1/api/events/delete/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event deleted
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/delete/:id").delete(authentication,deleteEvent);

/**
 * @swagger
 * /v1/api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event details
 *                 data:
 *                   type: object
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.route("/:id").get(getEventByID);

export default router;
