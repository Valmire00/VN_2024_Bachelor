const fs = require('fs');
const path = require('path');

// Helper function to read a JSON file and return its content
function readJSONFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Helper function to categorize changes between two JSON files
function categorizeChanges(newTokens, oldTokens) {
  const simpleChanges = [];
  const criticalChanges = [];

  // Compare tokens
  for (const [key, value] of Object.entries(newTokens.properties)) {
    if (!(key in oldTokens.properties)) {
      criticalChanges.push(`Added: ${key} with value ${JSON.stringify(value)}`);
    } else if (JSON.stringify(oldTokens.properties[key]) !== JSON.stringify(value)) {
      simpleChanges.push(`Modified: ${key} from ${JSON.stringify(oldTokens.properties[key])} to ${JSON.stringify(value)}`);
    }
  }

  for (const key in oldTokens.properties) {
    if (!(key in newTokens.properties)) {
      criticalChanges.push(`Removed: ${key}`);
    }
  }

  return { simpleChanges, criticalChanges };
}

// Main function
function main() {
  const newTokensPath = process.argv[2];
  const oldTokensPath = process.argv[3];
  const outputPath = process.argv[4];

  console.log(`Reading new tokens from: ${newTokensPath}`);

  if (!fs.existsSync(newTokensPath)) {
    console.error(`File not found: ${newTokensPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(oldTokensPath)) {
    console.error(`File not found: ${oldTokensPath}`);
    process.exit(1);
  }

  const newTokens = readJSONFile(newTokensPath);
  const oldTokens = readJSONFile(oldTokensPath);

  console.log('Comparing JSON files...');
  const { simpleChanges, criticalChanges } = categorizeChanges(newTokens, oldTokens);

  console.log('Writing categorized changes to file...');
  const output = `Simple Changes:\n${simpleChanges.join('\n')}\n\nCritical Changes:\n${criticalChanges.join('\n')}`;
  fs.writeFileSync(outputPath, output);

  console.log('Categorized changes written successfully.');
  console.log(output); // Print output for debugging
}

main();
