import sharp from "sharp";
import { readFileSync } from "fs";

const svg = readFileSync("public/linkedin-cover.svg");
sharp(svg, { density: 144 })
  .resize(3168, 792)
  .png()
  .toFile("public/linkedin-cover.png")
  .then(() => console.log("linkedin-cover.png generated"))
  .catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });
