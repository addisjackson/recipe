// routes.js

const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Define routes using the controller functions
router.get('/recipes/search', recipeController.searchAllRecipes);
router.get('/recipes/:recipeId/summary', recipeController.getOneRecipeSummary);
router.post('/recipes/favorites', recipeController.addFavoriteRecipe);
router.get('/recipes/favorites', recipeController.getFavoriteRecipes);
router.delete('/recipes/favorites/:recipeId', recipeController.removeFavoriteRecipe);
// Add more routes as needed...

module.exports = router;
