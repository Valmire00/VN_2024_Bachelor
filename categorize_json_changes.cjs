/*const fs = require('fs');
const diff = require('diff');

const oldFilePath = process.argv[2];
const newFilePath = process.argv[3];
const outputFilePath = process.argv[4];

const oldFileContent = fs.existsSync(oldFilePath) ? fs.readFileSync(oldFilePath, 'utf8') : '';
const newFileContent = fs.readFileSync(newFilePath, 'utf8');

const changes = diff.diffLines(oldFileContent, newFileContent);

const simpleChanges = [];
const criticalChanges = [];

const variableChangeRegex = /^\s*--.*:\s*.+;/;

changes.forEach((part) => {
  if (part.added || part.removed) {
    if (variableChangeRegex.test(part.value)) {
      simpleChanges.push(part.value);
    } else {
      criticalChanges.push(part.value);
    }
  }
});

const report = [
  'Simple Changes:',
  ...simpleChanges,
  '',
  'Critical Changes:',
  ...criticalChanges
].join('\n');

fs.writeFileSync(outputFilePath, report);
*/

/*const fs = require('fs');

// Helper function to read a CSS file and return its content as an array of lines
function readCSSFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8').split('\n');
}

// Helper function to categorize changes between two CSS files
function categorizeChanges(newCSS, oldCSS) {
  const simpleChanges = [];
  const criticalChanges = [];
  const tokenSet = new Set();

  const newTokens = new Set(newCSS);
  const oldTokens = new Set(oldCSS);

  newTokens.forEach((line) => {
    if (!oldTokens.has(line)) {
      if (tokenSet.has(line)) {
        criticalChanges.push(`Duplicate: ${line}`);
      } else {
        simpleChanges.push(`Added: ${line}`);
        tokenSet.add(line);
      }
    }
  });

  oldTokens.forEach((line) => {
    if (!newTokens.has(line)) {
      criticalChanges.push(`Removed: ${line}`);
    }
  });

  return { simpleChanges, criticalChanges };
}

// Main function
function main() {
  const newCSSPath = process.argv[2];
  const oldCSSPath = process.argv[3];
  const outputPath = process.argv[4];

  console.log(`Reading new CSS file from: ${newCSSPath}`);
  console.log(`Reading old CSS file from: ${oldCSSPath}`);
  
  if (!fs.existsSync(newCSSPath)) {
    console.error(`File not found: ${newCSSPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(oldCSSPath)) {
    console.error(`File not found: ${oldCSSPath}`);
    process.exit(1);
  }

  const newCSS = readCSSFile(newCSSPath);
  const oldCSS = readCSSFile(oldCSSPath);

  console.log('Comparing CSS files...');
  const { simpleChanges, criticalChanges } = categorizeChanges(newCSS, oldCSS);

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

  const newTokens = {};
  const oldTokens = {};

  // Read new tokens
  fs.readdirSync(newTokensDir).forEach(file => {
    if (file.endsWith('.json')) {
      const data = readJSONFile(path.join(newTokensDir, file));
      Object.assign(newTokens, data.properties); // Adjusted to read the properties correctly
    }
  });

  // Read old tokens
  fs.readdirSync(oldTokensDir).forEach(file => {
    if (file.endsWith('.json')) {
      const data = readJSONFile(path.join(oldTokensDir, file));
      Object.assign(oldTokens, data.properties); // Adjusted to read the properties correctly
    }
  });

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

