import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const RecipeCard = ({
  recipe,
  onClick,
  onFavouriteButtonClick,
  isFavourite,
}) => {
  const [recipeData, setRecipeData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/random?apiKey=05a5bacd31eb4e68972c9229c002479d&query=chicken,beef,dessert,vegetarian,seafood&number=30`
        );
        const data = await response.json();
        if (data && data.recipes && data.recipes.length > 0) {
          setRecipeData(data.recipes[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="recipe-card" onClick={onClick}>
      {recipeData && (
        <>
          <img src={recipeData.image} alt={recipeData.title}></img>
          <div className="recipe-card-title">
            <span
              onClick={(event) => {
                event.stopPropagation();
                onFavouriteButtonClick(recipeData);
              }}
            >
              {isFavourite ? (
                <AiFillHeart size={25} color="red" />
              ) : (
                <AiOutlineHeart size={25} />
              )}
            </span>
            <h3>{recipeData.title}</h3>
            <p>{recipeData.summary}</p>
            <p>{recipeData.instructions}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default RecipeCard;
