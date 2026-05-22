import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/errors.js';
import { sendInquiryNotification, sendInquiryReply } from '../services/email.js';

const prisma = new PrismaClient();

const createSchema = z.object({
  artworkId: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  text: z.string().min(1),
});

const replySchema = z.object({
  reply: z.string().min(1),
});

const statusSchema = z.object({
  status: z.enum(['pending', 'answered']),
});

export async function createInquiry(req, res) {
  const data = createSchema.parse(req.body);

  const artwork = await prisma.artwork.findUnique({ where: { id: data.artworkId } });
  if (!artwork) throw new NotFoundError('Artwork');

  const inquiry = await prisma.inquiry.create({ data });

  sendInquiryNotification({ artwork, inquiry }).catch(() => null);

  res.status(201).json(inquiry);
}

export async function listInquiries(req, res) {
  const where = {};
  if (req.query.status) where.status = req.query.status;

  const inquiries = await prisma.inquiry.findMany({
    where,
    include: { artwork: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(inquiries);
}

export async function replyInquiry(req, res) {
  const { reply } = replySchema.parse(req.body);

  const inquiry = await prisma.inquiry.findUnique({
    where: { id: req.params.id },
    include: { artwork: true },
  });
  if (!inquiry) throw new NotFoundError('Inquiry');

  const updated = await prisma.inquiry.update({
    where: { id: req.params.id },
    data: { reply, status: 'answered', repliedAt: new Date() },
    include: { artwork: true },
  });

  sendInquiryReply({ inquiry: updated, artwork: updated.artwork, reply }).catch(() => null);

  res.json(updated);
}

export async function patchInquiryStatus(req, res) {
  const { status } = statusSchema.parse(req.body);
  const existing = await prisma.inquiry.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError('Inquiry');

  const updated = await prisma.inquiry.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json(updated);
}
