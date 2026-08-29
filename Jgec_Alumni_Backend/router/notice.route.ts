

import express from "express";
import { createNewNotice, deleteNotice, getAllNotices, noticeDetails, updateNoticeDetails } from "../controller/notice.controller";
import authentication from "../middleware/authentication";
import { upload } from "../middleware/photo-upload";

const router = express.Router();

router.route('/').get(getAllNotices);
router.route('/:id').get(noticeDetails);
router.route('/add').post(authentication, upload.single('file'), createNewNotice);
router.route('/update/:id').patch(authentication, upload.single('file'), updateNoticeDetails);
router.route('/delete/:id').delete(authentication, deleteNotice);


export default router;