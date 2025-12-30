import fs from "fs";
import fetch from "node-fetch";

const RECIPES_FILE = "./data/final2.json";

/* ---------------------------------------------
   HELPERS
---------------------------------------------- */
function readRecipes() {
  if (!fs.existsSync(RECIPES_FILE)) fs.writeFileSync(RECIPES_FILE, "[]");
  const raw = fs.readFileSync(RECIPES_FILE, "utf8").trim();
  const data = raw ? JSON.parse(raw) : [];
  return data.map((recipe, index) => ({ id: index + 1, ...recipe }));
}

function writeRecipes(recipes) {
  fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 2));
}

/* ---------------------------------------------
   CRUD
---------------------------------------------- */
export const getAllRecipes = (req, res) => {
  res.json(readRecipes());
};

export const getRecipeById = (req, res) => {
  const id = Number(req.params.id);
  const recipes = readRecipes();
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return res.status(404).json({ error: "Recipe not found" });
  res.json(recipe);
};

export const createRecipe = (req, res) => {
  const recipes = readRecipes();
const newRecipe = { id: `local-${Date.now()}-${Math.random()}`, ...req.body };  recipes.push(newRecipe);
  writeRecipes(recipes);
  res.status(201).json(newRecipe);
};

export const updateRecipe = (req, res) => {
  const id = Number(req.params.id);
  const recipes = readRecipes();
  const index = recipes.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ error: "Recipe not found" });

  recipes[index] = { id, ...req.body };
  writeRecipes(recipes);
  res.json(recipes[index]);
};

export const deleteRecipe = (req, res) => {
  const id = Number(req.params.id);
  const recipes = readRecipes();
  const filtered = recipes.filter(r => r.id !== id);

  if (filtered.length === recipes.length)
    return res.status(404).json({ error: "Recipe not found" });

  writeRecipes(filtered);
  res.json({ success: true });
};

/* ---------------------------------------------
   IMAGE ENDPOINTS
---------------------------------------------- */

// Return all image URLs
export const getImages = (req, res) => {
  const recipes = readRecipes();
  const images = recipes.map(r => r.image).filter(Boolean);
  res.json(images);
};

// Return image for a single recipe
export const getImageById = (req, res) => {
  const id = Number(req.params.id);
  const recipes = readRecipes();
  const recipe = recipes.find(r => r.id === id);

  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  res.json({ image: recipe.image });
};

// Proxy remote images (fixes Spoonacular CORS)
export const getImageProxy = async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch image" });
    }

    const buffer = await response.arrayBuffer();

    res.set("Content-Type", response.headers.get("content-type"));
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Image proxy error:", err);
    res.status(500).json({ error: "Image proxy failed" });
  }
};
