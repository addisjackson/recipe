// resolveImage.js
import spoonacularData from "../data/finished.json";

export function findImageByTitle(title) {
  if (!title) return null;

  const match = spoonacularData.find(
    r => r.title.trim().toLowerCase() === title.trim().toLowerCase()
  );

  return match?.image || null;
}
