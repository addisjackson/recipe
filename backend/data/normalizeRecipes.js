// normalize-from-fetched.js
import fs from "fs";
import path from "path";

// ------------------------------------------------------------
// Helpers: Summary → Nutrition
// ------------------------------------------------------------
function extractNutritionFromSummary(summaryHtml) {
  if (!summaryHtml) return {};

  const text = summaryHtml.replace(/<[^>]+>/g, " ");

  return {
    calories: text.match(/(\d+)\s*calories/i)?.[1] || null,
    protein: text.match(/(\d+)\s*g\s*protein/i)?.[1] || null,
    fat: text.match(/(\d+)\s*g\s*fat/i)?.[1] || null,
    pricePerServing: text.match(/\$([\d.]+)\s*per\s*serving/i)?.[1] || null
  };
}

// ------------------------------------------------------------
// Helpers: Summary → Similar Recipes
// ------------------------------------------------------------
function extractSimilarRecipesFromSummary(summaryHtml) {
  if (!summaryHtml) return [];

  const startIndex = summaryHtml.indexOf("Similar recipes");
  if (startIndex === -1) return [];

  const snippet = summaryHtml.slice(startIndex);
  const linkRegex = /<a href="([^"]+)">([^<]+)<\/a>/g;

  const results = [];
  let match;

  while ((match = linkRegex.exec(snippet)) !== null) {
    results.push({ url: match[1], title: match[2] });
  }

  return results;
}

// ------------------------------------------------------------
// Ingredient Image Normalization
// ------------------------------------------------------------
function normalizeIngredientImage(image) {
  if (!image || typeof image !== "string") {
    return "/images/ingredients/_missing.jpg";
  }

  const clean = image.split("?")[0];
  const file = clean.split("/").pop().toLowerCase();
  const normalized = file.replace(/\.(png|jpeg|webp)$/i, ".jpg");

  return `/images/ingredients/${normalized}`;
}

// ------------------------------------------------------------
// Extract Ingredients
// ------------------------------------------------------------
function extractIngredients(raw) {
  if (Array.isArray(raw.extendedIngredients) && raw.extendedIngredients.length > 0) {
    return raw.extendedIngredients.map(i => ({
      id: i.id || null,
      name: i.nameClean || i.name || "",
      original: i.original || "",
      amount: i.amount || 0,
      unit: i.unit || "",
      meta: i.meta || [],
      image: normalizeIngredientImage(i.image)
    }));
  }

  return [];
}

// ------------------------------------------------------------
// Normalize Recipe
// ------------------------------------------------------------
function normalizeRecipe(raw) {
  if (!raw) return null;

  const title = raw.title || "Untitled Recipe";
  const summaryHtml = raw.summary || "";
  const summary = summaryHtml.replace(/<[^>]+>/g, "") || `${title} recipe.`;

  const fallbackNutrition = extractNutritionFromSummary(summaryHtml);

  const calories =
    raw.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount ||
    fallbackNutrition.calories ||
    0;

  const protein =
    raw.nutrition?.nutrients?.find(n => n.name === "Protein")?.amount ||
    fallbackNutrition.protein ||
    0;

  const fat =
    raw.nutrition?.nutrients?.find(n => n.name === "Fat")?.amount ||
    fallbackNutrition.fat ||
    0;

  const pricePerServing =
    raw.pricePerServing
      ? `$${(raw.pricePerServing / 100).toFixed(2)}`
      : fallbackNutrition.pricePerServing
      ? `$${fallbackNutrition.pricePerServing}`
      : "$0.00";

  const similarRecipes =
    raw.similarRecipes?.length > 0
      ? raw.similarRecipes
      : extractSimilarRecipesFromSummary(summaryHtml);

  return {
    id: raw.id,
    title,
    image: raw.image || "",
    readyInMinutes: raw.readyInMinutes || 0,
    servings: raw.servings || 1,
    sourceUrl: raw.sourceUrl || "",
    aggregateLikes: raw.aggregateLikes || 0,
    healthScore: raw.healthScore || 0,
    weightWatcherSmartPoints: raw.weightWatcherSmartPoints || 0,
    summary,

    nutrition: { calories, protein, fat, pricePerServing },
    similarRecipes,
    ingredients: extractIngredients(raw),

    cuisine: raw.cuisines?.length ? raw.cuisines : ["American"],
    dishType: raw.dishTypes?.length ? raw.dishTypes : ["main course"],
    diets: raw.diets || [],

    analyzedInstructions:
      raw.analyzedInstructions?.length > 0
        ? raw.analyzedInstructions
        : [
            {
              name: "Preparation",
              steps: [
                { number: 1, step: "Prepare all ingredients." },
                { number: 2, step: "Combine ingredients and cook as desired." }
              ]
            }
          ],

    spoonacularSource: raw.spoonacularSourceUrl || ""
  };
}

// ------------------------------------------------------------
// MAIN PIPELINE — NO FETCHING
// ------------------------------------------------------------
async function run() {
  const inputPath = path.join(process.cwd(), "db", "fetchedRecipes.json");
  const outputPath = path.join(process.cwd(), "db", "recipes.cleaned.json");

  console.log("📥 Reading fetchedRecipes.json...");

  if (!fs.existsSync(inputPath)) {
    console.error("❌ ERROR: fetchedRecipes.json not found.");
    return;
  }

  const rawData = fs.readFileSync(inputPath, "utf8");
  const rawRecipes = JSON.parse(rawData);

  console.log(`📦 Loaded ${rawRecipes.length} raw recipes.`);

  console.log("🔧 Normalizing recipes...");
  const normalized = rawRecipes.map(r => normalizeRecipe(r));

  fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2), "utf8");

  console.log(`🎉 Done! Normalized recipes written to ${outputPath}`);
}

run();
