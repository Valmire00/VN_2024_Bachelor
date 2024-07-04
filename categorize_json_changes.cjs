const fs = require('fs');
const path = require('path');

// Helper function to read a JSON file and return its content
function readJSONFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

// Helper function to categorize changes between two JSON files
function categorizeChanges(newTokens, oldTokens) {
  const simpleChanges = [];
  const criticalChanges = [];

  for (const [key, value] of Object.entries(newTokens)) {
    if (!(key in oldTokens)) {
      criticalChanges.push(`Added: ${key} with value ${value}`);
    } else if (oldTokens[key].value !== value.value) {
      simpleChanges.push(`Modified: ${key} from ${oldTokens[key].value} to ${value.value}`);
    }
  }

  for (const key in oldTokens) {
    if (!(key in newTokens)) {
      criticalChanges.push(`Removed: ${key}`);
    }
  }

  return { simpleChanges, criticalChanges };
}

// Main function
function main() {
  const newTokensDir = process.argv[2];
  const oldTokensDir = process.argv[3];
  const outputPath = process.argv[4];

  console.log(`Reading new tokens from: ${newTokensDir}`);
  console.log(`Reading old tokens from: ${oldTokensDir}`);

  const newTokens = {};
  const oldTokens = {};

  // Read new tokens
  fs.readdirSync(newTokensDir).forEach(file => {
    if (file.endsWith('.json')) {
      const data = readJSONFile(path.join(newTokensDir, file));
      Object.assign(newTokens, data.properties);
    }
  });

  // Read old tokens
  fs.readdirSync(oldTokensDir).forEach(file => {
    if (file.endsWith('.json')) {
      const data = readJSONFile(path.join(oldTokensDir, file));
      Object.assign(oldTokens, data.properties);
    }
  });

  const { simpleChanges, criticalChanges } = categorizeChanges(newTokens, oldTokens);

  console.log('Writing categorized changes to file...');
  const output = `Simple Changes:\n${simpleChanges.join('\n')}\n\nCritical Changes:\n${criticalChanges.join('\n')}`;
  fs.writeFileSync(outputPath, output);

  console.log('Categorized changes written successfully.');
  console.log(output); // Print output for debugging
}

main();
