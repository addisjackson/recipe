// public/icons/ingredients/downloadIcons.js
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

// Resolve current directory (because ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------
// ICONS YOU WANT TO DOWNLOAD
// ---------------------------------------------
const ICONS = [
  "food-apple",
  "food-steak",
  "food-drumstick",
  "food-croissant",
  "food-variant",
  "food-turkey",
  "food-fork-drink",
  "food-off",

  "bread-slice",

  "bottle-wine",
  "bottle-soda",
  "vinegar",
  "oil",

  "fruit-cherries",
  "fruit-grapes",
  "fruit-pineapple",
  "fruit-watermelon",
  "fruit-citrus",

  "pepper-hot",
  "spice",
  "salt",
  "sugar",

  "sausage",
  "cow",
  "pig",
  "chicken",
  "fish",
  "shrimp",

  "noodles",
  "egg",
  "egg-fried",
  "carrot",
  "corn",
  "mushroom",
  "onion",
  "garlic",
  "ginger",
  "chili-mild",
  "chili-hot",

  "leaf",
  "sprout",
  "seed",
  "grain",
  "wheat",
  "rice",

  "jar",
  "jar-outline",
  "jar-label",
  "jar-label-outline"
];

// ---------------------------------------------
// MDI CDN URL FORMAT
// ---------------------------------------------
function iconUrl(name) {
  return `https://cdn.materialdesignicons.com/7.4.47/${name}.svg`;
}

// ---------------------------------------------
// DOWNLOAD FUNCTION
// ---------------------------------------------
async function downloadIcon(name) {
  const url = iconUrl(name);
  const filePath = path.join(__dirname, `${name}.svg`);

  if (fs.existsSync(filePath)) {
    console.log(`⏩ Skipped (already exists): ${name}`);
    return;
  }

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.log(`❌ Failed: ${name} (${res.status})`);
      return;
    }

    const svg = await res.text();
    fs.writeFileSync(filePath, svg, "utf8");

    console.log(`✔ Downloaded: ${name}`);
  } catch (err) {
    console.log(`❌ Error downloading ${name}:`, err.message);
  }
}

// ---------------------------------------------
// MAIN SCRIPT
// ---------------------------------------------
async function run() {
  console.log("📥 Downloading Material Design Icons...");

  for (const icon of ICONS) {
    await downloadIcon(icon);
  }

  console.log("🎉 Done! All icons cached locally in this folder.");
}

run();
