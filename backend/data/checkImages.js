import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import recipes from "../data/final2.json" assert { type: "json" };

const IMAGE_DIR = "../public/assets/images";

async function redownload(url, filePath) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");

    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));
    console.log("Re-downloaded:", filePath);
  } catch (err) {
    console.log("Failed to re-download:", url);
  }
}

async function run() {
  const missing = [];
  const corrupted = [];

  for (const recipe of recipes) {
    if (!recipe.image) continue;

    const fileName = recipe.image.split("/").pop();
    const localPath = path.join(IMAGE_DIR, fileName);

    // Missing file
    if (!fs.existsSync(localPath)) {
      missing.push({ recipe: recipe.title, file: fileName });
      continue;
    }

    // Corrupted file (cannot read)
    try {
      fs.readFileSync(localPath);
    } catch {
      corrupted.push({ recipe: recipe.title, file: fileName });
    }
  }

  console.log("\n=== Missing Images ===");
  console.log(missing);

  console.log("\n=== Corrupted Images ===");
  console.log(corrupted);

  // Optional: auto-fix missing/corrupted images
  for (const item of [...missing, ...corrupted]) {
    const original = recipes.find(r => r.title === item.recipe)?.imageOriginal;
    if (!original) continue;

    const fileName = original.split("/").pop();
    const localPath = path.join(IMAGE_DIR, fileName);

    await redownload(original, localPath);
  }

  console.log("\nImage check complete.");
}

run();
