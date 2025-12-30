import express from "express";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getImages,
  getImageById,
  getImageProxy
} from "../controllers/recipeController.js";

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.post("/", createRecipe);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

// image routes
router.get("/images/all", getImages);
router.get("/images/:id", getImageById);
router.get("/image-proxy", getImageProxy);

export default router;
