import fs from 'fs/promises';
import path from 'path';

// CRC32 for ZIP
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c;
  }
  return t;
})();

function crc32(data) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) c = (c >>> 8) ^ CRC_TABLE[(c ^ data[i]) & 0xFF];
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function u16(buf, off, v) { buf[off] = v & 0xFF; buf[off+1] = (v >> 8) & 0xFF; }
function u32(buf, off, v) { buf[off] = v & 0xFF; buf[off+1] = (v>>8)&0xFF; buf[off+2] = (v>>16)&0xFF; buf[off+3] = (v>>24)&0xFF; }

// USDZ = ZIP (STORE, no compression) with 64-byte aligned file data
function buildUSDZ(files) {
  const enc = new TextEncoder();
  const locals = [];
  const chunks = [];
  let pos = 0;

  for (const { name, data } of files) {
    const nameB = enc.encode(name);
    const headerSize = 30 + nameB.length;
    const pad = (64 - ((pos + headerSize) % 64)) % 64;
    const hdr = new Uint8Array(headerSize + pad);
    const crc = crc32(data);

    u32(hdr, 0, 0x04034b50);
    u16(hdr, 4, 20); u16(hdr, 6, 0); u16(hdr, 8, 0);
    u16(hdr, 10, 0); u16(hdr, 12, 0);
    u32(hdr, 14, crc);
    u32(hdr, 18, data.length); u32(hdr, 22, data.length);
    u16(hdr, 26, nameB.length); u16(hdr, 28, pad);
    hdr.set(nameB, 30);

    locals.push({ nameB, crc, size: data.length, offset: pos });
    chunks.push(hdr); pos += hdr.length;
    chunks.push(data); pos += data.length;
  }

  const cdOffset = pos;
  for (const { nameB, crc, size, offset } of locals) {
    const cd = new Uint8Array(46 + nameB.length);
    u32(cd, 0, 0x02014b50);
    u16(cd, 4, 63); u16(cd, 6, 20); u16(cd, 8, 0); u16(cd, 10, 0);
    u16(cd, 12, 0); u16(cd, 14, 0);
    u32(cd, 16, crc); u32(cd, 20, size); u32(cd, 24, size);
    u16(cd, 28, nameB.length); u16(cd, 30, 0); u16(cd, 32, 0);
    u16(cd, 34, 0); u16(cd, 36, 0); u32(cd, 38, 0); u32(cd, 42, offset);
    cd.set(nameB, 46);
    chunks.push(cd); pos += cd.length;
  }

  const cdSize = pos - cdOffset;
  const eocd = new Uint8Array(22);
  u32(eocd, 0, 0x06054b50);
  u16(eocd, 4, 0); u16(eocd, 6, 0);
  u16(eocd, 8, files.length); u16(eocd, 10, files.length);
  u32(eocd, 12, cdSize); u32(eocd, 16, cdOffset);
  u16(eocd, 20, 0);
  chunks.push(eocd);

  return Buffer.concat(chunks.map(c => Buffer.from(c)));
}

function parseDimensions(str) {
  const nums = (str || '').match(/[\d.]+/g)?.map(Number) || [];
  return { w: (nums[0] || 80) / 100, h: (nums[1] || nums[0] || 60) / 100 };
}

function makeUSDA(imgName, w, h) {
  const hw = (w / 2).toFixed(4), hh = (h / 2).toFixed(4);
  return `#usda 1.0
(
    defaultPrim = "Root"
    metersPerUnit = 1
    upAxis = "Y"
)
def Xform "Root"
{
    def Mesh "Plane" (
        prepend apiSchemas = ["MaterialBindingAPI"]
    )
    {
        uniform bool doubleSided = 1
        uniform token subdivisionScheme = "none"
        int[] faceVertexCounts = [3, 3]
        int[] faceVertexIndices = [0, 1, 2, 0, 2, 3]
        normal3f[] normals = [(0,0,1),(0,0,1),(0,0,1),(0,0,1)] (interpolation = "vertex")
        point3f[] points = [(-${hw},-${hh},0),(${hw},-${hh},0),(${hw},${hh},0),(-${hw},${hh},0)]
        texCoord2f[] primvars:st = [(0,1),(1,1),(1,0),(0,0)] (interpolation = "vertex")
        rel material:binding = </Root/Mat>
    }
    def Material "Mat"
    {
        token outputs:surface.connect = </Root/Mat/Shader.outputs:surface>
        def Shader "Shader"
        {
            uniform token info:id = "UsdPreviewSurface"
            color3f inputs:diffuseColor.connect = </Root/Mat/Tex.outputs:rgb>
            float inputs:roughness = 1
            float inputs:metallic = 0
            token outputs:surface
        }
        def Shader "Tex"
        {
            uniform token info:id = "UsdUVTexture"
            asset inputs:file = @${imgName}@
            float2 inputs:st.connect = </Root/Mat/UV.outputs:result>
            float3 outputs:rgb
        }
        def Shader "UV"
        {
            uniform token info:id = "UsdPrimvarReader_float2"
            string inputs:varname = "st"
            float2 outputs:result
        }
    }
}
`;
}

export async function generateArtworkUSDZ(artwork) {
  const { w, h } = parseDimensions(artwork.dimensions);
  const uploadsDir = process.env.UPLOADS_DIR ?? './uploads';
  const imgSrc = artwork.images?.[0];

  let imgData, imgName;
  if (imgSrc) {
    const filePath = path.join(uploadsDir, imgSrc.replace('/uploads/', ''));
    imgData = new Uint8Array(await fs.readFile(filePath));
    imgName = path.basename(filePath);
  } else {
    // 1x1 grey JPEG fallback
    imgData = new Uint8Array(Buffer.from(
      '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8AKf/Z',
      'base64'
    ));
    imgName = 'texture.jpg';
  }

  const usda = Buffer.from(makeUSDA(imgName, w, h), 'utf-8');

  return buildUSDZ([
    { name: 'scene.usda', data: new Uint8Array(usda) },
    { name: imgName,      data: imgData },
  ]);
}
