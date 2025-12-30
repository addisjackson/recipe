// src/scripts/createSeed.mjs
import fs from 'fs';
import path from 'path';

function escapeSingleQuotes(str) {
  return str.replace(/'/g, "''");
}

function filterValues(data) {
  const filteredData = data.map(recipe => {
    const { title, image, summary, instructions } = recipe;

    // Replacing <a href='...'> tags and enclosing http:// links in square brackets
    const formattedSummary = escapeSingleQuotes(summary.replace(/<a href='([^']+)'>/g, ''));
    const formattedInstructions = escapeSingleQuotes(instructions.replace(/<a href='([^']+)'>/g, ''));

    const summaryWithLinksFormatted = formattedSummary.replace(/(http:\/\/[^\s<]*)/g, '[$1]');
    const instructionsWithLinksFormatted = formattedInstructions.replace(/(http:\/\/[^\s<]*)/g, '[$1]');

    return `('${escapeSingleQuotes(title)}', '${image}', '${summaryWithLinksFormatted}', '${instructionsWithLinksFormatted}')`;
  });

  return filteredData.join(',\n');
}

export function createFormattedValues() {
  try {
    const filePath = path.resolve('./api.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const recipes = JSON.parse(rawData);

    const filteredValues = filterValues(recipes);

    const sqlInsertStatements = `INSERT INTO recipes (title, image, summary, instructions) VALUES \n${filteredValues};`;

    const sqlFilePath = path.resolve('./seed.sql');
    fs.writeFileSync(sqlFilePath, sqlInsertStatements);

    console.log('seed.sql has been generated successfully.');
  } catch (error) {
    console.error('Error reading or formatting JSON file:', error);
  }
}

// Run when executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  createFormattedValues();
}
