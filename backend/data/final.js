import fs from "fs";

// Load your original recipes JSON
const raw = fs.readFileSync("./recipes.json", "utf8");
const recipes = JSON.parse(raw);

// Transform each recipe
const cleaned = recipes.map(recipe => {
  return {
    healthScore: recipe.healthScore,
    aggregateLikes: recipe.aggregateLikes,

    // Extract only the "original" text from each ingredient
    ingredients: recipe.extendedIngredients?.map(i => i.original) || [],

    title: recipe.title,
    readyInMinutes: recipe.readyInMinutes,
    servings: recipe.servings,

    image: recipe.image,
    summary: recipe.summary,

    cuisines: recipe.cuisines || [],
    dishTypes: recipe.dishTypes || [],
    diets: recipe.diets || [],

    // Extract steps + step numbers
    steps:
      recipe.analyzedInstructions?.flatMap(instr =>
        instr.steps.map(s => ({
          number: s.number,
          step: s.step
        }))
      ) || [],

    spoonacularSource: recipe.spoonacularSourceUrl
  };
});

// Save the cleaned JSON
fs.writeFileSync("./recipes_cleaned.json", JSON.stringify(cleaned, null, 2));

console.log("Extraction complete → recipes_cleaned.json created");
