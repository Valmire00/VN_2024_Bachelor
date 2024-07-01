const fs = require('fs');

const diffFilePath = process.argv[2];
const outputFilePath = process.argv[3];

const diff = fs.readFileSync(diffFilePath, 'utf8');

const simpleChanges = [];
const criticalChanges = [];

const variableChangeRegex = /^\s*--.*:\s*.+;/;

diff.split('\n').forEach(line => {
  if (line.startsWith('+') && !line.startsWith('+++')) {
    if (variableChangeRegex.test(line)) {
      simpleChanges.push(line);
    } else {
      criticalChanges.push(line);
    }
  } else if (line.startsWith('-') && !line.startsWith('---')) {
    if (variableChangeRegex.test(line)) {
      simpleChanges.push(line);
    } else {
      criticalChanges.push(line);
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
