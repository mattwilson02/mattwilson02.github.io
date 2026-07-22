import puppeteer from "puppeteer";
import { resolve } from "path";

// Optional arg selects a variant, e.g. `tsx scripts/generate-resume-pdf.ts phantom`
// → public/matt-wilson-resume-phantom.{html,pdf}. No arg builds the base resume.
const variant = process.argv[2];
const slug = variant ? `matt-wilson-resume-${variant}` : "matt-wilson-resume";

const htmlPath = resolve(process.cwd(), `public/${slug}.html`);
const pdfPath = resolve(process.cwd(), `public/${slug}.pdf`);

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    displayHeaderFooter: false,
    printBackground: true,
    margin: { top: "28px", bottom: "28px", left: "40px", right: "40px" },
  });
  await browser.close();
  console.log(`✓ public/${slug}.pdf`);
})();
