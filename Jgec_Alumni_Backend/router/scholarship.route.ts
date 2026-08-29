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

// Routes for scholarships
router.route("/admin").get(getAllScholarshipsAdmin);
router.route("/").get(getAllScholarships);
router
	.route("/add")
	.post(authentication, upload.single("providerImage"), addNewScholarship);
router
	.route("/update/:id")
	.patch(authentication, upload.single("providerImage"), updateScholarship);
router.route("/delete/:id").delete(authentication, deleteScholarship);

// Routes for scholarship applications
router.route("/applications").get(getAllScholarshipApplications);
router.route("/applicant/:id").get(applicantDetails);
router.route("/apply").post(documentUpload.single("document"), applyForScholarship);
router.route("/applicants/delete/:id").delete(deleteApplication);

// Dynamic route should be at the end to avoid intercepting other routes
router.route("/:id").get(getScholarshipById);

export default router;
