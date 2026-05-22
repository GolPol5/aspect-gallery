import { Router } from 'express';
import { createMessage, listMessages, markRead } from '../controllers/contact.js';

const router = Router();

router.post('/', createMessage);
router.get('/', listMessages);
router.patch('/:id/read', markRead);

export default router;
