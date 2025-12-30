export function normalizeRecipe(recipe) {
  // -----------------------------
  // Helpers
  // -----------------------------
  const stripHtml = (html = "") =>
    html.replace(/<[^>]*>/g, "").trim();

  const getNutrient = (name) => {
    const n = recipe?.nutrition?.nutrients?.find(
      (x) => x.name.toLowerCase() === name.toLowerCase()
    );
    return n ? n.amount : 0;
  };

  const getPercent = (name) => {
    const n = recipe?.nutrition?.nutrients?.find(
      (x) => x.name.toLowerCase() === name.toLowerCase()
    );
    return n ? n.percentOfDailyNeeds : 0;
  };

  const generateInstructions = () => {
    // Generic fallback instruction generator
    const ingredients = recipe.extendedIngredients || [];
    const hasBlender =
      ingredients.some((i) =>
        ["milk", "yogurt", "ice", "fruit"].some((k) =>
          i.name.toLowerCase().includes(k)
        )
      );

    if (hasBlender) {
      return [
        {
          name: "Preparation",
          steps: [
            { number: 1, step: "Prepare and chop all ingredients as needed." },
            { number: 2, step: "Add all ingredients to a blender." },
            { number: 3, step: "Blend until smooth and creamy." },
            { number: 4, step: "Taste and adjust sweetness or thickness." },
            { number: 5, step: "Serve immediately." }
          ]
        }
      ];
    }

    // Generic cooking fallback
    return [
      {
        name: "Preparation",
        steps: [
          { number: 1, step: "Prepare all ingredients." },
          { number: 2, step: "Combine ingredients in a bowl or pan." },
          { number: 3, step: "Cook or mix until desired consistency." },
          { number: 4, step: "Season to taste." },
          { number: 5, step: "Serve warm or chilled." }
        ]
      }
    ];
  };

  const generateCuisine = () => {
    const title = recipe.title?.toLowerCase() || "";
    const ingredients = recipe.extendedIngredients || [];

    if (title.includes("taco") || ingredients.some(i => i.name.includes("cilantro")))
      return ["Mexican"];

    if (title.includes("pasta") || ingredients.some(i => i.name.includes("parmesan")))
      return ["Italian"];

    if (title.includes("smoothie") || title.includes("shake"))
      return ["American"];

    return ["American"];
  };

  const generateDishType = () => {
    const title = recipe.title?.toLowerCase() || "";

    if (title.includes("smoothie") || title.includes("shake"))
      return ["drink", "smoothie", "beverage"];

    if (title.includes("salad"))
      return ["salad"];

    if (title.includes("soup"))
      return ["soup"];

    return ["main course"];
  };

  const generateDiets = () => {
    const diets = [];
    if (recipe.vegetarian) diets.push("vegetarian");
    if (recipe.vegan) diets.push("vegan");
    if (recipe.glutenFree) diets.push("gluten free");
    if (recipe.dairyFree) diets.push("dairy free");
    return diets;
  };

  const generateSimilarRecipes = () => {
    const base = recipe.title?.replace(/[^a-zA-Z ]/g, "") || "Recipe";
    return [
      {
        title: `${base} Variation 1`,
        id: recipe.id + 1000001,
        url: `https://spoonacular.com/recipes/${recipe.id + 1000001}`
      },
      {
        title: `${base} Variation 2`,
        id: recipe.id + 1000002,
        url: `https://spoonacular.com/recipes/${recipe.id + 1000002}`
      }
    ];
  };

  // -----------------------------
  // Normalized Output
  // -----------------------------
  return {
    title: recipe.title || "Untitled Recipe",
    image: recipe.image || "",
    readyInMinutes: recipe.readyInMinutes || 0,
    servings: recipe.servings || 1,
    sourceUrl: recipe.sourceUrl || "",
    weightWatcherSmartPoints: recipe.weightWatcherSmartPoints || 0,
    aggregateLikes: recipe.aggregateLikes || 0,
    healthScore: recipe.healthScore || 0,

    summary: recipe.summary
      ? stripHtml(recipe.summary)
      : `A simple recipe made with ${recipe.extendedIngredients?.length || 0} ingredients.`,

    nutrition: {
      servings: recipe.servings || 1,
      calories: getNutrient("Calories"),
      protein: getNutrient("Protein"),
      fat: getNutrient("Fat"),
      pricePerServing: recipe.pricePerServing
        ? `$${(recipe.pricePerServing / 100).toFixed(2)} per serving`
        : "$0.00 per serving",
      percentDailyVitamin: `${getPercent("Calories").toFixed(2)}% of daily calories`,
      percentProtein: getPercent("Protein"),
      percentFat: getPercent("Fat"),
      percentCarbs: getPercent("Carbohydrates")
    },

    spoonacular: {
      similarRecipes:
        recipe.spoonacularSourceUrl ||
        recipe.similarRecipes?.length
          ? recipe.similarRecipes
          : generateSimilarRecipes()
    },

    cuisine: recipe.cuisines?.length ? recipe.cuisines : generateCuisine(),
    dishType: recipe.dishTypes?.length ? recipe.dishTypes : generateDishType(),
    diets: recipe.diets?.length ? recipe.diets : generateDiets(),

    analyzedInstructions:
      recipe.analyzedInstructions?.length &&
      recipe.analyzedInstructions[0]?.steps?.length
        ? recipe.analyzedInstructions
        : generateInstructions(),

    spoonacularSource: recipe.spoonacularSourceUrl || ""
  };
}
