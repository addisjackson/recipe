import fs from "fs";
import path from "path";

const filePath = path.resolve("db/api.json");

const readRecipes = () =>
  JSON.parse(fs.readFileSync(filePath, "utf-8"));

const writeRecipes = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

export const getAllRecipes = () => readRecipes();

export const getRecipeById = (id) =>
  readRecipes().find(r => r.id === id);

export const createRecipe = (recipe) => {
  const recipes = readRecipes();
  const newRecipe = { ...recipe, id: Date.now() };
  recipes.push(newRecipe);
  writeRecipes(recipes);
  return newRecipe;
};

export const updateRecipe = (id, updates) => {
  const recipes = readRecipes();
  const index = recipes.findIndex(r => r.id === id);
  if (index === -1) return null;

  recipes[index] = { ...recipes[index], ...updates };
  writeRecipes(recipes);
  return recipes[index];
};

export const deleteRecipe = (id) => {
  const recipes = readRecipes();
  const filtered = recipes.filter(r => r.id !== id);
  writeRecipes(filtered);
};
