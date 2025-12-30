// fetch-and-normalize.js
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

// ------------------------------------------------------------
// INGREDIENT → ICON MAP
// ------------------------------------------------------------
const INGREDIENT_ICON_MAP = {
  "apple cider vinegar": "vinegar.svg",
  "vinegar": "vinegar.svg",

  "pork shoulder": "meat.svg",
  "pork": "meat.svg",

  "brioche rolls": "bread.svg",
  "brioche bun": "bread.svg",
  "bread": "bread.svg",

  "brown sugar": "sugar.svg",
  "molasses": "sugar.svg",
  "sugar": "sugar.svg",

  "cumin seeds": "spice.svg",
  "fennel seeds": "spice.svg",
  "paprika": "spice.svg",
  "kosher salt": "salt.svg",
  "salt": "salt.svg",
  "spice": "spice.svg",

  "ginger": "ginger.svg",
  "onion": "onion.svg",
  "serrano pepper": "pepper.svg",
  "pepper": "pepper.svg",

  "lime juice": "citrus.svg",
  "lime": "citrus.svg",
  "lemon": "citrus.svg",

  "mango puree": "fruit.svg",
  "mango": "fruit.svg",
  "fruit": "fruit.svg",

  "vegetable oil": "oil.svg",
  "olive oil": "oil.svg",
  "oil": "oil.svg",

  "worcestershire sauce": "bottle.svg",
  "soy sauce": "bottle.svg",
  "sauce": "bottle.svg",

  // fallback
  "_default": "ingredient.svg"
};

// ------------------------------------------------------------
// Normalize ingredient icon
// ------------------------------------------------------------
function normalizeIngredientIcon(name) {
  if (!name) return "/icons/ingredients/ingredient.svg";

  const key = name.toLowerCase().trim();
  const icon = INGREDIENT_ICON_MAP[key] || INGREDIENT_ICON_MAP._default;

  return `/icons/ingredients/${icon}`;
}

// ------------------------------------------------------------
// Extract nutrition from summary
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
// Extract similar recipes from summary
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
// Extract & normalize ingredients (using icons)
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
      icon: normalizeIngredientIcon(i.nameClean || i.name)
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
// Fetch Recipe IDs
// ------------------------------------------------------------
async function fetchRecipeIds(apiKey, number = 100) {
  const url = `https://api.spoonacular.com/recipes/random?tags=american%20main%20course&number=${number}&apiKey=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.recipes?.map(r => r.id) || [];
}

// ------------------------------------------------------------
// Fetch Full Recipe
// ------------------------------------------------------------
async function fetchRecipeById(apiKey, id) {
  const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`;
  const res = await fetch(url);
  return await res.json();
}

// ------------------------------------------------------------
// Main Pipeline
// ------------------------------------------------------------
async function run() {
  const apiKey = process.env.SPOONACULAR_KEY;

  console.log("📡 Fetching recipe IDs...");
  const ids = await fetchRecipeIds(apiKey, 100);

  console.log(`📦 Found ${ids.length} recipes. Fetching full data...`);

  const rawRecipes = [];
  for (const id of ids) {
    try {
      const recipe = await fetchRecipeById(apiKey, id);
      rawRecipes.push(recipe);
      console.log(`✔ Fetched recipe ${id}`);
    } catch {
      console.log(`❌ Failed to fetch recipe ${id}`);
    }
  }

  console.log("🔧 Normalizing recipes...");
  const normalized = rawRecipes.map(r => normalizeRecipe(r));

  const outputPath = path.join(process.cwd(), "db", "recipes.cleaned.json");
  const dbDir = path.join(process.cwd(), "db");

  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);

  fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2), "utf8");

  console.log(`🎉 Done! Normalized recipes written to ${outputPath}`);
}

run();
