// Generates the social-share (Open Graph / Twitter) plates into public/og/*.jpg.
// Each card is a warm-paper "exhibition catalogue cover plate" rendered in the real
// brand faces (Bricolage Grotesque + Hanken Grotesk + Spline Sans Mono) by a headless
// Chromium, then supersampled down for crisp type. librsvg/resvg (the sharp+SVG path
// build-contact-sheet.mjs uses) can't load Bricolage, so this goes through Puppeteer.
//
// Output is 1200x630 (the og:image contract Layout.astro hardcodes). Re-run after
// changing the brand line, the cover photo, or after adding a blog post that wants its
// own plate: `node scripts/build-og.mjs`
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/og');

const W = 1200, H = 630, SCALE = 2; // render at 2x, supersample down → crisp glyphs

// ---- design tokens (verbatim from Layout.astro :root, so the plate is brand-true) ----
const TOKENS = `
  --paper:      oklch(0.965 0.013 83);
  --paper-sink: oklch(0.945 0.016 82);
  --paper-edge: oklch(0.918 0.018 81);
  --ink:        oklch(0.225 0.014 70);
  --ink-soft:   oklch(0.405 0.014 68);
  --ink-faint:  oklch(0.520 0.012 70);
  --ink-ghost:  oklch(0.590 0.010 72);
  --ochre:      oklch(0.585 0.130 56);
  --ochre-deep: oklch(0.500 0.120 50);
  --line:       oklch(0.225 0.014 70 / 0.14);
  --line-strong:oklch(0.225 0.014 70 / 0.30);
`;

const FONTS_LINK =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=Hanken+Grotesk:wght@300;400;500;600;700&family=Spline+Sans+Mono:wght@400;500&display=swap" rel="stylesheet">';

const BASE_CSS = `
  *{margin:0;padding:0;box-sizing:border-box;}
  :root{${TOKENS}}
  html,body{width:${W}px;height:${H}px;}
  body{
    background:var(--paper);color:var(--ink);
    font-family:'Hanken Grotesk',sans-serif;
    -webkit-font-smoothing:antialiased;
    /* faint paper tooth: two offset ink specks, barely there */
    background-image:
      radial-gradient(oklch(0.225 0.014 70 / 0.018) 0.5px, transparent 0.6px),
      radial-gradient(oklch(0.225 0.014 70 / 0.014) 0.5px, transparent 0.6px);
    background-size:7px 7px, 11px 11px;
    background-position:0 0, 3px 5px;
  }
  .plate{position:relative;width:${W}px;height:${H}px;padding:40px;}
  .frame{
    width:100%;height:100%;border:1px solid var(--line);
    padding:48px 56px;display:flex;flex-direction:column;
  }
  .mono{font-family:'Spline Sans Mono',monospace;}
  .display{font-family:'Bricolage Grotesque',sans-serif;}
  .ochre{color:var(--ochre);}

  /* running header / footer — wall-label texture */
  .chrome{
    display:flex;justify-content:space-between;align-items:baseline;
    font-family:'Spline Sans Mono',monospace;
    font-size:15px;letter-spacing:0.22em;text-transform:uppercase;
    color:var(--ink-faint);
  }
  .chrome .lead{color:var(--ink);font-weight:500;}
  .rule{height:1px;background:var(--line);width:100%;}
  .head .rule{margin-top:18px;}
  .foot{margin-top:auto;}
  .foot .rule{margin-bottom:18px;}

  .body{flex:1;display:flex;min-height:0;}
`;

// --------------------------- the cover (default) plate ---------------------------
function coverHTML({ photoDataURI }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">${FONTS_LINK}
  <style>${BASE_CSS}
    .cover .left{
      flex:1;display:flex;flex-direction:column;justify-content:center;
      padding-right:52px;min-width:0;
    }
    .cover .index{
      font-family:'Spline Sans Mono',monospace;font-size:17px;
      letter-spacing:0.16em;color:var(--ochre);font-weight:500;
      margin-bottom:14px;
    }
    .cover .wordmark{
      font-family:'Bricolage Grotesque',sans-serif;font-weight:500;
      font-size:110px;line-height:0.88;letter-spacing:-0.045em;
      color:var(--ink);
    }
    .cover .wordmark .l2{display:block;}
    .cover .sub{
      font-size:23px;line-height:1.4;color:var(--ink-soft);
      max-width:36ch;margin-top:24px;font-weight:400;
    }
    .cover .right{
      width:382px;flex-shrink:0;position:relative;
      border:1px solid var(--line-strong);overflow:hidden;
    }
    .cover .right img{width:100%;height:100%;object-fit:cover;display:block;
      filter:saturate(1.02) contrast(1.01);}
    .cover .walllabel{
      position:absolute;left:0;bottom:0;
      background:var(--paper);
      border-top:1px solid var(--line);border-right:1px solid var(--line);
      font-family:'Spline Sans Mono',monospace;
      font-size:13px;letter-spacing:0.08em;text-transform:uppercase;
      color:var(--ink);padding:9px 14px;
    }
    .cover .walllabel .n{color:var(--ochre);}
  </style></head>
  <body><div class="plate"><div class="frame cover">
    <div class="head">
      <div class="chrome"><span class="lead">Morax Cheng</span><span>Portfolio &middot; Catalogue</span></div>
      <div class="rule"></div>
    </div>
    <div class="body" style="padding:20px 0;">
      <div class="left">
        <div class="index">01</div>
        <div class="wordmark">Morax<span class="l2">Cheng<span class="ochre">.</span></span></div>
        <div class="sub">Student developer &amp; economics enthusiast. Software, markets, and a camera.</div>
      </div>
      <div class="right">
        <img src="${photoDataURI}" alt="">
        <div class="walllabel"><span class="n">Pl. 01</span> &nbsp;Eiffel Tower, dusk</div>
      </div>
    </div>
    <div class="foot">
      <div class="rule"></div>
      <div class="chrome"><span>Developer / Economics / Photography</span><span class="lead">moraxcheng.me</span></div>
    </div>
  </div></div></body></html>`;
}

// --------------------------- the writing (per-post) plate ---------------------------
// Type-forward: the projects/writing have no photograph, so the oversized index numeral
// IS the plate (the DESIGN.md "the number is the plate" law).
function writingHTML({ title, category, dateLabel, index }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">${FONTS_LINK}
  <style>${BASE_CSS}
    .writing .body{
      position:relative;flex-direction:column;
      justify-content:center;align-items:flex-start;overflow:hidden;
    }
    .writing .ghost{
      position:absolute;right:-8px;bottom:-86px;
      font-family:'Bricolage Grotesque',sans-serif;font-weight:600;
      font-size:360px;line-height:0.7;letter-spacing:-0.04em;
      color:var(--ochre);opacity:0.09;pointer-events:none;user-select:none;
    }
    .writing .fg{position:relative;z-index:1;width:660px;}
    .writing .kicker{
      font-family:'Spline Sans Mono',monospace;font-size:16px;font-weight:500;
      letter-spacing:0.2em;text-transform:uppercase;color:var(--ochre);
    }
    .writing .accent{height:2px;width:64px;background:var(--ochre);margin-top:16px;}
    .writing h1{
      font-family:'Bricolage Grotesque',sans-serif;font-weight:500;
      font-size:44px;line-height:1.08;letter-spacing:-0.02em;color:var(--ink);
      margin-top:22px;text-wrap:balance;
    }
  </style></head>
  <body><div class="plate"><div class="frame writing">
    <div class="head">
      <div class="chrome"><span class="lead">Morax Cheng &middot; Writing</span><span>${esc(category)}</span></div>
      <div class="rule"></div>
    </div>
    <div class="body" style="padding:34px 0;">
      <div class="ghost">${esc(index)}</div>
      <div class="fg">
        <div class="kicker">${esc(category)}</div>
        <div class="accent"></div>
        <h1>${esc(title)}</h1>
      </div>
    </div>
    <div class="foot">
      <div class="rule"></div>
      <div class="chrome"><span>${esc(dateLabel)} &middot; Morax Cheng</span><span class="lead">moraxcheng.me</span></div>
    </div>
  </div></div></body></html>`;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function dataURI(relPath, mime) {
  const buf = await readFile(join(ROOT, relPath));
  return `data:${mime};base64,${buf.toString('base64')}`;
}

async function shoot(browser, html, outName) {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: SCALE });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  // Critical: don't screenshot before the webfonts land, or you silently get the
  // fallback face instead of Bricolage. Wait for the font set, then a short settle.
  await page.evaluate(async () => { await document.fonts.ready; });
  await new Promise((r) => setTimeout(r, 200));
  const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
  await page.close();
  // Supersample 2x → 1x and encode a lean JPEG (the cover carries a photo; q90 keeps
  // type crisp while staying well under social-scraper size limits).
  const out = join(OUT, outName);
  await sharp(png).resize(W, H, { fit: 'fill' }).jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true }).toFile(out);
  const { size } = await sharp(out).metadata().then(async () => ({ size: (await readFile(out)).length }));
  console.log(`  ${outName.padEnd(60)} ${(size / 1024).toFixed(0)} KB`);
}

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
try {
  await mkdir(OUT, { recursive: true });
  const eiffel = await dataURI('public/gallery/Paris_Eiffel-Tower-Dusk-Seine.webp', 'image/webp');

  console.log('Building OG plates → public/og/');
  await shoot(browser, coverHTML({ photoDataURI: eiffel }), 'cover.jpg');

  // Per-post plates. One explicit entry per post that wants its own plate (no frontmatter
  // parser, no new dep). The post's .mdx must set `ogImage: /og/<file>` to use it.
  const posts = [
    {
      file: 'machine-learning-solution-global-multi-port-commodities.jpg',
      title: 'Machine Learning Solution for Global Multi-Port Commodities Flow',
      category: 'Technology',
      dateLabel: 'August 9, 2024',
      index: '01',
    },
  ];
  for (const p of posts) await shoot(browser, writingHTML(p), p.file);

  console.log('Done.');
} finally {
  await browser.close();
}
