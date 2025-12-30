import express from "express";
import {
  getFavorites,
  getFavorite,
  createFavorite,
  updateFavorite,
  deleteFavorite,
  toggleFavorite,
  deleteFavoriteEverywhere
} from "../controllers/favoritesController.js";

const router = express.Router();

// GET all favorites
router.get("/", getFavorites);

// GET one favorite by ID
router.get("/:id", getFavorite);

// CREATE favorite
router.post("/", createFavorite);

// UPDATE favorite
router.put("/:id", updateFavorite);

// DELETE favorite (favorites.json only)
router.delete("/:id", deleteFavorite);

// DELETE favorite everywhere (favorites.json + recipes.json)
router.delete("/delete/:id", deleteFavoriteEverywhere);

// TOGGLE favorite
router.post("/toggle", toggleFavorite);

export default router;
