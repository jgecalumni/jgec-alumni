import express from 'express';
import { upload } from '../middleware/photo-upload';
import { createNews, deleteNews, getNews, updateNews } from '../controller/media_press.controller';
import authentication from '../middleware/authentication';

const router = express.Router();


// Allows up to 10 images per news post
router.post('/', upload.array('images', 10), createNews);
router.get('/', getNews)
router.patch('/:id', upload.array('images', 10), updateNews);
router.delete('/:id', deleteNews)

export default router;