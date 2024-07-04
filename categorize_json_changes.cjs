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
      Object.assign(newTokens, data.properties);  // Adjusted to read 'properties'
    }
  });

  // Read old tokens
  fs.readdirSync(oldTokensDir).forEach(file => {
    if (file.endsWith('.json')) {
      const data = readJSONFile(path.join(oldTokensDir, file));
      Object.assign(oldTokens, data.properties);  // Adjusted to read 'properties'
    }
  });

  console.log('New Tokens:', newTokens);
  console.log('Old Tokens:', oldTokens);

  // Compare tokens
  for (const [key, value] of Object.entries(newTokens)) {
    if (!(key in oldTokens)) {
      criticalChanges.push(`Added: ${key} with value ${value.value}`);
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

function readJSONFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getTokens(directory) {
    const tokens = {};
    const files = fs.readdirSync(directory);
    files.forEach(file => {
        if (path.extname(file) === '.json') {
            const filePath = path.join(directory, file);
            const fileTokens = readJSONFile(filePath);
            tokens[file] = fileTokens;
        }
    });
    return tokens;
}

function compareTokens(oldTokens, newTokens) {
    const changes = {
        added: [],
        removed: [],
        modified: []
    };

    // Check for new or modified tokens
    Object.keys(newTokens).forEach(file => {
        if (!(file in oldTokens)) {
            changes.added.push(file);
        } else {
            Object.keys(newTokens[file]).forEach(token => {
                if (!(token in oldTokens[file])) {
                    changes.added.push(`${file}: ${token}`);
                } else if (JSON.stringify(newTokens[file][token]) !== JSON.stringify(oldTokens[file][token])) {
                    changes.modified.push(`${file}: ${token}`);
                }
            });
        }
    });

    // Check for removed tokens
    Object.keys(oldTokens).forEach(file => {
        if (!(file in newTokens)) {
            changes.removed.push(file);
        } else {
            Object.keys(oldTokens[file]).forEach(token => {
                if (!(token in newTokens[file])) {
                    changes.removed.push(`${file}: ${token}`);
                }
            });
        }
    });

    return changes;
}

function main() {
    const newTokensDir = process.argv[2];
    const oldTokensDir = 'old_tokens';

    const newTokens = getTokens(newTokensDir);
    const oldTokens = getTokens(oldTokensDir);

    const changes = compareTokens(oldTokens, newTokens);

    const categorizedChangesPath = process.argv[4];
    const categorizedChanges = `
        Added Tokens: ${changes.added.join(', ')}
        Removed Tokens: ${changes.removed.join(', ')}
        Modified Tokens: ${changes.modified.join(', ')}
    `;

    fs.writeFileSync(categorizedChangesPath, categorizedChanges);
    console.log('Categorized changes written successfully.');
}

main();
