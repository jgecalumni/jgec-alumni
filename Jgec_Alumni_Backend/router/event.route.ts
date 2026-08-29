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

router.route("/add").post(upload.single('event_thumbnail'),addNewEvent);
router.route("/").get(getAllEvents);
router.route("/update/:id").patch(upload.single('event_thumbnail'),updateEvent);
router.route("/delete/:id").delete(authentication,deleteEvent);
router.route("/:id").get(getEventByID);

export default router;
