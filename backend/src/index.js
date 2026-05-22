import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import app from './app.js';

// Ensure upload directories exist
const uploadsDir = process.env.UPLOADS_DIR ?? './uploads';
['artworks', 'exhibitions', 'misc'].forEach((sub) => {
  const dir = path.join(uploadsDir, sub);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Aspect API running on http://localhost:${PORT}`);
});
