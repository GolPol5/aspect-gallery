import { Router } from 'express';
import { generalUpload } from '../middleware/upload.js';
import { uploadImage } from '../controllers/upload.js';

const router = Router();

router.post('/image', generalUpload.single('image'), uploadImage);

export default router;
