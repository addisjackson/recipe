import fs from "fs";
import path from "path";
import express from "express";

const router = express.Router();

const favoritesPath = path.join(process.cwd(), "db", "favorites.json");
const recipesPath = path.join(process.cwd(), "data", "recipes_cleaned.json");

// Helpers
function load(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ─────────────────────────────────────────────
// FUNCTIONS
// ─────────────────────────────────────────────

// GET ALL FAVORITES
export function getFavorites(req, res) {
  const favorites = load(favoritesPath);
  res.json(favorites);
}

// GET ONE FAVORITE
export function getFavorite(req, res) {
  const id = Number(req.params.id);
  const favorites = load(favoritesPath);

  const favorite = favorites.find(f => f.id === id);
  if (!favorite) {
    return res.status(404).json({ error: "Favorite not found" });
  }

  res.json(favorite);
}

// CREATE FAVORITE (adds recipe to favorites.json)
export function createFavorite(req, res) {
  const { id } = req.body;

  const favorites = load(favoritesPath);
  const recipes = load(recipesPath);

  const recipe = recipes.find(r => r.id === id);
  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  const exists = favorites.some(f => f.id === id);
  if (exists) {
    return res.status(400).json({ error: "Already a favorite" });
  }

  const updated = [...favorites, recipe];
  save(favoritesPath, updated);

  res.json({ success: true, favorite: recipe });
}

// UPDATE FAVORITE (rarely used, but included for parity)
export function updateFavorite(req, res) {
  const id = Number(req.params.id);
  const updates = req.body;

  const favorites = load(favoritesPath);
  const index = favorites.findIndex(f => f.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Favorite not found" });
  }

  favorites[index] = { ...favorites[index], ...updates };
  save(favoritesPath, favorites);

  res.json({ success: true, favorite: favorites[index] });
}

// DELETE FAVORITE (only removes from favorites.json)
export function deleteFavorite(req, res) {
  const id = Number(req.params.id);
  const favorites = load(favoritesPath);

  const updated = favorites.filter(f => f.id !== id);
  save(favoritesPath, updated);

  res.json({ success: true, id });
}

// ─────────────────────────────────────────────
// TOGGLE FAVORITE CONTROLLER
// ─────────────────────────────────────────────
export function toggleFavorite(req, res) {
  const { id } = req.body;

  const recipes = load(recipesPath);
  const favorites = load(favoritesPath);

  const recipe = recipes.find(r => r.id === id);
  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  const exists = favorites.some(f => f.id === id);

  let updatedFavorites;

  if (exists) {
    // REMOVE from favorites
    updatedFavorites = favorites.filter(f => f.id !== id);
  } else {
    // ADD to favorites
    updatedFavorites = [...favorites, recipe];
  }

  save(favoritesPath, updatedFavorites);

  res.json({
    favorite: !exists,   // true = added, false = removed
    recipeId: id
  });
}
// DELETE FAVORITE FROM BOTH favorites.json AND recipes.json
export function deleteFavoriteEverywhere(req, res) {
  const id = Number(req.params.id);

  const favorites = load(favoritesPath);
  const recipes = load(recipesPath);

  const newFavorites = favorites.filter(r => r.id !== id);
  const newRecipes = recipes.filter(r => r.id !== id);

  save(favoritesPath, newFavorites);
  save(recipesPath, newRecipes);

  res.json({ success: true, id });
}

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

router.get("/", getFavorites);
router.get("/:id", getFavorite);
router.post("/", createFavorite);
router.put("/:id", updateFavorite);
router.delete("/:id", deleteFavorite);
router.post("/toggle", toggleFavorite);
router.delete("/delete/:id", deleteFavoriteEverywhere);

// ─────────────────────────────────────────────
// EXPORT ROUTER
// ─────────────────────────────────────────────
export default router;
