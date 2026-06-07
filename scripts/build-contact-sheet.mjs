// Generates public/contact-sheet.webp: a printed "contact sheet" proof of twelve
// gallery frames (warm paper, hairline frame borders, mono frame numbers + places,
// header). The homepage movement-04 coda renders this as an ochre+ink halftone that a
// darkroom loupe resolves to colour (see buildLoupe in src/layouts/Layout.astro).
// Re-run after changing the gallery: `node scripts/build-contact-sheet.mjs`
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'public/gallery');
const frames = [
  ['Paris_Eiffel-Tower-Dusk-Seine.webp', 'Seine'],
  ['Paris_Arc-de-Triomphe-Up-Close.webp', 'Arc'],
  ['Paris_Louvre-Mona-Lisa.webp', 'Louvre'],
  ['Paris_Louvre-Coronation-of-Napoleon.webp', 'Louvre'],
  ['Paris_Notre-Dame-Apse-Stained-Glass.webp', 'Notre-Dame'],
  ['Paris_Sacre-Coeur-Basilica.webp', 'Montmartre'],
  ['Paris_Montmartre-Panoramic-View.webp', 'Montmartre'],
  ['Paris_Seine-River-Quay-and-Boats.webp', 'Seine'],
  ['Paris_Louvre-Winged-Victory-of-Samothrace.webp', 'Louvre'],
  ['Skiing_Summit-Mountain-Panorama.webp', 'Beidahu'],
  ['Skiing_Red-Suit-Sunny-Carving.webp', 'Beidahu'],
  ['Skiing_Snowy-Run-Trees-Blue-Sky.webp', 'Beidahu'],
];

const W = 1600, M = 72, HH = 64, C = 4, R = 3, G = 30;
const FW = Math.round((W - 2 * M - (C - 1) * G) / C);
const FH = Math.round(FW * 2 / 3);
const CH = 30;
const H = M + HH + R * (FH + CH) + (R - 1) * G + M;

const PAPER = { r: 248, g: 243, b: 234 };
const INK = '#3a342c', INK_SOFT = '#6e685f', LINE = 'rgba(40,32,24,0.28)';
const xOf = (c) => M + c * (FW + G);
const yOf = (r) => M + HH + r * (FH + CH + G);

const composites = [];
for (let i = 0; i < frames.length; i++) {
  const buf = await sharp(join(DIR, frames[i][0])).resize(FW, FH, { fit: 'cover', position: 'centre' }).toBuffer();
  composites.push({ input: buf, top: yOf(Math.floor(i / C)), left: xOf(i % C) });
}

let cells = '';
for (let i = 0; i < frames.length; i++) {
  const x = xOf(i % C), y = yOf(Math.floor(i / C)), n = String(i + 1).padStart(2, '0');
  cells += `<rect x="${x - 0.5}" y="${y - 0.5}" width="${FW + 1}" height="${FH + 1}" fill="none" stroke="${LINE}" stroke-width="1"/>`;
  cells += `<text x="${x}" y="${y + FH + 21}" font-family="Menlo, monospace" font-size="14" letter-spacing="1" fill="${INK}">${n}</text>`;
  cells += `<text x="${x + FW}" y="${y + FH + 21}" font-family="Menlo, monospace" font-size="12" letter-spacing="0.5" fill="${INK_SOFT}" text-anchor="end">${frames[i][1]}</text>`;
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <text x="${M}" y="${M + 18}" font-family="Menlo, monospace" font-size="18" letter-spacing="3" fill="${INK}">CONTACT SHEET</text>
  <text x="${W - M}" y="${M + 18}" font-family="Menlo, monospace" font-size="14" letter-spacing="2" fill="${INK_SOFT}" text-anchor="end">MORAX CHENG · PARIS · JILIN · 2025</text>
  <line x1="${M}" y1="${M + 34}" x2="${W - M}" y2="${M + 34}" stroke="${LINE}" stroke-width="1"/>
  ${cells}
  <rect x="6.5" y="6.5" width="${W - 13}" height="${H - 13}" fill="none" stroke="${LINE}" stroke-width="1"/>
</svg>`;

await sharp({ create: { width: W, height: H, channels: 3, background: PAPER } })
  .composite([...composites, { input: Buffer.from(svg), top: 0, left: 0 }])
  .webp({ quality: 82 })
  .toFile(join(ROOT, 'public/contact-sheet.webp'));

console.log(`contact-sheet.webp built: ${W}x${H}, frame ${FW}x${FH}`);
