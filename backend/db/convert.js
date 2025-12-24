// ------------------------------------------------------
// 1. SAFE PARSER — always returns valid recipe objects
// ------------------------------------------------------
function parseRecipes(recipes) {
    return recipes.map(([title, image, description, instructionsText]) => {
        // Ensure all fields are strings
        title = title || "";
        image = image || "";
        description = description || "";
        instructionsText = instructionsText || "";

        // Extract <b>...</b> tags
        const bTags = [...description.matchAll(/<b>(.*?)<\/b>/g)].map(m => m[1]);

        const calories = bTags.find(tag => /calories/i.test(tag)) || null;
        const protein = bTags.find(tag => /protein/i.test(tag)) || null;
        const fat = bTags.find(tag => /fat/i.test(tag)) || null;
        const cost = bTags.find(tag => /\$/i.test(tag)) || null;
        const vitamins = bTags.find(tag => /covers/i.test(tag)) || null;
        const prepTime = bTags.find(tag => /\d+\s*(minutes?|hours?|seconds?)/i.test(tag)) || null;
        const spoonacularRating = bTags.find(tag => /score/i.test(tag)) || null;

        const ingredients = bTags.filter(tag =>
            ![calories, protein, fat, cost, vitamins, prepTime, spoonacularRating].includes(tag)
        );

        const similarRecipes = [...description.matchAll(/<a href="(.*?)"/g)].map(m => m[1]);

        // Extract steps
        const steps = {};
        const liMatches = [...instructionsText.matchAll(/<li>(.*?)<\/li>/g)];

        if (liMatches.length > 0) {
            liMatches.forEach((m, idx) => {
                steps[`step ${idx + 1}`] = m[1].trim();
            });
        } else {
            // fallback: split sentences
            const sentences = instructionsText.split(/\. |\n/).filter(s => s.trim());
            sentences.forEach((s, idx) => {
                let step = s.trim();
                if (!step.endsWith(".")) step += ".";
                steps[`step ${idx + 1}`] = step;
            });
        }

        return {
            title,
            image_url: image,
            ingredients,
            calories,
            protein,
            fat,
            cost,
            vitamins,
            preparation_time: prepTime,
            spoonacular_rating: spoonacularRating,
            similar_recipes: similarRecipes,
            instructions: steps
        };
    });
}


// ------------------------------------------------------
// 2. SQL → JS tuple extractor (robust + safe)
// ------------------------------------------------------
function extractRecipesFromSQL(sql) {
    sql = sql.replace(/INSERT INTO[\s\S]*?VALUES/i, "");

    const blocks = [...sql.matchAll(/\(([\s\S]*?)\)/g)].map(m => m[1]);

    return blocks.map(block => {
        // Split by commas not inside quotes
        const parts = block.split(/,(?=(?:[^']|'[^']*')*$)/).map(s => s.trim());

        // Remove surrounding single quotes
        const clean = parts.map(p => p.replace(/^'/, "").replace(/'$/, ""));

        // Guarantee exactly 4 fields
        while (clean.length < 4) clean.push("");
        if (clean.length > 4) clean.length = 4;

        return clean;
    });
}


// ------------------------------------------------------
// 3. MAIN — Convert SQL → JSON
// ------------------------------------------------------
function sqlToJson(sql) {
    const tuples = extractRecipesFromSQL(sql);
    const parsed = parseRecipes(tuples);
    return JSON.stringify(parsed, null, 2);
}


// ------------------------------------------------------
// 4. RUN IT
// ------------------------------------------------------
import fs from "fs";

const sql = fs.readFileSync("./seed.sql", "utf8"); // your SQL file
console.log(sqlToJson(sql));
