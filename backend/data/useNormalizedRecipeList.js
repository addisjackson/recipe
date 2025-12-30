import { useState, useEffect, useMemo } from "react";
import { normalizeRecipe } from "../utils/normalizeRecipe";

export function useNormalizedRecipesList(rawRecipes) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize the normalized list
  const normalizedList = useMemo(() => {
    try {
      if (!Array.isArray(rawRecipes)) return [];
      return rawRecipes.map((recipe) => normalizeRecipe(recipe));
    } catch (err) {
      console.error("Normalization error:", err);
      setError("Failed to normalize recipes");
      return [];
    }
  }, [rawRecipes]);

  useEffect(() => {
    if (!rawRecipes) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Simulate async (future-proof for API calls)
    const timer = setTimeout(() => {
      setRecipes(normalizedList);
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [rawRecipes, normalizedList]);

  return { recipes, loading, error };
}
