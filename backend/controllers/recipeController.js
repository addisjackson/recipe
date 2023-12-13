const  {
  searchRecipes,
  getRecipeSummary,
  addFavouriteRecipe,
  getFavouriteRecipes,
  removeFavouriteRecipe,
} = require("../queries/recipeQueries")

const searchAllRecipes = async (req, res) => {
  const { searchTerm, page } = req.query;
  try {
    const recipes = await searchRecipes(searchTerm, parseInt(page));
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getOneRecipeSummary = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const recipe = await getRecipeSummary(parseInt(recipeId));
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const addFavoriteRecipe = async (req, res) => {
  const { recipeId } = req.body;
  try {
    await addFavouriteRecipe(parseInt(recipeId));
    res.status(200).send("Recipe added to favorites");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFavoriteRecipes = async (req, res) => {
  try {
    const favoriteRecipes = await getFavouriteRecipes();
    res.status(200).json(favoriteRecipes);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeFavoriteRecipe = async (req, res) => {
  const { recipeId } = req.params;
  try {
    await removeFavouriteRecipe(parseInt(recipeId));
    res.status(200).send("Recipe removed from favorites");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  searchAllRecipes,
  getOneRecipeSummary,
  addFavoriteRecipe,
  getFavoriteRecipes,
  removeFavoriteRecipe,
};
