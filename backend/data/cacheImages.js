import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import recipes from "../data/finished.json" assert { type: "json" };

const OUTPUT_DIR = "../public/assets/images/";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function downloadImage(url, filePath) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch image");

    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));
    console.log("Saved:", filePath);
  } catch (err) {
    console.log("Failed:", url);
  }
}

async function run() {
  for (const recipe of recipes) {
    if (!recipe.image) continue;

    const fileName = recipe.image.split("/").pop();
    const localPath = path.join(OUTPUT_DIR, fileName);

    // Skip if already cached
    if (fs.existsSync(localPath)) {
      console.log("Cached:", fileName);
      continue;
    }

    await downloadImage(recipe.image, localPath);
  }

  console.log("Image caching complete.");
}

run();
