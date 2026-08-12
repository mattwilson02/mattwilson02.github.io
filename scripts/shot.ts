/**
 * Screenshot the local site at a given viewport.
 *
 * Exists because the browser extension refuses to resize below desktop width,
 * which left mobile unverifiable — and mobile is where most traffic from a
 * LinkedIn post lands.
 *
 * Usage:
 *   npx tsx scripts/shot.ts                    # iPhone width, home, full page
 *   npx tsx scripts/shot.ts /blog 1280         # a path and a width
 */
import puppeteer from "puppeteer";
import { existsSync } from "fs";

const SYSTEM_CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const path = process.argv[2] ?? "/";
const width = Number(process.argv[3] ?? 390);
const out = `/Users/matt/Downloads/shot-${width}w${path.replace(/\//g, "-")}.png`;

async function main() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    ...(existsSync(SYSTEM_CHROME) ? { executablePath: SYSTEM_CHROME } : {}),
  });
  const page = await browser.newPage();
  // Tall viewport instead of fullPage: capturing fullPage resizes the
  // viewport, which resets framer-motion's revealed elements and returns a
  // page of empty boxes. Everything is in view from the start this way.
  await page.setViewport({ width, height: 6000, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle0" });
  // Scroll the whole page first — the reveal animations are driven by an
  // intersection observer, so anything never scrolled past stays at opacity 0
  // and a full-page capture comes back blank.
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: out });
  await browser.close();
  console.log(out);
}

main();
