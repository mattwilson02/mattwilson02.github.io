/**
 * Asset generator for Sprint 13.
 * Generates PNG favicons, headshot, OG image, favicon.ico, and site.webmanifest.
 * Run with: npx tsx scripts/generate-assets.ts
 * Output files are committed to public/.
 */
import { writeFileSync } from "fs";
import { join } from "path";
import { Canvas, FONT, ACCENT, WHITE, DARK, MUTED } from "./canvas";

// ─── Generate headshot (256x256) ─────────────────────────────────────────────
function generateHeadshot(): Buffer {
  const size = 256;
  const c = new Canvas(size, size, 255, 255, 255, 255); // white bg

  // Draw blue circle
  const cx = size / 2, cy = size / 2, r = 118;
  c.circle(cx, cy, r, ...ACCENT);

  // Draw "MW" centred — scale 6 gives 30px wide per char (5*6), 42px tall (7*6)
  const scale = 6;
  const charW = (5 + 1) * scale; // 36px per char
  const textW = charW * 2 - 1 * scale; // two chars, no trailing spacing
  const tx = Math.round(cx - textW / 2);
  const ty = Math.round(cy - (7 * scale) / 2);
  c.drawGlyph(FONT["M"], tx, ty, scale, ...WHITE);
  c.drawGlyph(FONT["W"], tx + charW, ty, scale, ...WHITE);

  return c.toPNG();
}

// ─── Generate favicon at given size ──────────────────────────────────────────
function generateFavicon(size: number): Buffer {
  const c = new Canvas(size, size, ...ACCENT, 255);

  // For sizes large enough, draw "MW"
  if (size >= 32) {
    const scale = size >= 64 ? Math.floor(size / 32) : 1;
    const charW = (5 + 1) * scale;
    const textW = charW * 2 - 1 * scale;
    const tx = Math.round(size / 2 - textW / 2);
    const ty = Math.round(size / 2 - (7 * scale) / 2);
    c.drawGlyph(FONT["M"], tx, ty, scale, ...WHITE);
    c.drawGlyph(FONT["W"], tx + charW, ty, scale, ...WHITE);
  }

  return c.toPNG();
}

// ─── Generate ICO file wrapping a 32x32 PNG ──────────────────────────────────
// Modern ICO format supports PNG images inside ICO containers.
function generateIco(): Buffer {
  const png32 = generateFavicon(32);
  const png16 = generateFavicon(16);

  function entry(size: number, pngBuf: Buffer, offset: number): Buffer {
    const b = Buffer.alloc(16);
    b[0] = size; // width (0 = 256)
    b[1] = size; // height
    b[2] = 0;   // color count
    b[3] = 0;   // reserved
    b.writeUInt16LE(1, 4);  // planes
    b.writeUInt16LE(32, 6); // bit count
    b.writeUInt32LE(pngBuf.length, 8);
    b.writeUInt32LE(offset, 12);
    return b;
  }

  const headerSize = 6;
  const entrySize = 16;
  const numImages = 2;
  const dirSize = headerSize + numImages * entrySize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: ICO
  header.writeUInt16LE(numImages, 4); // count

  const offset1 = dirSize;
  const offset2 = dirSize + png32.length;

  return Buffer.concat([
    header,
    entry(32, png32, offset1),
    entry(16, png16, offset2),
    png32,
    png16,
  ]);
}

// ─── Generate OG image (1200x630) ────────────────────────────────────────────
function generateOGImage(): Buffer {
  const W = 1200, H = 630;
  const c = new Canvas(W, H, ...DARK, 255);

  // Blue accent bar at top
  c.rect(0, 0, W, 6, ...ACCENT);

  // Blue accent bar at bottom
  c.rect(0, H - 6, W, H, ...ACCENT);

  // Large "MW" monogram — centred vertically slightly above centre
  const monogramScale = 12;
  const monogramCharW = (5 + 1) * monogramScale;
  const monogramW = monogramCharW * 2 - 1 * monogramScale;
  const monogramX = Math.round(W / 2 - monogramW / 2);
  const monogramY = Math.round(H / 2 - (7 * monogramScale) / 2) - 80;
  c.drawGlyph(FONT["M"], monogramX, monogramY, monogramScale, ...ACCENT);
  c.drawGlyph(FONT["W"], monogramX + monogramCharW, monogramY, monogramScale, ...ACCENT);

  // "Matt Wilson" — large white text below monogram
  const nameText = "Matt Wilson";
  const nameScale = 5;
  const nameW = c.textWidth(nameText, nameScale);
  const nameX = Math.round(W / 2 - nameW / 2);
  const nameY = monogramY + 7 * monogramScale + 28;
  c.drawText(nameText, nameX, nameY, nameScale, ...WHITE);

  // Subtitle
  const subText = "Senior Full Stack & AI Engineer";
  const subScale = 3;
  const subW = c.textWidth(subText, subScale);
  const subX = Math.round(W / 2 - subW / 2);
  const subY = nameY + 7 * nameScale + 16;
  c.drawText(subText, subX, subY, subScale, ...MUTED);

  // Horizontal separator line
  const lineY = subY + 7 * subScale + 24;
  c.rect(Math.round(W / 2 - 60), lineY, Math.round(W / 2 + 60), lineY + 2, ...ACCENT);

  // URL
  const urlText = "mattwilson02.github.io";
  const urlScale = 2;
  const urlW = c.textWidth(urlText, urlScale);
  const urlX = Math.round(W / 2 - urlW / 2);
  const urlY = lineY + 14;
  c.drawText(urlText, urlX, urlY, urlScale, ...MUTED);

  return c.toPNG();
}

// ─── Write files ─────────────────────────────────────────────────────────────
const publicDir = join(process.cwd(), "public");

writeFileSync(join(publicDir, "headshot.png"), generateHeadshot());
console.log("✓ public/headshot.png");

writeFileSync(join(publicDir, "favicon-16x16.png"), generateFavicon(16));
console.log("✓ public/favicon-16x16.png");

writeFileSync(join(publicDir, "favicon-32x32.png"), generateFavicon(32));
console.log("✓ public/favicon-32x32.png");

writeFileSync(join(publicDir, "apple-touch-icon.png"), generateFavicon(180));
console.log("✓ public/apple-touch-icon.png");

writeFileSync(join(publicDir, "favicon.ico"), generateIco());
console.log("✓ public/favicon.ico");

writeFileSync(join(publicDir, "og-image.png"), generateOGImage());
console.log("✓ public/og-image.png");

const manifest = {
  name: "Matt Wilson — Senior Full Stack & AI Engineer",
  short_name: "Matt Wilson",
  icons: [
    { src: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  ],
  theme_color: "#2563eb",
  background_color: "#ffffff",
  display: "standalone",
};
writeFileSync(
  join(publicDir, "site.webmanifest"),
  JSON.stringify(manifest, null, 2),
  "utf-8",
);
console.log("✓ public/site.webmanifest");
