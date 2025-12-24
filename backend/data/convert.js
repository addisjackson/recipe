import fs from "fs";
import data from "./recipes.js";

const json = JSON.stringify(data, null, 2);

fs.writeFileSync("recipes.json", json, "utf-8");

console.log("✅ Converted recipes.js → recipes.json");
