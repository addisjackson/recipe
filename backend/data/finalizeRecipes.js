import fs from "fs";

const INPUT = "./finished.json";
const OUTPUT = "./final2.json";

// Generate a guaranteed-unique local ID
function generateUniqueId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function fixDuplicateIds() {
  if (!fs.existsSync(INPUT)) {
    console.error("finished.json not found");
    return;
  }

  const raw = fs.readFileSync(INPUT, "utf8");
  let recipes = JSON.parse(raw);

  const seen = new Set();
  const updated = [];

  for (const recipe of recipes) {
    let id = recipe.id;

    // If ID already exists, generate a new one
    if (seen.has(id)) {
      const newId = generateUniqueId();
      console.log(`Duplicate ID found: ${id} → changed to ${newId}`);
      id = newId;
    }

    seen.add(id);
    updated.push({ ...recipe, id });
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(updated, null, 2));
  console.log(`Finished! Cleaned data written to ${OUTPUT}`);
}

fixDuplicateIds();
