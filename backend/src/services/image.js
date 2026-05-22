import sharp from 'sharp';
import path from 'path';

export async function createResizedVersions(filePath) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);

  const sizes = [
    { suffix: '800', width: 800 },
    { suffix: '400', width: 400 },
  ];

  await Promise.all(
    sizes.map(({ suffix, width }) =>
      sharp(filePath)
        .resize({ width, withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(path.join(dir, `${base}-${suffix}.jpg`))
    )
  );
}
