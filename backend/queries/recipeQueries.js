const { Pool } = require("pg");

// PostgreSQL configuration
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const searchRecipes = async (searchTerm, page) => {
  const query = {
    text: "SELECT * FROM recipes WHERE title ILIKE $1 LIMIT 10 OFFSET $2",
    values: [`%${searchTerm}%`, (page - 1) * 10],
  };

  const { rows } = await pool.query(query);
  return rows;
};

const getRecipeSummary = async (recipeId) => {
  const query = {
    text: "SELECT * FROM recipes WHERE id = $1",
    values: [recipeId],
  };

  const { rows } = await pool.query(query);
  return rows[0];
};

const addFavouriteRecipe = async (recipeId) => {
  const query = {
    text: "INSERT INTO favorite_recipes (recipe_id) VALUES ($1)",
    values: [recipeId],
  };

  await pool.query(query);
};

const getFavouriteRecipes = async () => {
  const query = {
    text: "SELECT * FROM favorite_recipes",
  };

  const { rows } = await pool.query(query);
  return rows;
};

const removeFavouriteRecipe = async (recipeId) => {
  const query = {
    text: "DELETE FROM favorite_recipes WHERE recipe_id = $1",
    values: [recipeId],
  };

  await pool.query(query);
};

module.exports = {
  searchRecipes,
  getRecipeSummary,
  addFavouriteRecipe,
  getFavouriteRecipes,
  removeFavouriteRecipe,
};
