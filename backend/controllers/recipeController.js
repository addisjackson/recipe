import fs from "fs";

const RECIPES_FILE = "./data/recipes_cleaned.json";

function readRecipes() {
  if (!fs.existsSync(RECIPES_FILE)) fs.writeFileSync(RECIPES_FILE, "[]");
  const raw = fs.readFileSync(RECIPES_FILE, "utf8").trim();
  const data = raw ? JSON.parse(raw) : [];
  return data.map((recipe, index) => ({ id: index + 1, ...recipe }));
}

function writeRecipes(recipes) {
  fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 2));
}

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
  const newRecipe = { id: recipes.length + 1, ...req.body };
  recipes.push(newRecipe);
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
