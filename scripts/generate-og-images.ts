/**
 * Generates per-post and per-tag OG images at build time.
 * Run with: npx tsx scripts/generate-og-images.ts
 * Output files are committed to public/og/.
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { Canvas, FONT, ACCENT, WHITE, DARK, MUTED } from "./canvas";
import { blogPosts } from "../src/data/blog";

const W = 1200;
const H = 630;

/** Compute pixel width of a text string at given scale (charSpacing=1). */
function textWidth(text: string, scale: number): number {
  return text.length * (5 + 1) * scale - 1 * scale;
}

/** Word-wrap text to fit within maxWidth pixels at given scale. */
function wrapText(text: string, scale: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (textWidth(candidate, scale) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawAccentBars(c: Canvas) {
  c.rect(0, 0, W, 6, ...ACCENT);
  c.rect(0, H - 6, W, H, ...ACCENT);
}

function generatePostOGImage(title: string): Buffer {
  const c = new Canvas(W, H, ...DARK, 255);
  drawAccentBars(c);

  const titleScale = 5;
  const titleLineH = 7 * titleScale; // 35px
  const titleLineGap = 12;
  const maxTitleWidth = 1000;

  const titleLines = wrapText(title, titleScale, maxTitleWidth);
  const titleBlockH =
    titleLines.length * titleLineH + (titleLines.length - 1) * titleLineGap;

  const authorScale = 3;
  const authorLineH = 7 * authorScale; // 21px

  const urlScale = 2;
  const urlLineH = 7 * urlScale; // 14px

  const afterTitleGap = 36;
  const separatorH = 2;
  const afterSeparatorGap = 14;

  const totalH =
    titleBlockH + afterTitleGap + authorLineH + afterSeparatorGap + separatorH + afterSeparatorGap + urlLineH;

  const usableH = H - 12; // subtract accent bars (6 top + 6 bottom)
  const startY = Math.round((usableH - totalH) / 2) + 6;

  // Draw title lines
  let y = startY;
  for (const line of titleLines) {
    const w = textWidth(line, titleScale);
    const x = Math.round(W / 2 - w / 2);
    c.drawText(line, x, y, titleScale, ...WHITE);
    y += titleLineH + titleLineGap;
  }
  y = y - titleLineGap + afterTitleGap;

  // Draw "Matt Wilson"
  const authorText = "Matt Wilson";
  const authorW = textWidth(authorText, authorScale);
  const authorX = Math.round(W / 2 - authorW / 2);
  c.drawText(authorText, authorX, y, authorScale, ...MUTED);
  y += authorLineH + afterSeparatorGap;

  // Draw separator line
  const sepHalfW = 60;
  c.rect(Math.round(W / 2 - sepHalfW), y, Math.round(W / 2 + sepHalfW), y + separatorH, ...ACCENT);
  y += separatorH + afterSeparatorGap;

  // Draw URL
  const urlText = "mattwilson02.github.io";
  const urlW = textWidth(urlText, urlScale);
  const urlX = Math.round(W / 2 - urlW / 2);
  c.drawText(urlText, urlX, y, urlScale, ...MUTED);

  return c.toPNG();
}

function generateTagOGImage(tag: string, postCount: number): Buffer {
  const c = new Canvas(W, H, ...DARK, 255);
  drawAccentBars(c);

  // Choose scale based on tag length
  const tagScale = textWidth(tag, 8) <= 900 ? 8 : textWidth(tag, 6) <= 900 ? 6 : 5;
  const tagLineH = 7 * tagScale;

  const subText = "Blog \u2014 Matt Wilson";
  const subScale = 3;
  const subLineH = 7 * subScale; // 21px

  const countText = `${postCount} post${postCount !== 1 ? "s" : ""}`;
  const countScale = 2;
  const countLineH = 7 * countScale; // 14px

  const urlScale = 2;
  const urlLineH = 7 * urlScale; // 14px

  const afterTagGap = 32;
  const afterSubGap = 12;
  const separatorH = 2;
  const afterSeparatorGap = 14;

  const totalH =
    tagLineH +
    afterTagGap +
    subLineH +
    afterSubGap +
    countLineH +
    afterSubGap +
    separatorH +
    afterSeparatorGap +
    urlLineH;

  const usableH = H - 12;
  let y = Math.round((usableH - totalH) / 2) + 6;

  // Tag name
  const tagW = textWidth(tag, tagScale);
  const tagX = Math.round(W / 2 - tagW / 2);
  c.drawText(tag, tagX, y, tagScale, ...WHITE);
  y += tagLineH + afterTagGap;

  // "Blog — Matt Wilson"
  const subW = textWidth(subText, subScale);
  const subX = Math.round(W / 2 - subW / 2);
  c.drawText(subText, subX, y, subScale, ...MUTED);
  y += subLineH + afterSubGap;

  // Post count
  const countW = textWidth(countText, countScale);
  const countX = Math.round(W / 2 - countW / 2);
  c.drawText(countText, countX, y, countScale, ...MUTED);
  y += countLineH + afterSubGap;

  // Separator
  const sepHalfW = 60;
  c.rect(Math.round(W / 2 - sepHalfW), y, Math.round(W / 2 + sepHalfW), y + separatorH, ...ACCENT);
  y += separatorH + afterSeparatorGap;

  // URL
  const urlText = "mattwilson02.github.io";
  const urlW = textWidth(urlText, urlScale);
  const urlX = Math.round(W / 2 - urlW / 2);
  c.drawText(urlText, urlX, y, urlScale, ...MUTED);

  // Unused variable suppression
  void FONT;

  return c.toPNG();
}

// ─── Write files ─────────────────────────────────────────────────────────────

const publicDir = join(process.cwd(), "public");
const blogOgDir = join(publicDir, "og", "blog");
const tagOgDir = join(publicDir, "og", "blog", "tag");

mkdirSync(blogOgDir, { recursive: true });
mkdirSync(tagOgDir, { recursive: true });

// Per-post OG images
for (const post of blogPosts) {
  const outPath = join(blogOgDir, `${post.slug}.png`);
  writeFileSync(outPath, generatePostOGImage(post.title));
  console.log(`✓ public/og/blog/${post.slug}.png`);
}

// Per-tag OG images
const allTags = Array.from(new Set(blogPosts.flatMap((p) => p.tags)));
for (const tag of allTags) {
  const postCount = blogPosts.filter((p) => p.tags.includes(tag)).length;
  const filename = `${encodeURIComponent(tag)}.png`;
  const outPath = join(tagOgDir, filename);
  writeFileSync(outPath, generateTagOGImage(tag, postCount));
  console.log(`✓ public/og/blog/tag/${filename}`);
}
