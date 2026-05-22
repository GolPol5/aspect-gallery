import { Document, NodeIO } from '@gltf-transform/core';
import fs from 'fs/promises';
import path from 'path';

function parseDimensions(str) {
  const nums = (str || '').match(/[\d.]+/g)?.map(Number) || [];
  const w = (nums[0] || 80) / 100;
  const h = (nums[1] || nums[0] || 60) / 100;
  return { w, h };
}

export async function generateArtworkGLB(artwork) {
  const { w, h } = parseDimensions(artwork.dimensions);
  const hw = w / 2, hh = h / 2;

  const doc = new Document();
  const buf = doc.createBuffer();

  let mat;

  const uploadsDir = process.env.UPLOADS_DIR ?? './uploads';
  const imgSrc = artwork.images?.[0];

  if (imgSrc) {
    const filePath = path.join(uploadsDir, imgSrc.replace('/uploads/', ''));
    try {
      const imgData = await fs.readFile(filePath);
      const mime = filePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
      const texture = doc.createTexture().setImage(imgData).setMimeType(mime);
      mat = doc.createMaterial().setBaseColorTexture(texture).setDoubleSided(true).setAlphaMode('OPAQUE').setRoughnessFactor(1).setMetallicFactor(0);
    } catch {
      mat = doc.createMaterial().setBaseColorFactor([0.9, 0.87, 0.82, 1]).setDoubleSided(true).setRoughnessFactor(1).setMetallicFactor(0);
    }
  } else {
    mat = doc.createMaterial().setBaseColorFactor([0.9, 0.87, 0.82, 1]).setDoubleSided(true).setRoughnessFactor(1).setMetallicFactor(0);
  }

  const pos = doc.createAccessor().setType('VEC3')
    .setArray(new Float32Array([-hw, -hh, 0,  hw, -hh, 0,  hw, hh, 0,  -hw, hh, 0]))
    .setBuffer(buf);

  const nor = doc.createAccessor().setType('VEC3')
    .setArray(new Float32Array([0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1]))
    .setBuffer(buf);

  const uv = doc.createAccessor().setType('VEC2')
    .setArray(new Float32Array([0, 1,  1, 1,  1, 0,  0, 0]))
    .setBuffer(buf);

  const idx = doc.createAccessor().setType('SCALAR')
    .setArray(new Uint16Array([0, 1, 2,  0, 2, 3]))
    .setBuffer(buf);

  const prim = doc.createPrimitive()
    .setAttribute('POSITION', pos)
    .setAttribute('NORMAL', nor)
    .setAttribute('TEXCOORD_0', uv)
    .setIndices(idx)
    .setMaterial(mat);

  doc.createScene().addChild(
    doc.createNode().setMesh(doc.createMesh().addPrimitive(prim))
  );

  return Buffer.from(await new NodeIO().writeBinary(doc));
}
