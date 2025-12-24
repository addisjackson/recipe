// app.js
import express from "express";
import cors from "cors";

import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
} from "./controllers/recipeController.js";

import {
  getAllFavorites,
  toggleFavorite,
  deleteFavorite
} from "./controllers/favoritesController.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ─────────────────────────────
// RECIPE ROUTES
// ─────────────────────────────
app.get("/recipes", getAllRecipes);
app.get("/recipes/:id", getRecipeById);
app.post("/recipes", createRecipe);
app.put("/recipes/:id", updateRecipe);
app.delete("/recipes/:id", deleteRecipe);

// ─────────────────────────────
// FAVORITE ROUTES
// ─────────────────────────────
app.get("/favorites", getAllFavorites);
app.post("/favorites/toggle", toggleFavorite);
app.delete("/favorites/:id", deleteFavorite);

// Export the configured app
export default app;
