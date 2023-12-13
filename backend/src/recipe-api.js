const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

require("dotenv").config();

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
    // Replace this with your logic using the functions
    const results = await searchRecipes(searchTerm, page);
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
    // Replace this with your logic using the functions
    const results = await getRecipeSummary(recipeId);
    return res.json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Oops, something went wrong" });
  }
});

// Endpoint for getting favorite recipes by IDs
app.get("/api/recipes/favourite", async (req, res) => {
  const ids = req.query.ids.split(",");

  try {
    // Replace this with your logic using the functions
    const results = await getFavouriteRecipesByIDs(ids);
    return res.json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Oops, something went wrong" });
  }
});

app.listen(5000, () => {
  console.log("Server running on localhost:5000");
});

// ... (previous Express setup and configuration)

// Function to search recipes
async function searchRecipes(searchTerm, page) {
    const offset = (page - 1) * 10; // Assuming 10 results per page
  
    const query = {
      text: `
        SELECT * FROM recipes
        WHERE title ILIKE $1
        LIMIT 10 OFFSET $2
      `,
      values: [`%${searchTerm}%`, offset],
    };
  
    const client = await pool.connect();
    try {
      const result = await client.query(query);
      return result.rows;
    } finally {
      client.release();
    }
  }
  
  // Function to get recipe summary by ID
  async function getRecipeSummary(recipeId) {
    const query = {
      text: `
        SELECT * FROM recipes
        WHERE id = $1
      `,
      values: [recipeId],
    };
  
    const client = await pool.connect();
    try {
      const result = await client.query(query);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  
  
  async function getFavouriteRecipesByIDs(ids) {
    const query = {
      text: `
        SELECT * FROM recipes
        WHERE id IN (${ids.map((_, i) => `$${i + 1}`).join(",")})
      `,
      values: ids,
    };
  
    const client = await pool.connect();
    try {
      const result = await client.query(query);
      return result.rows;
    } finally {
      client.release();
    }
  }
  
  
