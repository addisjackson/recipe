import fs from "fs";
import path from "path";

const FAVORITES_FILE = "./db/favorites.json";
const RECIPES_FILE = "./data/recipes_cleaned.json";

function readJSON(file) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "[]");
  const raw = fs.readFileSync(file, "utf8").trim();
  return raw ? JSON.parse(raw) : [];
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function readRecipes() {
  const data = readJSON(RECIPES_FILE);
  return data.map((recipe, index) => ({ id: index + 1, ...recipe }));
}

export const getAllFavorites = (req, res) => {
  res.json(readJSON(FAVORITES_FILE));
};

export const toggleFavorite = (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ error: "Recipe id is required" });

  const recipes = readRecipes();
  const favorites = readJSON(FAVORITES_FILE);

  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return res.status(404).json({ error: "Recipe not found" });

  const exists = favorites.find(f => f.id === id);

  if (exists) {
    const updated = favorites.filter(f => f.id !== id);
    writeJSON(FAVORITES_FILE, updated);
    return res.json({ status: "removed", id });
  }

  favorites.push(recipe);
  writeJSON(FAVORITES_FILE, favorites);
  res.json({ status: "added", recipe });
};

export const deleteFavorite = (req, res) => {
  const id = Number(req.params.id);
  const favorites = readJSON(FAVORITES_FILE);
  const filtered = favorites.filter(f => f.id !== id);

  if (filtered.length === favorites.length)
    return res.status(404).json({ error: "Favorite not found" });

  writeJSON(FAVORITES_FILE, filtered);
  res.json({ success: true });
};
