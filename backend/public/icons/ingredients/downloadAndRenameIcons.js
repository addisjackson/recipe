// public/icons/ingredients/downloadAndRenameIcons.js
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------
// ICONS TO DOWNLOAD (MDI names)
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
// MAP MDI ICONS → CANONICAL ICON NAMES
// ---------------------------------------------
const RENAME_MAP = {
  "food-steak": "meat.svg",
  "food-drumstick": "meat.svg",
  "food-turkey": "meat.svg",
  "cow": "meat.svg",
  "pig": "meat.svg",
  "chicken": "meat.svg",
  "fish": "meat.svg",
  "shrimp": "meat.svg",
  "sausage": "meat.svg",

  "fruit-citrus": "citrus.svg",

  "fruit-cherries": "fruit.svg",
  "fruit-grapes": "fruit.svg",
  "fruit-pineapple": "fruit.svg",
  "fruit-watermelon": "fruit.svg",
  "food-apple": "fruit.svg",

  "pepper-hot": "pepper.svg",
  "chili-hot": "pepper.svg",
  "chili-mild": "pepper.svg",

  "spice": "spice.svg",
  "salt": "salt.svg",
  "sugar": "sugar.svg",

  "bread-slice": "bread.svg",

  "oil": "oil.svg",
  "vinegar": "vinegar.svg",

  "bottle-wine": "bottle.svg",
  "bottle-soda": "bottle.svg",
  "jar": "bottle.svg",
  "jar-outline": "bottle.svg",
  "jar-label": "bottle.svg",
  "jar-label-outline": "bottle.svg",

  "onion": "onion.svg",
  "garlic": "garlic.svg",
  "ginger": "ginger.svg",
  "carrot": "carrot.svg",
  "corn": "corn.svg",
  "mushroom": "mushroom.svg",

  "egg": "egg.svg",
  "egg-fried": "egg.svg",

  "noodles": "noodles.svg",

  "leaf": "leaf.svg",
  "sprout": "sprout.svg",
  "seed": "seed.svg",
  "grain": "grain.svg",
  "wheat": "wheat.svg",
  "rice": "rice.svg"
};

// ---------------------------------------------
// DOWNLOAD + RENAME
// ---------------------------------------------
async function downloadAndRename(iconName) {
  const url = iconUrl(iconName);
  const tempPath = path.join(__dirname, `${iconName}.svg`);
  const finalName = RENAME_MAP[iconName] || `${iconName}.svg`;
  const finalPath = path.join(__dirname, finalName);

  // Skip if canonical file already exists
  if (fs.existsSync(finalPath)) {
    console.log(`⏩ Skipped (already exists): ${finalName}`);
    return;
  }

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.log(`❌ Failed to download ${iconName} (${res.status})`);
      return;
    }

    const svg = await res.text();
    fs.writeFileSync(tempPath, svg, "utf8");

    // Rename to canonical name
    fs.renameSync(tempPath, finalPath);

    console.log(`✔ Downloaded + Renamed: ${iconName} → ${finalName}`);
  } catch (err) {
    console.log(`❌ Error downloading ${iconName}:`, err.message);
  }
}

// ---------------------------------------------
// MAIN SCRIPT
// ---------------------------------------------
async function run() {
  console.log("📥 Downloading + Renaming Material Design Icons...");

  for (const icon of ICONS) {
    await downloadAndRename(icon);
  }

  console.log("🎉 Done! All icons cached and canonicalized.");
}

run();
