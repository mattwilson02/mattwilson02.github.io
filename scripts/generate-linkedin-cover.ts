/**
 * Generates public/linkedin-cover.png at 1584x396 (LinkedIn's cover size).
 *
 * Rendered through Puppeteer rather than the bitmap-font canvas so it uses
 * real Inter and matches the site exactly. Reuses the site's palette and the
 * hero's resolving-grid motif, so the two surfaces read as one thing.
 *
 * Run: npx tsx scripts/generate-linkedin-cover.ts
 */
import puppeteer from "puppeteer";
import { writeFileSync } from "fs";
import { join } from "path";
import { existsSync } from "fs";

/** Puppeteer's bundled Chrome isn't downloaded here (postinstall is skipped to
 *  keep CI fast), so fall back to the system install. */
const SYSTEM_CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const W = 1584;
const H = 396;

const BG = "#0a0a0a";
const FG = "#ededed";
const MUTED = "#a3a3a3";
const ACCENT = "#2563eb";
const BORDER = "#262626";

/** Same motif as the site hero: hairline cells resolving into solid ones. */
function motif(): string {
  const COLS = 16;
  const ROWS = 6;
  const CELL = 26;
  const GAP = 7;
  const cells: string[] = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const t = col / (COLS - 1);
      const jitter = ((row * 7 + col * 13) % 10) / 10;
      const solid = t > 0.45 + jitter * 0.45;
      const visible = t > 0.08 + jitter * 0.25;
      if (!visible) continue;

      const x = col * (CELL + GAP);
      const y = row * (CELL + GAP);
      cells.push(
        solid
          ? `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="3" fill="${ACCENT}" opacity="${(0.12 + t * 0.3).toFixed(2)}"/>`
          : `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="3" fill="none" stroke="${BORDER}" stroke-width="1" stroke-dasharray="3 3" opacity="0.55"/>`,
      );
    }
  }

  const w = COLS * (CELL + GAP) - GAP;
  const h = ROWS * (CELL + GAP) - GAP;

  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="white" stop-opacity="0"/>
        <stop offset="45%" stop-color="white" stop-opacity="1"/>
      </linearGradient>
      <mask id="m"><rect width="${w}" height="${h}" fill="url(#fade)"/></mask>
    </defs>
    <g mask="url(#m)">${cells.join("")}</g>
  </svg>`;
}

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:${W}px; height:${H}px; background:${BG}; color:${FG};
    font-family:'Inter',-apple-system,sans-serif;
    display:flex; align-items:center; position:relative; overflow:hidden;
  }
  /* accent bloom, same as the site hero */
  .bloom {
    position:absolute; right:-140px; top:50%; transform:translateY(-50%);
    width:640px; height:380px; border-radius:9999px;
    background:${ACCENT}; opacity:0.09; filter:blur(120px);
  }
  .motif { position:absolute; right:56px; top:50%; transform:translateY(-50%); }
  .content { position:relative; padding-left:92px; max-width:900px; }
  .eyebrow { display:flex; align-items:center; gap:12px; margin-bottom:22px; }
  .rule { width:32px; height:1px; background:${ACCENT}; }
  .eyebrow span {
    font-size:13px; font-weight:600; letter-spacing:0.18em;
    text-transform:uppercase; color:${ACCENT};
  }
  h1 { font-size:52px; font-weight:700; line-height:1.08; letter-spacing:-0.02em; }
  .url { margin-top:24px; font-size:17px; color:${MUTED}; }
</style></head>
<body>
  <div class="bloom"></div>
  <div class="motif">${motif()}</div>
  <div class="content">
    <div class="eyebrow"><span class="rule"></span><span>Independent software engineer</span></div>
    <h1>Bespoke software<br/>development and automations</h1>
    <div class="url">mattwilson.tech</div>
  </div>
</body></html>`;

async function main() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    ...(existsSync(SYSTEM_CHROME) ? { executablePath: SYSTEM_CHROME } : {}),
  });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "networkidle0" });
  const buf = await page.screenshot({ type: "png" });
  await browser.close();

  const out = join(process.cwd(), "public", "linkedin-cover.png");
  writeFileSync(out, buf);
  console.log(`\u2713 ${out} \u2014 ${W}x${H} @2x`);
}

main();
