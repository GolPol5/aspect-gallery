import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { generateArtworkGLB } from '../services/glb.js';
import { generateArtworkUSDZ } from '../services/usdz.js';
import { modelUpload } from '../middleware/upload.js';

const router = Router();
const prisma = new PrismaClient();

function modelsDir() {
  return path.join(process.env.UPLOADS_DIR ?? './uploads', 'models');
}

async function modelExists(id, ext) {
  try { await fs.access(path.join(modelsDir(), `${id}.${ext}`)); return true; } catch { return false; }
}

function getLocalIP() {
  const nets = os.networkInterfaces()
  const all = []
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) all.push(net.address)
    }
  }
  // Prefer real LAN ranges (192.168.x.x or 10.x.x.x) over Docker/VM bridges (172.x.x.x)
  return all.find(ip => /^192\.168\./.test(ip))
      || all.find(ip => /^10\./.test(ip))
      || all[0]
      || 'localhost'
}

function getBase() {
  const ip = process.env.HOST_IP || getLocalIP();
  return `http://${ip}:3000`;
}

// AR viewer page — opens on phone
router.get('/ar/:id', async (req, res) => {
  const artwork = await prisma.artwork.findUnique({
    where: { id: req.params.id },
    include: { artist: true },
  });
  if (!artwork) return res.status(404).send('Not found');

  const base    = getBase();
  const glbUrl  = `${base}/api/ar/${artwork.id}/model.glb`;
  const usdzUrl = `${base}/api/ar/${artwork.id}/model.usdz`;
  const ua      = req.headers['user-agent'] || '';
  const isIOS   = /iPhone|iPad|iPod/i.test(ua);

  // iOS Safari — <a rel="ar"> requires real user tap to bypass preview
  if (isIOS) {
    const imgSrc = artwork.images?.[0] ? `${base}${artwork.images[0]}` : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>${artwork.title}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#0e0e0e;color:#fff;font-family:-apple-system,sans-serif;height:100dvh;display:flex;flex-direction:column}
    .top{padding:20px 24px;border-bottom:1px solid #222}
    .top h1{font-size:17px;font-weight:500;margin-bottom:4px}
    .top p{font-size:13px;color:#666}
    .preview{flex:1;display:flex;align-items:center;justify-content:center;padding:24px;${imgSrc ? `background:url(${imgSrc}) center/contain no-repeat;` : 'background:#1a1a1a;'}}
    .btn-wrap{padding:24px}
    .btn{
      display:block;width:100%;padding:18px;
      background:#B5622A;color:#fff;
      font-size:17px;font-weight:600;
      text-align:center;text-decoration:none;
      border-radius:14px;letter-spacing:0.01em;
    }
    .hint{text-align:center;font-size:12px;color:#555;margin-top:12px}
  </style>
</head>
<body>
  <div class="top">
    <h1>${artwork.title}</h1>
    <p>${artwork.artist?.name ?? ''} · ${artwork.year} · ${artwork.dimensions}</p>
  </div>
  <div class="preview"></div>
  <div class="btn-wrap">
    <a rel="ar" href="${usdzUrl}" class="btn">Посмотреть в AR</a>
    <p class="hint">Нажмите, чтобы разместить работу в вашем пространстве</p>
  </div>
</body>
</html>`);
  }

  // Android / Desktop — model-viewer page
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>${artwork.title}</title>
  <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#111;color:#fff;font-family:-apple-system,sans-serif;height:100dvh;display:flex;flex-direction:column}
    .hd{padding:14px 16px;border-bottom:1px solid #2a2a2a}
    .hd h1{font-size:16px;font-weight:500}
    .hd p{font-size:12px;color:#777;margin-top:3px}
    model-viewer{flex:1;width:100%;--progress-bar-color:#B5622A}
    .ft{padding:10px 16px;font-size:11px;color:#555;text-align:center}
  </style>
</head>
<body>
  <div class="hd">
    <h1>${artwork.title}</h1>
    <p>${artwork.artist?.name ?? ''} &nbsp;·&nbsp; ${artwork.year} &nbsp;·&nbsp; ${artwork.dimensions}</p>
  </div>
  <model-viewer
    src="${glbUrl}"
    ios-src="${usdzUrl}"
    ar
    ar-modes="scene-viewer webxr quick-look"
    ar-scale="fixed"
    ar-placement="wall"
    camera-controls
    auto-rotate
    shadow-intensity="0.5"
    exposure="1.2">
  </model-viewer>
  <div class="ft">Нажмите кнопку AR · Android Chrome</div>
</body>
</html>`);
});

// GLB model
router.get('/api/ar/:id/model.glb', async (req, res) => {
  const { id } = req.params;
  res.setHeader('Content-Type', 'model/gltf-binary');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  if (await modelExists(id, 'glb')) {
    return res.sendFile(path.resolve(path.join(modelsDir(), `${id}.glb`)));
  }

  const artwork = await prisma.artwork.findUnique({ where: { id } });
  if (!artwork) return res.status(404).end();
  res.send(await generateArtworkGLB(artwork));
});

// QR code PNG
router.get('/api/ar/:id/qr', async (req, res) => {
  const base = getBase();
  const url = `${base}/ar/${req.params.id}`;
  const png = await QRCode.toBuffer(url, { width: 300, margin: 2, color: { dark: '#111111', light: '#ffffff' } });
  res.setHeader('Content-Type', 'image/png');
  res.send(png);
});

// USDZ model (iOS AR Quick Look)
router.get('/api/ar/:id/model.usdz', async (req, res) => {
  const { id } = req.params;
  res.setHeader('Content-Type', 'model/vnd.usdz+zip');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  if (await modelExists(id, 'usdz')) {
    return res.sendFile(path.resolve(path.join(modelsDir(), `${id}.usdz`)));
  }

  const artwork = await prisma.artwork.findUnique({ where: { id } });
  if (!artwork) return res.status(404).end();
  res.send(await generateArtworkUSDZ(artwork));
});

router.get('/api/ar/info', (_req, res) => {
  res.json({ base: getBase() });
});

// Upload GLB and/or USDZ models for an artwork
router.post('/api/ar/:id/models', modelUpload.fields([
  { name: 'glb', maxCount: 1 },
  { name: 'usdz', maxCount: 1 },
]), async (req, res) => {
  const uploaded = {};
  if (req.files?.glb)  uploaded.glb  = true;
  if (req.files?.usdz) uploaded.usdz = true;
  if (!Object.keys(uploaded).length) return res.status(400).json({ error: 'No files uploaded' });
  res.json({ uploaded });
});

// Delete cached/uploaded models to force regeneration
router.delete('/api/ar/:id/models', async (req, res) => {
  const { id } = req.params;
  await Promise.all([
    fs.unlink(path.join(modelsDir(), `${id}.glb`)).catch(() => null),
    fs.unlink(path.join(modelsDir(), `${id}.usdz`)).catch(() => null),
  ]);
  res.json({ deleted: true });
});

export default router;
