import express from "express";
import {
  getAllFavorites,
  getFavoriteByTitle,
  createFavorite,
  updateFavorite,
  deleteFavorite,
  toggleFavorite
} from "../controllers/favoritesController.js";

const router = express.Router();

router.get("/", getAllFavorites);
router.get("/:title", getFavoriteByTitle);
router.post("/", createFavorite);
router.put("/:title", updateFavorite);
router.delete("/:title", deleteFavorite);

// ⭐ Toggle route
router.post("/toggle", toggleFavorite);

export default router;
