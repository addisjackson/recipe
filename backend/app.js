import express from "express";
import cors from "cors";
import imageRoutes from "./controllers/images.js"; 
import compression from "compression";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getImages,
  getImageById,
  getImageProxy
} from "./controllers/recipeController.js";

import {
  getFavorites,
  getFavorite,
  toggleFavorite,
  deleteFavorite,
  createFavorite,
  updateFavorite,
  deleteFavoriteEverywhere
} from "./controllers/favoritesController.js";

const app = express();


app.use(cors({
  origin: [
    "https://addisjackson.github.io",
    "https://addisjackson.github.io/RecipeFavs"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use("/images", imageRoutes);
app.use(compression());
/* ---------------------------------------------


/* ---------------------------------------------
   RECIPE ROUTES
---------------------------------------------- */
app.get("/recipes", getAllRecipes);
app.get("/recipes/:id", getRecipeById);
app.post("/recipes", createRecipe);
app.put("/recipes/:id", updateRecipe);
app.delete("/recipes/:id", deleteRecipe);

/* ---------------------------------------------
   FAVORITE ROUTES
---------------------------------------------- */
app.get("/favorites", getFavorites);
app.get("/favorites/:id", getFavorite);
app.post("/favorites", createFavorite);
app.put("/favorites/:id", updateFavorite);
app.delete("/favorites/:id", deleteFavorite);
app.delete("/favorites/delete/:id", deleteFavoriteEverywhere);
app.post("/favorites/toggle", toggleFavorite);

export default app;
