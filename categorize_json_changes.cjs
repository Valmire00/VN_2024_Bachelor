const fs = require('fs');
const path = require('path');

// Helper function to read a JSON file and return its content
function readJSONFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Helper function to categorize changes between two JSON files
function categorizeChanges(newTokensDir, oldTokensDir) {
  const simpleChanges = [];
  const criticalChanges = [];

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

  // Compare tokens
  for (const [key, value] of Object.entries(newTokens)) {
    if (!(key in oldTokens)) {
      criticalChanges.push(`Added: ${key} with value ${JSON.stringify(value)}`);
    } else if (JSON.stringify(oldTokens[key]) !== JSON.stringify(value)) {
      simpleChanges.push(`Modified: ${key} from ${JSON.stringify(oldTokens[key])} to ${JSON.stringify(value)}`);
    }
  }

  for (const key in oldTokens) {
    if (!(key in newTokens)) {
      criticalChanges.push(`Removed: ${key}`);
    }
  };

  return { simpleChanges, criticalChanges };
}

// Main function
function main() {
  const newTokensDir = process.argv[2];
  const codeDiffPath = process.argv[3];
  const outputPath = process.argv[4];

  console.log(`Reading new tokens from: ${newTokensDir}`);

  if (!fs.existsSync(newTokensDir)) {
    console.error(`Directory not found: ${newTokensDir}`);
    process.exit(1);
  }

  // Read old tokens directory from code_diff.txt
  const codeDiff = fs.readFileSync(codeDiffPath, 'utf-8');
  const oldTokensDirMatch = codeDiff.match(/old_tokens_dir:\s*(\S+)/);

  if (!oldTokensDirMatch) {
    console.error(`old_tokens_dir not found in code_diff.txt`);
    process.exit(1);
  }

  const oldTokensDir = oldTokensDirMatch[1];
  console.log(`Reading old tokens from: ${oldTokensDir}`);

  if (!fs.existsSync(oldTokensDir)) {
    console.error(`Directory not found: ${oldTokensDir}`);
    process.exit(1);
  }

  const { simpleChanges, criticalChanges } = categorizeChanges(newTokensDir, oldTokensDir);

  console.log('Writing categorized changes to file...');
  const output = `Simple Changes:\n${simpleChanges.join('\n')}\n\nCritical Changes:\n${criticalChanges.join('\n')}`;
  fs.writeFileSync(outputPath, output);

  console.log('Categorized changes written successfully.');
  console.log(output); // Print output for debugging
}

main();
