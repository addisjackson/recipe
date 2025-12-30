import fs from "fs";
import recipes from "../data/finished.json" assert { type: "json" };

const updated = recipes.map(r => {
  if (!r.image) return r;

  const fileName = r.image.split("/").pop();
  return {
    ...r,
    image: `../public/assets/images/${fileName}`
  };
});

fs.writeFileSync(
  "../data/final2.json",
  JSON.stringify(updated, null, 2)
);

console.log("Updated image paths written to final2.json");
