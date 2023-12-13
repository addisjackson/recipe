export const searchRecipes = async (searchTerm, page) => {
  const apiKey = "05a5bacd31eb4e68972c9229c002479d";
  const query = "chicken,beef,dessert,vegetarian,seafood";
  const number = 30;

  const url = new URL("https://api.spoonacular.com/recipes/random");
  url.searchParams.append("apiKey", apiKey);
  url.searchParams.append("query", query);
  url.searchParams.append("number", number);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

export const getRecipeSummary = async (recipeId) => {
  const apiKey = "05a5bacd31eb4e68972c9229c002479d";
  const url = `https://api.spoonacular.com/recipes/random?apiKey=05a5bacd31eb4e68972c9229c002479d&query=chicken, beef, dessert, vegetarian, seafood&number=30`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

export const getFavouriteRecipes = async () => {
    const response = await fetch("https://api.spoonacular.com/recipes/random?apiKey=05a5bacd31eb4e68972c9229c002479d&query=chicken, beef, dessert, vegetarian, seafood&number=30");
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    return response.json();
  };
  

  export const getFavoriteRecipe = async (recipeId) => {
    const response = await fetch(`https://api.spoonacular.com/recipes/favorites/${recipeId}`, {
      method: "GET",
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    return response.json();
  };
  

  export const removeFavouriteRecipe = async (recipeId) => {
    const response = await fetch(`https://api.spoonacular.com/recipes/favorites/${recipeId}`, {
      method: "DELETE",
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    return response.json();
  };
  
  


export const updateRecipe = async (recipeId, updatedRecipeData) => {
  const response = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=05a5bacd31eb4e68972c9229c002479d&query=chicken, beef, dessert, vegetarian, seafood&number=30/${recipeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedRecipeData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};
