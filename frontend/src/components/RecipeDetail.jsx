import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const { recipeId } = useParams();

  useEffect(() => {
    async function fetchRecipeDetails() {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=05a5bacd31eb4e68972c9229c002479d`
        );
        const data = await response.json();
        if (data) {
          setRecipe(data);
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    }

    fetchRecipeDetails();
  }, [recipeId]);

  return (
    <div className="recipe-detail">
      {recipe && (
        <>
          <h2>{recipe.title}</h2>
          <img src={recipe.image} alt={recipe.title}></img>
          <p>{recipe.summary}</p>
          <h3>Instructions:</h3>
          <p>{recipe.instructions}</p>
        </>
      )}
    </div>
  );
};

export default RecipeDetail;
