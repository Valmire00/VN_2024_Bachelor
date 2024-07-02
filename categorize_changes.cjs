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

function readJSONFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function categorizeChanges(newJSON, oldJSON) {
  const simpleChanges = [];
  const criticalChanges = [];

  const newKeys = Object.keys(newJSON);
  const oldKeys = Object.keys(oldJSON);

  // Check for added or changed variables
  newKeys.forEach((key) => {
    if (!oldKeys.includes(key)) {
      criticalChanges.push(`Added: ${key}`);
    } else if (newJSON[key] !== oldJSON[key]) {
      simpleChanges.push(`Changed: ${key} from ${oldJSON[key]} to ${newJSON[key]}`);
    }
  });

  // Check for removed variables
  oldKeys.forEach((key) => {
    if (!newKeys.includes(key)) {
      criticalChanges.push(`Removed: ${key}`);
    }
  });

  return { simpleChanges, criticalChanges };
}

function main() {
  const newJSONPath = process.argv[2];
  const oldJSONPath = process.argv[3];
  const outputPath = process.argv[4];

  console.log(`Reading new JSON file from: ${newJSONPath}`);
  console.log(`Reading old JSON file from: ${oldJSONPath}`);

  if (!fs.existsSync(newJSONPath)) {
    console.error(`File not found: ${newJSONPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(oldJSONPath)) {
    console.error(`File not found: ${oldJSONPath}`);
    process.exit(1);
  }

  const newJSON = readJSONFile(newJSONPath);
  const oldJSON = readJSONFile(oldJSONPath);

  console.log('Comparing JSON files...');
  const { simpleChanges, criticalChanges } = categorizeChanges(newJSON, oldJSON);

  console.log('Writing categorized changes to file...');
  const output = `Simple Changes:\n${simpleChanges.join('\n')}\n\nCritical Changes:\n${criticalChanges.join('\n')}`;
  fs.writeFileSync(outputPath, output);

  console.log('Categorized changes written successfully.');
  console.log(output); // Print output for debugging
}

main();
