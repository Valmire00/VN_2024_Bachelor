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

// categorize_json_changes.cjs
const fs = require('fs');
const path = require('path');

// Helper function to read a JSON file and return its content as an object
function readJSONFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Helper function to categorize changes between two JSON objects
function categorizeChanges(newJSON, oldJSON) {
  const simpleChanges = [];
  const criticalChanges = [];

  // Check for added or modified tokens
  for (const key in newJSON) {
    if (!oldJSON.hasOwnProperty(key)) {
      criticalChanges.push(`Added token: ${key}`);
    } else if (newJSON[key] !== oldJSON[key]) {
      simpleChanges.push(`Modified token: ${key} from ${oldJSON[key]} to ${newJSON[key]}`);
    }
  }

  // Check for removed tokens
  for (const key in oldJSON) {
    if (!newJSON.hasOwnProperty(key)) {
      criticalChanges.push(`Removed token: ${key}`);
    }
  }

  return { simpleChanges, criticalChanges };
}

// Main function
function main() {
  const newTokensDir = process.argv[2];
  const oldTokensDir = process.argv[3];
  const outputPath = process.argv[4];

  const newTokenFiles = fs.readdirSync(newTokensDir).filter(file => file.endsWith('.json'));
  const oldTokenFiles = fs.readdirSync(oldTokensDir).filter(file => file.endsWith('.json'));

  let allSimpleChanges = [];
  let allCriticalChanges = [];

  newTokenFiles.forEach(newFile => {
    const oldFile = oldTokenFiles.find(file => file === newFile);
    if (oldFile) {
      console.log(`Comparing ${newFile}...`);
      const newJSON = readJSONFile(path.join(newTokensDir, newFile));
      const oldJSON = readJSONFile(path.join(oldTokensDir, oldFile));
      const { simpleChanges, criticalChanges } = categorizeChanges(newJSON, oldJSON);
      allSimpleChanges = allSimpleChanges.concat(simpleChanges);
      allCriticalChanges = allCriticalChanges.concat(criticalChanges);
    } else {
      console.log(`New token file added: ${newFile}`);
      const newJSON = readJSONFile(path.join(newTokensDir, newFile));
      for (const key in newJSON) {
        allCriticalChanges.push(`Added token: ${key}`);
      }
    }
  });

  oldTokenFiles.forEach(oldFile => {
    if (!newTokenFiles.includes(oldFile)) {
      console.log(`Token file removed: ${oldFile}`);
      const oldJSON = readJSONFile(path.join(oldTokensDir, oldFile));
      for (const key in oldJSON) {
        allCriticalChanges.push(`Removed token: ${key}`);
      }
    }
  });

  console.log('Writing categorized changes to file...');
  const output = `Simple Changes:\n${allSimpleChanges.join('\n')}\n\nCritical Changes:\n${allCriticalChanges.join('\n')}`;
  fs.writeFileSync(outputPath, output);

  console.log('Categorized changes written successfully.');
  console.log(output); // Print output for debugging
}

main();
