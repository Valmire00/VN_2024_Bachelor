const fs = require('fs');
const diff = require('diff');

const oldFilePath = process.argv[2];
const newFilePath = process.argv[3];
const outputFilePath = process.argv[4];

const oldFileContent = fs.readFileSync(oldFilePath, 'utf8');
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
