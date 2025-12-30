import express from "express";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import recipes from "../data/final2.json" with { type: "json" };

const router = express.Router();
const IMAGE_DIR = "../public/assets/images";

async function download(url, filePath) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");

    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return true;
  } catch {
    return false;
  }
}

router.get("/refresh-cache", async (req, res) => {
  const results = [];

  for (const recipe of recipes) {
    if (!recipe.imageOriginal) continue;

    const fileName = recipe.imageOriginal.split("/").pop();
    const localPath = path.join(IMAGE_DIR, fileName);

    let needsRefresh = false;

    // Missing
    if (!fs.existsSync(localPath)) {
      needsRefresh = true;
    } else {
      // Corrupted
      try {
        fs.readFileSync(localPath);
      } catch {
        needsRefresh = true;
      }
    }

    if (needsRefresh) {
      const ok = await download(recipe.imageOriginal, localPath);
      results.push({
        title: recipe.title,
        file: fileName,
        refreshed: ok
      });
    }
  }

  res.json({
    refreshed: results.length,
    details: results
  });
});

export default router;
