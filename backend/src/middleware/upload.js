import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { AppError } from '../utils/errors.js';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

function makeStorage(destination) {
  return multer.diskStorage({
    destination,
    filename(_req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}-${Date.now()}${ext}`);
    },
  });
}

function fileFilter(_req, file, cb) {
  if (ALLOWED_MIME.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only JPG, PNG and WebP images are allowed', 400));
  }
}

export const artworkUpload = multer({
  storage: makeStorage('uploads/artworks'),
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

export const exhibitionUpload = multer({
  storage: makeStorage('uploads/exhibitions'),
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

export const generalUpload = multer({
  storage: makeStorage('uploads/misc'),
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

const MODEL_MIME = ['model/gltf-binary', 'model/vnd.usdz+zip', 'application/octet-stream'];
const MODEL_EXT  = ['.glb', '.usdz'];

export const modelUpload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/models',
    filename(req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${req.params.id}${ext}`);
    },
  }),
  fileFilter(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (MODEL_EXT.includes(ext)) return cb(null, true);
    cb(new AppError('Only .glb and .usdz files are allowed', 400));
  },
  limits: { fileSize: 100 * 1024 * 1024 },
});
