// normalize-all.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const inputPath = path.join(__dirname, "rawRecipes.json");
const outputPath = path.join(__dirname, "normalizedRecipes.json");

// ------------------------------------------------------------
// Load JSON helper
// ------------------------------------------------------------
function loadJSON(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

// Save JSON helper
function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ------------------------------------------------------------
// FALLBACK EXTRACTORS (from summary HTML)
// ------------------------------------------------------------

// Extract similar recipes from summary
function extractSimilarRecipes(summaryHtml) {
  if (!summaryHtml) return [];

  const startIndex = summaryHtml.indexOf("Similar recipes include");
  if (startIndex === -1) return [];

  const snippet = summaryHtml.slice(startIndex);
  const linkRegex = /<a href="([^"]+)">([^<]+)<\/a>/g;

  const results = [];
  let match;

  while ((match = linkRegex.exec(snippet)) !== null) {
    results.push({
      url: match[1],
      title: match[2]
    });
  }

  return results;
}

// Extract nutrition from summary
function extractNutritionFromSummary(summaryHtml) {
  if (!summaryHtml) return {};

  const text = summaryHtml.replace(/<[^>]+>/g, " ");

  const calories = text.match(/(\d+)\s*calories/i)?.[1];
  const protein = text.match(/(\d+)\s*g\s*protein/i)?.[1];
  const fat = text.match(/(\d+)\s*g\s*fat/i)?.[1];
  const price = text.match(/\$([\d.]+)/)?.[1];

  return {
    calories: calories || null,
    protein: protein || null,
    fat: fat || null,
    pricePerServing: price || null
  };
}

// Extract ingredients from summary
function extractIngredientsFromSummary(summaryHtml) {
  if (!summaryHtml) return [];

  const text = summaryHtml.replace(/<[^>]+>/g, " ");
  const match = text.match(/ingredients? you will need[:\s]+([^\.]+)/i);
  if (!match) return [];

  return match[1]
    .split(/,|\band\b/)
    .map(i => i.trim())
    .filter(Boolean);
}

// Extract instructions from summary
function extractInstructionsFromSummary(summaryHtml) {
  if (!summaryHtml) return [];

  const text = summaryHtml.replace(/<[^>]+>/g, " ");
  const match = text.match(/steps?[:\s]+(.+)/i);
  if (!match) return [];

  return match[1]
    .split(/\.\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

// ------------------------------------------------------------
// Extract instructions (HTML or analyzedInstructions)
// ------------------------------------------------------------
function extractInstructions(raw) {
  if (typeof raw.instructions === "string" && raw.instructions.includes("<li>")) {
    return raw.instructions
      .replace(/<\/?ol>/g, "")
      .split("</li>")
      .map(step => step.replace(/<li>/g, "").trim())
      .filter(Boolean);
  }

  if (Array.isArray(raw.analyzedInstructions) && raw.analyzedInstructions.length > 0) {
    return raw.analyzedInstructions
      .flatMap(block => block.steps || [])
      .map(s => s.step.trim());
  }

  return null; // allow fallback
}

// ------------------------------------------------------------
// Extract nutrient by name (JSON)
// ------------------------------------------------------------
function extractNutrient(raw, nutrientName) {
  return raw.nutrition?.nutrients?.find(n => n.name === nutrientName)?.amount || null;
}

// ------------------------------------------------------------
// Normalize a single recipe
// ------------------------------------------------------------
function normalizeRecipe(raw) {
  if (!raw) return null;

  const summaryHtml = raw.summary || "";

  // Summary (clean first sentence)
  const summary = summaryHtml
    ? summaryHtml.replace(/<[^>]+>/g, "").split(".")[0] + "."
    : `${raw.title} is a recipe made with common ingredients and simple preparation steps.`;

  // Ingredients (JSON or fallback)
  let ingredients = Array.isArray(raw.extendedIngredients)
    ? raw.extendedIngredients.map(i => ({
        name: i.nameClean || i.name || "",
        amount: i.amount || 0,
        unit: i.unit || ""
      }))
    : [];

  if (ingredients.length === 0) {
    ingredients = extractIngredientsFromSummary(summaryHtml);
  }

  // Instructions (JSON or fallback)
  let instructions = extractInstructions(raw);
  if (!instructions || instructions.length === 0) {
    instructions = extractInstructionsFromSummary(summaryHtml);
  }

  // Nutrition (JSON or fallback)
  const nutritionFallback = extractNutritionFromSummary(summaryHtml);

  const calories = extractNutrient(raw, "Calories") ?? nutritionFallback.calories;
  const protein = extractNutrient(raw, "Protein") ?? nutritionFallback.protein;
  const fat = extractNutrient(raw, "Fat") ?? nutritionFallback.fat;
  const pricePerServing = raw.pricePerServing ?? nutritionFallback.pricePerServing;

  // Similar recipes (from summary)
  const similarRecipes = extractSimilarRecipes(summaryHtml);

  return {
    id: raw.id,
    title: raw.title || "Untitled Recipe",
    image: raw.image || "",
    readyInMinutes: raw.readyInMinutes || 0,
    servings: raw.servings || 1,
    summary,
    cuisines: raw.cuisines?.length ? raw.cuisines : [],
    dishTypes: raw.dishTypes?.length ? raw.dishTypes : [],
    diets: raw.diets?.length ? raw.diets : [],
    ingredients,
    instructions,
    nutrition: {
      calories,
      protein,
      fat,
      pricePerServing
    },
    similarRecipes
  };
}

// ------------------------------------------------------------
// Normalize an array of recipes
// ------------------------------------------------------------
function normalizeRecipes(recipes = []) {
  if (!Array.isArray(recipes)) return [];
  return recipes
    .filter(r => r && typeof r === "object")
    .map(r => normalizeRecipe(r));
}

// ------------------------------------------------------------
// MAIN EXECUTION
// ------------------------------------------------------------
function run() {
  console.log("Loading raw recipes...");
  const rawRecipes = loadJSON(inputPath);

  console.log(`Normalizing ${rawRecipes.length} recipes...`);
  const normalized = normalizeRecipes(rawRecipes);

  console.log("Saving normalized recipes...");
  saveJSON(outputPath, normalized);

  console.log("Done! → normalizedRecipes.json");
}

run();
