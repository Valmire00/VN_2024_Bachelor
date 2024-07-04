/*const fs = require('fs');
const path = require('path');

// Helper function to read a JSON file and return its content
function readJSONFile(filePath) {
  console.log(`Reading JSON file: ${filePath}`);
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
      if (data && data.properties) {
        newTokens[file] = data.properties;  // Store tokens by filename
      } else {
        newTokens[file] = {};
      }
    }
  });

  // Read old tokens
  fs.readdirSync(oldTokensDir).forEach(file => {
    if (file.endsWith('.json')) {
      const data = readJSONFile(path.join(oldTokensDir, file));
      if (data && data.properties) {
        oldTokens[file] = data.properties;  // Store tokens by filename
      } else {
        oldTokens[file] = {};
      }
    }
  });

  console.log('New Tokens:', newTokens);
  console.log('Old Tokens:', oldTokens);

  // Compare tokens
  for (const [file, tokens] of Object.entries(newTokens)) {
    for (const [key, value] of Object.entries(tokens)) {
      if (!(file in oldTokens) || !(key in oldTokens[file])) {
        criticalChanges.push(`Added in ${file}: ${key} with value ${value.value}`);
      } else if (oldTokens[file][key].value !== value.value) {
        simpleChanges.push(`Modified in ${file}: ${key} from ${oldTokens[file][key].value} to ${value.value}`);
      }
    }
  }

  for (const [file, tokens] of Object.entries(oldTokens)) {
    for (const key in tokens) {
      if (!(file in newTokens) || !(key in newTokens[file])) {
        criticalChanges.push(`Removed from ${file}: ${key}`);
      }
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

  if (!fs.existsSync(newTokensDir)) {
    console.error(`Directory not found: ${newTokensDir}`);
    process.exit(1);
  }

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
//

const fs = require('fs');
const path = require('path');

// Helper function to read a JSON file and return its content
function readJSONFile(filePath) {
  console.log(`Reading JSON file: ${filePath}`);
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
      newTokens[file] = data;
    }
  });

  // Read old tokens
  fs.readdirSync(oldTokensDir).forEach(file => {
    if (file.endsWith('.json')) {
      const data = readJSONFile(path.join(oldTokensDir, file));
      oldTokens[file] = data;
    }
  });

  console.log('New Tokens:', newTokens);
  console.log('Old Tokens:', oldTokens);

  // Compare tokens
  for (const [file, tokens] of Object.entries(newTokens)) {
    if (!(file in oldTokens)) {
      criticalChanges.push(`File added: ${file}`);
    } else {
      for (const [key, value] of Object.entries(tokens)) {
        if (!(key in oldTokens[file])) {
          criticalChanges.push(`Added in ${file}: ${key} with value ${value}`);
        } else if (oldTokens[file][key] !== value) {
          simpleChanges.push(`Modified in ${file}: ${key} from ${oldTokens[file][key]} to ${value}`);
        }
      }
    }
  }

  for (const [file, tokens] of Object.entries(oldTokens)) {
    if (!(file in newTokens)) {
      criticalChanges.push(`File removed: ${file}`);
    } else {
      for (const key in tokens) {
        if (!(key in newTokens[file])) {
          criticalChanges.push(`Removed from ${file}: ${key}`);
        }
      }
    }
  }

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
*/

const fs = require('fs');
const path = require('path');

async function main() {
  const jsondiffpatch = await import('jsondiffpatch');
  const newTokensDir = process.argv[2];
  const oldTokensDir = process.argv[3];
  const outputFilePath = process.argv[4];

  const newFiles = new Set(fs.readdirSync(newTokensDir).filter(file => file.endsWith('.json')));
  const oldFiles = new Set(fs.readdirSync(oldTokensDir).filter(file => file.endsWith('.json')));

  // Find common files in both new and old directories
  const commonFiles = [...newFiles].filter(file => oldFiles.has(file));

  const changes = [];

  commonFiles.forEach(file => {
    const newPath = path.join(newTokensDir, file);
    const oldPath = path.join(oldTokensDir, file);
    const newContent = readJSONFile(newPath);
    const oldContent = readJSONFile(oldPath);

    if (!newContent || !oldContent) return;

    const delta = jsondiffpatch.diff(oldContent, newContent);
    if (delta) {
      changes.push(`Changes in ${file}:`);
      changes.push(JSON.stringify(delta, null, 2));
    }
  });

  if (changes.length > 0) {
    const output = changes.join('\n');
    fs.writeFileSync(outputFilePath, output);
    console.log('Changes categorized and written successfully.');
  } else {
    fs.writeFileSync(outputFilePath, 'No changes to categorize.');
    console.log('No changes to categorize.');
  }
}

function readJSONFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`Error reading JSON from ${filePath}:`, e);
    return null;
  }
}

main();
