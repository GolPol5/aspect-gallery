import { AppError } from '../utils/errors.js';
import { createResizedVersions } from '../services/image.js';

export async function uploadImage(req, res) {
  if (!req.file) throw new AppError('No image uploaded', 400);

  await createResizedVersions(req.file.path).catch(() => null);

  res.json({
    url: `/uploads/misc/${req.file.filename}`,
    filename: req.file.filename,
  });
}
