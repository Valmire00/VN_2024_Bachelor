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

// Helper function to read a JSON file and return its content
function readJSONFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Helper function to categorize changes between two JSON files
function categorizeChanges(newTokensDir, oldTokensDir) {
    const simpleChanges = [];
    const criticalChanges = [];

    // Get a list of all JSON files in the new tokens directory
    const newFiles = fs.readdirSync(newTokensDir).filter(file => file.endsWith('.json'));
    const oldFiles = fs.readdirSync(oldTokensDir).filter(file => file.endsWith('.json'));

    // Process each new file
    newFiles.forEach(newFile => {
        const newFilePath = path.join(newTokensDir, newFile);
        const newTokens = readJSONFile(newFilePath);

        const oldFilePath = path.join(oldTokensDir, newFile);
        let oldTokens = {};
        if (fs.existsSync(oldFilePath)) {
            oldTokens = readJSONFile(oldFilePath);
        }

        for (const [key, value] of Object.entries(newTokens)) {
            if (!(key in oldTokens)) {
                criticalChanges.push(`Added in ${newFile}: ${key} with value ${JSON.stringify(value)}`);
            } else if (JSON.stringify(oldTokens[key]) !== JSON.stringify(value)) {
                simpleChanges.push(`Modified in ${newFile}: ${key} from ${JSON.stringify(oldTokens[key])} to ${JSON.stringify(value)}`);
            }
        }

        for (const key in oldTokens) {
            if (!(key in newTokens)) {
                criticalChanges.push(`Removed from ${newFile}: ${key}`);
            }
        }
    });

    return { simpleChanges, criticalChanges };
}

// Main function
function main() {
    const newTokensDir = process.argv[2];
    const codeDiffPath = process.argv[3];
    const outputPath = process.argv[4];

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

    if (!fs.existsSync(oldTokensDir)) {
        console.error(`Directory not found: ${oldTokensDir}`);
        process.exit(1);
    }

    const { simpleChanges, criticalChanges } = categorizeChanges(newTokensDir, oldTokensDir);

    const output = `Simple Changes:\n${simpleChanges.join('\n')}\n\nCritical Changes:\n${criticalChanges.join('\n')}`;
    fs.writeFileSync(outputPath, output);

    console.log('Categorized changes written successfully.');
}

main();
