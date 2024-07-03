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

function readJSONFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function getTokensFromDir(dir) {
  const files = fs.readdirSync(dir);
  const tokens = {};
  files.forEach((file) => {
    if (path.extname(file) === '.json') {
      const filePath = path.join(dir, file);
      const jsonContent = readJSONFile(filePath);
      Object.assign(tokens, jsonContent);
    }
  });
  return tokens;
}

function categorizeChanges(newTokens, oldTokens) {
  const simpleChanges = [];
  const criticalChanges = [];

  for (const key in newTokens) {
    if (!(key in oldTokens)) {
      criticalChanges.push(`Added: ${key}`);
    } else if (newTokens[key] !== oldTokens[key]) {
      simpleChanges.push(`Changed: ${key} from ${oldTokens[key]} to ${newTokens[key]}`);
    }
  }

  for (const key in oldTokens) {
    if (!(key in newTokens)) {
      criticalChanges.push(`Removed: ${key}`);
    }
  }

  return { simpleChanges, criticalChanges };
}

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

  const newTokens = getTokensFromDir(newTokensDir);
  const oldTokens = getTokensFromDir(oldTokensDir);

  console.log('Comparing token JSON files...');
  const { simpleChanges, criticalChanges } = categorizeChanges(newTokens, oldTokens);

  console.log('Writing categorized changes to file...');
  const output = `Simple Changes:\n${simpleChanges.join('\n')}\n\nCritical Changes:\n${criticalChanges.join('\n')}`;
  fs.writeFileSync(outputPath, output);

  console.log('Categorized changes written successfully.');
  console.log(output); // Print output for debugging
}

main();
