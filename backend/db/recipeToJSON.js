import { sqlString } from './recipeData.js';

function parseSQLTuples(sqlString) {
    const tuples = [];
    const regex = /\(([^()]+?)\)/g;
    let match;
    while ((match = regex.exec(sqlString)) !== null) {
        const tuple = [];
        let current = '';
        let inQuotes = false;
        for (let char of match[1]) {
            if (char === "'" && current.slice(-1) !== "\\") inQuotes = !inQuotes;
            if (char === ',' && !inQuotes) {
                tuple.push(current.trim().replace(/^'|'$/g, '').replace(/\\'/g, "'"));
                current = '';
            } else {
                current += char;
            }
        }
        tuple.push(current.trim().replace(/^'|'$/g, '').replace(/\\'/g, "'"));
        tuples.push(tuple);
    }
    return tuples;
}

function parseRecipes(recipes) {
    return recipes.map(([title, image, description, instructionsText]) => {
        const bTags = [...description.matchAll(/<b>(.*?)<\/b>/g)].map(m => m[1]);
        const calories = bTags.find(tag => /calories/i.test(tag)) || null;
        const protein = bTags.find(tag => /protein/i.test(tag)) || null;
        const fat = bTags.find(tag => /fat/i.test(tag)) || null;
        const cost = bTags.find(tag => /\$/i.test(tag)) || null;
        const vitamins = bTags.find(tag => /covers/i.test(tag)) || null;
        const prepTime = bTags.find(tag => /\d+\s*(?:minutes?|hours?|seconds?)/i.test(tag)) || null;
        const spoonacularRating = bTags.find(tag => /score/i.test(tag)) || null;
        const ingredients = bTags.filter(tag => ![calories, protein, fat, cost, vitamins, prepTime, spoonacularRating].includes(tag));
        const similarRecipes = [...description.matchAll(/<a href="(.*?)"/g)].map(m => m[1]);

        const steps = {};
        const liMatches = instructionsText.match(/<li>(.*?)<\/li>/g);
        if (liMatches) {
            liMatches.forEach((li, idx) => {
                steps[`step ${idx + 1}`] = li.replace(/<li>|<\/li>/g, '').trim();
            });
        } else {
            const sentences = instructionsText.split(/(?:\. |\n)/).filter(s => s.trim());
            sentences.forEach((s, idx) => {
                let step = s.trim();
                if (!step.endsWith('.')) step += '.';
                steps[`step ${idx + 1}`] = step;
            });
        }

        return {
            title,
            image: image,
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

const jsTuples = parseSQLTuples(sqlData);
const recipesJson = parseRecipes(jsTuples);
console.log(JSON.stringify(recipesJson, null, 4));