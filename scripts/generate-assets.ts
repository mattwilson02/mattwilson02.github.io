/**
 * Asset generator for Sprint 13.
 * Generates PNG favicons, headshot, OG image, favicon.ico, and site.webmanifest.
 * Run with: npx tsx scripts/generate-assets.ts
 * Output files are committed to public/.
 */
import { deflateSync } from "zlib";
import { writeFileSync } from "fs";
import { join } from "path";

// ─── PNG encoder ─────────────────────────────────────────────────────────────

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++)
      c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const t = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crcBuf]);
}

/** Encode an RGBA pixel array into a valid PNG buffer. */
function encodePNG(pixels: Uint8Array, width: number, height: number): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA

  // Build raw (unfiltered) scanlines: 1 filter byte + RGBA per pixel
  const stride = 1 + width * 4;
  const raw = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0; // filter: None
    for (let x = 0; x < width; x++) {
      const pi = (y * width + x) * 4;
      const ri = y * stride + 1 + x * 4;
      raw[ri] = pixels[pi];
      raw[ri + 1] = pixels[pi + 1];
      raw[ri + 2] = pixels[pi + 2];
      raw[ri + 3] = pixels[pi + 3];
    }
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ─── Canvas abstraction ───────────────────────────────────────────────────────

class Canvas {
  pixels: Uint8Array;
  w: number;
  h: number;

  constructor(width: number, height: number, fillR = 0, fillG = 0, fillB = 0, fillA = 255) {
    this.w = width;
    this.h = height;
    this.pixels = new Uint8Array(width * height * 4);
    this.fill(fillR, fillG, fillB, fillA);
  }

  private idx(x: number, y: number) {
    return (y * this.w + x) * 4;
  }

  fill(r: number, g: number, b: number, a = 255) {
    for (let i = 0; i < this.w * this.h; i++) {
      this.pixels[i * 4] = r;
      this.pixels[i * 4 + 1] = g;
      this.pixels[i * 4 + 2] = b;
      this.pixels[i * 4 + 3] = a;
    }
  }

  setPixel(x: number, y: number, r: number, g: number, b: number, a = 255) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) return;
    const i = this.idx(x, y);
    this.pixels[i] = r;
    this.pixels[i + 1] = g;
    this.pixels[i + 2] = b;
    this.pixels[i + 3] = a;
  }

  rect(x0: number, y0: number, x1: number, y1: number, r: number, g: number, b: number, a = 255) {
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++)
        this.setPixel(x, y, r, g, b, a);
  }

  circle(cx: number, cy: number, radius: number, r: number, g: number, b: number, a = 255) {
    const r2 = radius * radius;
    for (let y = cy - radius; y <= cy + radius; y++)
      for (let x = cx - radius; x <= cx + radius; x++) {
        const dx = x - cx, dy = y - cy;
        if (dx * dx + dy * dy <= r2) this.setPixel(x, y, r, g, b, a);
      }
  }

  /** Draw a single character using a 5x7 bitmap glyph. scale = pixel size */
  drawGlyph(glyph: number[], x: number, y: number, scale: number, r: number, g: number, b: number) {
    for (let row = 0; row < glyph.length; row++) {
      const bits = glyph[row];
      for (let col = 0; col < 5; col++) {
        if (bits & (1 << (4 - col))) {
          this.rect(
            x + col * scale,
            y + row * scale,
            x + col * scale + scale,
            y + row * scale + scale,
            r, g, b,
          );
        }
      }
    }
  }

  /** Draw a string of text using the built-in 5x7 font.
   *  charSpacing = extra pixels between characters (default 1) */
  drawText(text: string, x: number, y: number, scale: number, r: number, g: number, b: number, charSpacing = 1) {
    let cx = x;
    for (const ch of text) {
      const glyph = FONT[ch] ?? FONT["?"];
      this.drawGlyph(glyph, cx, y, scale, r, g, b);
      cx += (5 + charSpacing) * scale;
    }
    return cx;
  }

  textWidth(text: string, scale: number, charSpacing = 1): number {
    return text.length * (5 + charSpacing) * scale - charSpacing * scale;
  }

  toPNG(): Buffer {
    return encodePNG(this.pixels, this.w, this.h);
  }
}

// ─── 5x7 bitmap font ─────────────────────────────────────────────────────────
// Each entry: 7 rows of 5-bit masks (bit 4 = leftmost pixel)

const FONT: Record<string, number[]> = {
  " ": [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
  "!": [0x04, 0x04, 0x04, 0x04, 0x00, 0x04, 0x00],
  ".": [0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x00],
  "-": [0x00, 0x00, 0x0e, 0x00, 0x00, 0x00, 0x00],
  "_": [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1f],
  "/": [0x01, 0x01, 0x02, 0x04, 0x08, 0x10, 0x10],
  "0": [0x0e, 0x11, 0x13, 0x15, 0x19, 0x11, 0x0e],
  "1": [0x04, 0x0c, 0x04, 0x04, 0x04, 0x04, 0x0e],
  "2": [0x0e, 0x11, 0x01, 0x06, 0x08, 0x10, 0x1f],
  "3": [0x1f, 0x02, 0x04, 0x02, 0x01, 0x11, 0x0e],
  "4": [0x02, 0x06, 0x0a, 0x12, 0x1f, 0x02, 0x02],
  "5": [0x1f, 0x10, 0x1e, 0x01, 0x01, 0x11, 0x0e],
  "6": [0x06, 0x08, 0x10, 0x1e, 0x11, 0x11, 0x0e],
  "7": [0x1f, 0x01, 0x02, 0x04, 0x04, 0x04, 0x04],
  "8": [0x0e, 0x11, 0x11, 0x0e, 0x11, 0x11, 0x0e],
  "9": [0x0e, 0x11, 0x11, 0x0f, 0x01, 0x02, 0x0c],
  A: [0x0e, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  B: [0x1e, 0x11, 0x11, 0x1e, 0x11, 0x11, 0x1e],
  C: [0x0e, 0x11, 0x10, 0x10, 0x10, 0x11, 0x0e],
  D: [0x1c, 0x12, 0x11, 0x11, 0x11, 0x12, 0x1c],
  E: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x1f],
  F: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x10],
  G: [0x0e, 0x11, 0x10, 0x17, 0x11, 0x11, 0x0f],
  H: [0x11, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  I: [0x0e, 0x04, 0x04, 0x04, 0x04, 0x04, 0x0e],
  J: [0x07, 0x02, 0x02, 0x02, 0x02, 0x12, 0x0c],
  K: [0x11, 0x12, 0x14, 0x18, 0x14, 0x12, 0x11],
  L: [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1f],
  M: [0x11, 0x1b, 0x15, 0x11, 0x11, 0x11, 0x11],
  N: [0x11, 0x19, 0x15, 0x13, 0x11, 0x11, 0x11],
  O: [0x0e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  P: [0x1e, 0x11, 0x11, 0x1e, 0x10, 0x10, 0x10],
  Q: [0x0e, 0x11, 0x11, 0x11, 0x15, 0x12, 0x0d],
  R: [0x1e, 0x11, 0x11, 0x1e, 0x14, 0x12, 0x11],
  S: [0x0e, 0x11, 0x10, 0x0e, 0x01, 0x11, 0x0e],
  T: [0x1f, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
  U: [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  V: [0x11, 0x11, 0x11, 0x11, 0x11, 0x0a, 0x04],
  W: [0x11, 0x11, 0x11, 0x15, 0x15, 0x1b, 0x11],
  X: [0x11, 0x11, 0x0a, 0x04, 0x0a, 0x11, 0x11],
  Y: [0x11, 0x11, 0x0a, 0x04, 0x04, 0x04, 0x04],
  Z: [0x1f, 0x01, 0x02, 0x04, 0x08, 0x10, 0x1f],
  a: [0x00, 0x00, 0x0e, 0x01, 0x0f, 0x11, 0x0f],
  b: [0x10, 0x10, 0x1e, 0x11, 0x11, 0x11, 0x1e],
  c: [0x00, 0x00, 0x0e, 0x10, 0x10, 0x11, 0x0e],
  d: [0x01, 0x01, 0x0f, 0x11, 0x11, 0x11, 0x0f],
  e: [0x00, 0x00, 0x0e, 0x11, 0x1f, 0x10, 0x0e],
  f: [0x06, 0x09, 0x08, 0x1c, 0x08, 0x08, 0x08],
  g: [0x00, 0x00, 0x0f, 0x11, 0x0f, 0x01, 0x0e],
  h: [0x10, 0x10, 0x1e, 0x11, 0x11, 0x11, 0x11],
  i: [0x04, 0x00, 0x0c, 0x04, 0x04, 0x04, 0x0e],
  j: [0x02, 0x00, 0x06, 0x02, 0x02, 0x12, 0x0c],
  k: [0x10, 0x10, 0x12, 0x14, 0x18, 0x14, 0x12],
  l: [0x0c, 0x04, 0x04, 0x04, 0x04, 0x04, 0x0e],
  m: [0x00, 0x00, 0x1a, 0x15, 0x15, 0x11, 0x11],
  n: [0x00, 0x00, 0x1e, 0x11, 0x11, 0x11, 0x11],
  o: [0x00, 0x00, 0x0e, 0x11, 0x11, 0x11, 0x0e],
  p: [0x00, 0x00, 0x1e, 0x11, 0x1e, 0x10, 0x10],
  q: [0x00, 0x00, 0x0f, 0x11, 0x0f, 0x01, 0x01],
  r: [0x00, 0x00, 0x16, 0x19, 0x10, 0x10, 0x10],
  s: [0x00, 0x00, 0x0e, 0x10, 0x0e, 0x01, 0x1e],
  t: [0x08, 0x08, 0x1c, 0x08, 0x08, 0x09, 0x06],
  u: [0x00, 0x00, 0x11, 0x11, 0x11, 0x13, 0x0d],
  v: [0x00, 0x00, 0x11, 0x11, 0x11, 0x0a, 0x04],
  w: [0x00, 0x00, 0x11, 0x11, 0x15, 0x1b, 0x11],
  x: [0x00, 0x00, 0x11, 0x0a, 0x04, 0x0a, 0x11],
  y: [0x00, 0x00, 0x11, 0x11, 0x0f, 0x01, 0x0e],
  z: [0x00, 0x00, 0x1f, 0x02, 0x04, 0x08, 0x1f],
  "?": [0x0e, 0x11, 0x01, 0x06, 0x04, 0x00, 0x04],
  "&": [0x0c, 0x12, 0x12, 0x0c, 0x15, 0x12, 0x0d],
};

// ─── Accent / brand colours ───────────────────────────────────────────────────
const ACCENT = [0x25, 0x63, 0xeb] as const; // #2563eb
const WHITE = [0xff, 0xff, 0xff] as const;
const DARK = [0x0a, 0x0a, 0x0a] as const; // #0a0a0a
const MUTED = [0x88, 0x88, 0x99] as const;

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
