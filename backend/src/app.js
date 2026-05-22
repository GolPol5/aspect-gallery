import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppError } from './utils/errors.js';

import arRouter from './routes/ar.js';
import artworksRouter from './routes/artworks.js';
import artistsRouter from './routes/artists.js';
import exhibitionsRouter from './routes/exhibitions.js';
import inquiriesRouter from './routes/inquiries.js';
import contactRouter from './routes/contact.js';
import newsletterRouter from './routes/newsletter.js';
import settingsRouter from './routes/settings.js';
import uploadRouter from './routes/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// AR routes (HTML page + GLB + QR)
app.use('/', arRouter);

// API routes
app.use('/api/artworks', artworksRouter);
app.use('/api/artists', artistsRouter);
app.use('/api/exhibitions', exhibitionsRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/upload', uploadRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 20 MB.' });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Zod errors that bubble up without being caught
  if (err.name === 'ZodError') {
    const errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  // Prisma unique constraint
  if (err.code === 'P2002') {
    return res.status(409).json({ error: `Duplicate value for field: ${err.meta?.target}` });
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
