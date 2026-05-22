import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/errors.js';
import { sendContactNotification } from '../services/email.js';

const prisma = new PrismaClient();

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

export async function createMessage(req, res) {
  const data = schema.parse(req.body);
  const msg = await prisma.contactMessage.create({ data });

  sendContactNotification({ msg }).catch(() => null);

  res.status(201).json(msg);
}

export async function listMessages(req, res) {
  const where = {};
  if (req.query.isRead === 'true') where.isRead = true;
  if (req.query.isRead === 'false') where.isRead = false;

  const messages = await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  res.json(messages);
}

export async function markRead(req, res) {
  const existing = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError('Message');

  const updated = await prisma.contactMessage.update({
    where: { id: req.params.id },
    data: { isRead: true },
  });
  res.json(updated);
}
