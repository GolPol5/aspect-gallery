import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';
import { parsePagination, buildMeta } from '../utils/pagination.js';
import { NotFoundError, AppError } from '../utils/errors.js';
import { createResizedVersions } from '../services/image.js';

const prisma = new PrismaClient();

const createSchema = z.object({
  artistId: z.string().min(1),
  title: z.string().min(1),
  year: z.coerce.number().int().min(1000).max(2100),
  type: z.enum(['painting', 'graphic', 'sculpture']),
  genre: z.enum(['abstract', 'portrait', 'landscape', 'still', 'conceptual']),
  size: z.enum(['small', 'medium', 'large']),
  technique: z.string().min(1),
  dimensions: z.string().min(1),
  price: z.coerce.number().int().min(0),
  description: z.string().optional().default(''),
  status: z.enum(['published', 'draft', 'sold']).optional().default('draft'),
});

const updateSchema = createSchema.omit({ artistId: true }).extend({
  artistId: z.string().min(1).optional(),
}).partial();

function artworkPath(filename) {
  return `/uploads/artworks/${filename}`;
}

export async function listArtworks(req, res) {
  const { type, genre, size, artistId, priceMin, priceMax, search, status } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  const where = {};

  // Public listing: hide sold works; admin can pass status explicitly
  if (status) {
    where.status = status;
  } else {
    where.status = { not: 'sold' };
  }

  if (type) where.type = type;
  if (genre) where.genre = genre;
  if (size) where.size = size;
  if (artistId) where.artistId = artistId;
  if (priceMin || priceMax) {
    where.price = {};
    if (priceMin) where.price.gte = parseInt(priceMin);
    if (priceMax) where.price.lte = parseInt(priceMax);
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { technique: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, data] = await Promise.all([
    prisma.artwork.count({ where }),
    prisma.artwork.findMany({
      where,
      include: { artist: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  res.json({ data, ...buildMeta(total, page, limit) });
}

export async function getArtwork(req, res) {
  const artwork = await prisma.artwork.findUnique({
    where: { id: req.params.id },
    include: { artist: true },
  });
  if (!artwork) throw new NotFoundError('Artwork');
  res.json(artwork);
}

export async function createArtwork(req, res) {
  const data = createSchema.parse(req.body);
  const files = req.files ?? [];
  const images = [];

  for (const file of files) {
    images.push(artworkPath(file.filename));
    await createResizedVersions(file.path).catch(() => null);
  }

  const artwork = await prisma.artwork.create({ data: { ...data, images } });
  res.status(201).json(artwork);
}

export async function updateArtwork(req, res) {
  const data = updateSchema.parse(req.body);
  const existing = await prisma.artwork.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError('Artwork');

  const artwork = await prisma.artwork.update({
    where: { id: req.params.id },
    data,
  });
  res.json(artwork);
}

export async function deleteArtwork(req, res) {
  const existing = await prisma.artwork.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError('Artwork');
  await prisma.artwork.delete({ where: { id: req.params.id } });
  res.status(204).end();
}

export async function addImages(req, res) {
  const existing = await prisma.artwork.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError('Artwork');

  const files = req.files ?? [];
  if (!files.length) throw new AppError('No images uploaded', 400);

  const newPaths = [];
  for (const file of files) {
    newPaths.push(artworkPath(file.filename));
    await createResizedVersions(file.path).catch(() => null);
  }

  const artwork = await prisma.artwork.update({
    where: { id: req.params.id },
    data: { images: { push: newPaths } },
  });
  res.json(artwork);
}

export async function deleteImage(req, res) {
  const { id, filename } = req.params;
  const existing = await prisma.artwork.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Artwork');

  const targetPath = artworkPath(filename);
  if (!existing.images.includes(targetPath)) {
    throw new AppError('Image not found on this artwork', 404);
  }

  const images = existing.images.filter((img) => img !== targetPath);

  // Remove file and resized versions (best effort)
  const uploadsDir = process.env.UPLOADS_DIR ?? './uploads';
  const base = path.basename(filename, path.extname(filename));
  const filesToRemove = [
    path.join(uploadsDir, 'artworks', filename),
    path.join(uploadsDir, 'artworks', `${base}-800.jpg`),
    path.join(uploadsDir, 'artworks', `${base}-400.jpg`),
  ];
  await Promise.all(filesToRemove.map((f) => fs.unlink(f).catch(() => null)));

  const artwork = await prisma.artwork.update({ where: { id }, data: { images } });
  res.json(artwork);
}
