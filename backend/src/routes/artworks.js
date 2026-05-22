import { Router } from 'express';
import { artworkUpload } from '../middleware/upload.js';
import {
  listArtworks,
  getArtwork,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  addImages,
  deleteImage,
} from '../controllers/artworks.js';

const router = Router();

router.get('/', listArtworks);
router.get('/:id', getArtwork);
router.post('/', artworkUpload.array('images', 20), createArtwork);
router.put('/:id', updateArtwork);
router.delete('/:id', deleteArtwork);
router.post('/:id/images', artworkUpload.array('images', 20), addImages);
router.delete('/:id/images/:filename', deleteImage);

export default router;
