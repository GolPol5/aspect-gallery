import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/errors.js';

const prisma = new PrismaClient();

const schema = z.object({
  name: z.string().min(1),
  bio: z.string().optional().default(''),
});

export async function listArtists(_req, res) {
  const artists = await prisma.artist.findMany({ orderBy: { name: 'asc' } });
  res.json(artists);
}

export async function getArtist(req, res) {
  const artist = await prisma.artist.findUnique({
    where: { id: req.params.id },
    include: {
      artworks: {
        where: { status: { not: 'sold' } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!artist) throw new NotFoundError('Artist');
  res.json(artist);
}

export async function createArtist(req, res) {
  const data = schema.parse(req.body);
  const artist = await prisma.artist.create({ data });
  res.status(201).json(artist);
}

export async function updateArtist(req, res) {
  const data = schema.partial().parse(req.body);
  const existing = await prisma.artist.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError('Artist');
  const artist = await prisma.artist.update({ where: { id: req.params.id }, data });
  res.json(artist);
}

export async function deleteArtist(req, res) {
  const existing = await prisma.artist.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError('Artist');
  await prisma.artist.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
