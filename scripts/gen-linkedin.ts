import sharp from "sharp";
import { readFileSync } from "fs";

const svg = readFileSync("public/linkedin-cover.svg");
sharp(svg)
  .png()
  .toFile("public/linkedin-cover.png")
  .then(() => console.log("linkedin-cover.png generated"))
  .catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });
