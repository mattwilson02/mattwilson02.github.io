import puppeteer from "puppeteer";
import { resolve } from "path";

const htmlPath = resolve(process.cwd(), "public/matt-wilson-resume.html");
const pdfPath = resolve(process.cwd(), "public/matt-wilson-resume.pdf");

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
    margin: { top: "40px", bottom: "40px", left: "48px", right: "48px" },
  });
  await browser.close();
  console.log("✓ public/matt-wilson-resume.pdf");
})();
