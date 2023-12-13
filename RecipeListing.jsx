import React, { useState } from "react";
import RecipeCard from "./RecipeCard";
import RecipeDetails from "./RecipeDetails";
import * as RecipeAPI from "../api";

const RecipeListing = ({ recipes }) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [recipeSummary, setRecipeSummary] = useState(null);

  const openRecipeDetails = async (recipeId) => {
    try {
      const summaryRecipe = await RecipeAPI.getRecipeSummary(recipeId);
      setRecipeSummary(summaryRecipe);
      setSelectedRecipeId(recipeId);
    } catch (error) {
      console.log(error);
    }
  };

  const closeRecipeDetails = () => {
    setSelectedRecipeId(null);
    setRecipeSummary(null);
  };

  return (
    <div className="recipe-listing">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} onOpen={openRecipeDetails} />
      ))}
      {selectedRecipeId && (
        <RecipeDetails recipeSummary={recipeSummary} onClose={closeRecipeDetails} />
      )}
    </div>
  );
};

export default RecipeListing;
