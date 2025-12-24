const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

require("dotenv").config();
const RecipeAPI = require("./recipe-api");

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL configuration
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Endpoint for searching recipes
app.get("/api/recipes/search", async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const page = parseInt(req.query.page);
  
  try {
    const results = await RecipeAPI.searchRecipes(pool, searchTerm, page);
    return res.json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Oops, something went wrong" });
  }
});

// Endpoint for getting recipe summary by ID
app.get("/api/recipes/:recipeId/summary", async (req, res) => {
  const recipeId = req.params.recipeId;
  
  try {
    const results = await RecipeAPI.getRecipeSummary(pool, recipeId);
    return res.json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Oops, something went wrong" });
  }
});

// Endpoint for adding a recipe to favorites
app.post("/api/recipes/favourite", async (req, res) => {
  const recipeId = req.body.recipeId;

  try {
    await RecipeAPI.addFavouriteRecipe(pool, recipeId);
    return res.status(201).json({ message: "Recipe added to favorites" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Oops, something went wrong" });
  }
});

// Endpoint for getting favorite recipes
app.get("/api/recipes/favourite", async (req, res) => {
  try {
    const favourites = await RecipeAPI.getFavouriteRecipes(pool);
    return res.json(favourites);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Oops, something went wrong" });
  }
});

// Endpoint for removing a recipe from favorites
app.delete("/api/recipes/favourite", async (req, res) => {
  const recipeId = req.body.recipeId;

  try {
    await RecipeAPI.removeFavouriteRecipe(pool, recipeId);
    return res.status(204).json({ message: "Recipe removed from favorites" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Oops, something went wrong" });
  }
});

app.listen(5000, () => {
  console.log("Server running on localhost:5000");
});
