import { Router } from 'express';
import {
  createInquiry,
  listInquiries,
  replyInquiry,
  patchInquiryStatus,
} from '../controllers/inquiries.js';

const router = Router();

router.post('/', createInquiry);
router.get('/', listInquiries);
router.put('/:id/reply', replyInquiry);
router.patch('/:id/status', patchInquiryStatus);

export default router;
