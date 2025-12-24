import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const favoritesPath = path.join(__dirname, "../data/favorites.json");
const recipesPath = path.join(__dirname, "../db/api.json");

const read = (p) => {
  if (!fs.existsSync(p)) fs.writeFileSync(p, "[]");
  return JSON.parse(fs.readFileSync(p, "utf-8"));
};

const write = (p, data) =>
  fs.writeFileSync(p, JSON.stringify(data, null, 2));

export const getFavorites = () => read(favoritesPath);

export const addFavorite = (id) => {
  const recipes = read(recipesPath);
  const favorites = read(favoritesPath);

  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return null;

  if (favorites.some(f => f.id === id)) return "exists";

  favorites.push(recipe);
  write(favoritesPath, favorites);
  return recipe;
};

export const removeFavorite = (id) => {
  write(
    favoritesPath,
    read(favoritesPath).filter(f => f.id !== id)
  );
};

