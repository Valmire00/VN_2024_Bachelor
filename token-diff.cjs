const fs = require('fs');
const path = require('path');
const diff = require('deep-diff').diff;

const tokensDir = 'tokens/';
const oldTokensDir = 'old_tokens/';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function compareTokens(current, previous) {
  const differences = diff(previous, current);
  if (!differences) {
    console.log('Keine Änderungen gefunden.');
    return;
  }

  let categorizedChanges = {
    simpleChanges: [],
    criticalChanges: []
  };

  differences.forEach((change) => {
    if (change.kind === 'N' || (change.kind === 'E' && change.path[change.path.length - 1] !== 'id')) {
      categorizedChanges.simpleChanges.push(change);
    } else if (change.kind === 'D' || change.kind === 'E' && change.path[change.path.length - 1] === 'id') {
      categorizedChanges.criticalChanges.push(change);
    }
  });

  return categorizedChanges;
}

function processDirectories() {
  fs.readdirSync(tokensDir).forEach(file => {
    if (path.extname(file) === '.json') {
      const currentFilePath = path.join(tokensDir, file);
      const previousFilePath = path.join(oldTokensDir, file);

      if (!fs.existsSync(previousFilePath)) {
        console.log(`Keine vorherige Version gefunden für: ${file}`);
        return;
      }

      const currentTokens = readJson(currentFilePath);
      const previousTokens = readJson(previousFilePath);
      const categorizedChanges = compareTokens(currentTokens, previousTokens);

      console.log(`Änderungen für ${file}:`, JSON.stringify(categorizedChanges, null, 2));
    }
  });
}

processDirectories();
