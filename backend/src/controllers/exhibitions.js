import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/errors.js';
import { createResizedVersions } from '../services/image.js';

const prisma = new PrismaClient();

const schema = z.object({
  slug: z.string().optional(),
  title: z.string().min(1),
  artists: z.string().optional().default(''),
  dateStart: z.string().min(1),
  dateEnd: z.string().min(1),
  teaser: z.string().optional().default(''),
});

function makeSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
    + '-' + Date.now();
}

function computeStatus(exhibition) {
  const now = new Date();
  const start = new Date(exhibition.dateStart);
  const end = new Date(exhibition.dateEnd);
  let status;
  if (now < start) status = 'soon';
  else if (now > end) status = 'past';
  else status = 'current';
  return { ...exhibition, status };
}

export async function listExhibitions(req, res) {
  const exhibitions = await prisma.exhibition.findMany({
    orderBy: { dateStart: 'desc' },
  });

  let result = exhibitions.map(computeStatus);

  const { filter } = req.query;
  if (filter) result = result.filter((e) => e.status === filter);

  res.json(result);
}

export async function getExhibition(req, res) {
  const { idOrSlug } = req.params;
  const isUuid = /^[0-9a-f-]{36}$/.test(idOrSlug);
  const exhibition = await prisma.exhibition.findFirst({
    where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
  });
  if (!exhibition) throw new NotFoundError('Exhibition');
  res.json(computeStatus(exhibition));
}

export async function createExhibition(req, res) {
  const data = schema.parse(req.body);
  const file = req.file;
  let coverImage = null;

  if (file) {
    coverImage = `/uploads/exhibitions/${file.filename}`;
    await createResizedVersions(file.path).catch(() => null);
  }

  const slug = data.slug || makeSlug(data.title);

  const exhibition = await prisma.exhibition.create({
    data: {
      ...data,
      slug,
      dateStart: new Date(data.dateStart),
      dateEnd: new Date(data.dateEnd),
      coverImage,
    },
  });
  res.status(201).json(computeStatus(exhibition));
}

export async function updateExhibition(req, res) {
  const existing = await prisma.exhibition.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError('Exhibition');

  const data = schema.partial().parse(req.body);
  const file = req.file;

  if (file) {
    data.coverImage = `/uploads/exhibitions/${file.filename}`;
    await createResizedVersions(file.path).catch(() => null);
  }

  if (data.dateStart) data.dateStart = new Date(data.dateStart);
  if (data.dateEnd)   data.dateEnd   = new Date(data.dateEnd);

  const exhibition = await prisma.exhibition.update({
    where: { id: req.params.id },
    data,
  });
  res.json(computeStatus(exhibition));
}

export async function deleteExhibition(req, res) {
  const existing = await prisma.exhibition.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError('Exhibition');
  await prisma.exhibition.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
