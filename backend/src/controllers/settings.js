import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fixed ID so there is always exactly one settings row
const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

const schema = z.object({
  galleryName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  metaDescription: z.string().optional().default(''),
  workingHours: z.string().optional().default(''),
});

export async function getSettings(_req, res) {
  const settings = await prisma.gallerySettings.findUnique({ where: { id: SETTINGS_ID } });
  res.json(settings ?? {});
}

export async function upsertSettings(req, res) {
  const data = schema.parse(req.body);

  const settings = await prisma.gallerySettings.upsert({
    where: { id: SETTINGS_ID },
    update: data,
    create: { id: SETTINGS_ID, ...data },
  });
  res.json(settings);
}
