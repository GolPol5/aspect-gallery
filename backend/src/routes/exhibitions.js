import { Router } from 'express';
import { exhibitionUpload } from '../middleware/upload.js';
import {
  listExhibitions,
  getExhibition,
  createExhibition,
  updateExhibition,
  deleteExhibition,
} from '../controllers/exhibitions.js';

const router = Router();

router.get('/', listExhibitions);
router.get('/:idOrSlug', getExhibition);
router.post('/', exhibitionUpload.single('coverImage'), createExhibition);
router.put('/:id', exhibitionUpload.single('coverImage'), updateExhibition);
router.delete('/:id', deleteExhibition);

export default router;
