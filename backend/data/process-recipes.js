// process-recipes.js
import fs from "fs";
import path from "path";

// ------------------------------------------------------------
// Extract nutrition from summary HTML
// ------------------------------------------------------------
function extractNutrition(summaryHtml) {
  if (!summaryHtml) {
    return {
      calories: "",
      protein: "",
      fat: "",
      pricePerServing: "",
      percentProtein: "",
      percentFat: "",
      percentCarbs: "",
      vitaminPercent: ""
    };
  }

  const text = summaryHtml.replace(/<[^>]+>/g, " ");

  // Basic values
  const calories = text.match(/(\d+)\s*calories/i)?.[1] || "";
  const protein = text.match(/(\d+)\s*g\s*protein/i)?.[1] || "";
  const fat = text.match(/(\d+)\s*g\s*fat/i)?.[1] || "";
  const price = text.match(/\$([\d.]+)\s*per\s*serving/i)?.[1] || "";

  // Macro percentages
  const percentProtein = text.match(/(\d+)%\s*protein/i)?.[1] || "";
  const percentFat = text.match(/(\d+)%\s*fat/i)?.[1] || "";
  const percentCarbs = text.match(/(\d+)%\s*carb/i)?.[1] || "";

  // Vitamin %
  // Matches things like "covers 20% of your daily requirements"
  const vitaminPercent =
    text.match(/covers\s*(\d+)%\s*of\s*your\s*daily/i)?.[1] || "";

  return {
    calories,
    protein,
    fat,
    pricePerServing: price,
    percentProtein,
    percentFat,
    percentCarbs,
    vitaminPercent
  };
}

function extractSimilarRecipes(summaryHtml) {
   if (!summaryHtml) 
    return []; 
  const linkRegex = /<a\s+href="([^"]+)">([^<]+)<\/a>/gi; 
  const results = []; let match; 
  while ((match = linkRegex.exec(summaryHtml)) !== null) {
     results.push({ title: match[2], url: match[1] }); 
    } 
    return results; }

// ------------------------------------------------------------
// Process a single recipe
// ------------------------------------------------------------
function processRecipe(recipe) {
  const summaryHtml = recipe.summary || "";

  const Nutrition = extractNutrition(summaryHtml);
  const SimilarRecipes = extractSimilarRecipes(summaryHtml);

  return {
    ...recipe,
    Nutrition,
    SimilarRecipes
  };
}

// ------------------------------------------------------------
// MAIN PIPELINE
// ------------------------------------------------------------
function run() {
  const inputPath = path.join(process.cwd(), "recipes_cleaned.json");
  const outputPath = path.join(process.cwd(), "finished.json");

  console.log("📥 Loading recipes_cleaned.json...");
  const raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));

  console.log(`🔍 Processing ${raw.length} recipes...`);
  const processed = raw.map(r => processRecipe(r));

  console.log("💾 Writing finished.json...");
  fs.writeFileSync(outputPath, JSON.stringify(processed, null, 2), "utf8");

  console.log("🎉 Done! Output written to finished.json");
}

run();
