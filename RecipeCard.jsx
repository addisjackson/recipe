import React from "react";

const RecipeCard = ({ recipe, onOpen }) => {
  return (
    <div className="recipe-card" onClick={() => onOpen(recipe.id)}>
      <h3>{recipe.title}</h3>
      <img src={recipe.image} alt={recipe.title} />
    </div>
  );
};

export default RecipeCard;
