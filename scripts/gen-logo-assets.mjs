import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';

const mark = readFileSync('public/brand/embir-mark.svg');
mkdirSync('public', { recursive: true });
const transparent = { r: 7, g: 4, b: 9, alpha: 0 };
const solid = { r: 7, g: 4, b: 9, alpha: 1 };

const jobs = [
  { file: 'public/icon-192.png', size: 192, bg: transparent },
  { file: 'public/icon-512.png', size: 512, bg: transparent },
  { file: 'public/favicon-32.png', size: 32, bg: transparent },
  { file: 'public/apple-touch-icon.png', size: 180, bg: solid, pad: 22 },
  { file: 'src/app/apple-icon.png', size: 180, bg: solid, pad: 22 },
];

for (const j of jobs) {
  const inner = j.size - (j.pad ?? 0) * 2;
  let img = sharp(mark, { density: 512 }).resize(inner, inner, { fit: 'contain', background: transparent });
  if (j.pad) img = img.extend({ top: j.pad, bottom: j.pad, left: j.pad, right: j.pad, background: j.bg });
  await img.png().toFile(j.file);
  console.log('OK', j.file);
}

const og = readFileSync('public/brand/embir-og.svg');
await sharp(og, { density: 144 }).png().toFile('public/og-image.png');
console.log('OK og-image.png');
