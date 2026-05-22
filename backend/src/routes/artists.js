import { Router } from 'express';
import {
  listArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
} from '../controllers/artists.js';

const router = Router();

router.get('/', listArtists);
router.get('/:id', getArtist);
router.post('/', createArtist);
router.put('/:id', updateArtist);
router.delete('/:id', deleteArtist);

export default router;
