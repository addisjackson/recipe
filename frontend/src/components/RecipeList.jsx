import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "./RecipeCard";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 4;

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/random?apiKey=05a5bacd31eb4e68972c9229c002479d&query=chicken,beef,dessert,vegetarian,seafood&number=${recipesPerPage * 3}`
        );
        const data = await response.json();
        if (data && data.recipes && data.recipes.length > 0) {
          setRecipes(data.recipes);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    }

    fetchRecipes();
  }, []);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  return (
    <div className="recipe-list">
      {currentRecipes.map((recipe, index) => (
        <Link key={index} to={`/recipe/${recipe.id}`}>
          <RecipeCard
            recipe={recipe}
            onClick={() => {}}
            onFavouriteButtonClick={() => {}}
            isFavourite={false}
          />
          <div className="recipe-info">
            <h3>{recipe.title}</h3>
            <p>{recipe.summary}</p>
          </div>
        </Link>
      ))}
      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(recipes.length / recipesPerPage) }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
