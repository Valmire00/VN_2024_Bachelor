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

const fs = require('fs');

// Hilfsfunktion zum Einlesen von CSS-Dateien
function readCSSFile(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

// Funktion zur Extraktion der Tokens aus der CSS-Datei
function extractTokens(cssContent) {
    const tokenRegex = /(--[^:]+):\s*([^;]+);/g;
    const tokens = {};
    let match;
    while ((match = tokenRegex.exec(cssContent)) !== null) {
        tokens[match[1]] = match[2];
    }
    return tokens;
}

// Funktion zur Kategorisierung der Änderungen
function categorizeChanges(newTokens, oldTokens) {
    const simpleChanges = [];
    const criticalChanges = [];

    const allKeys = new Set([...Object.keys(newTokens), ...Object.keys(oldTokens)]);

    allKeys.forEach(key => {
        if (!(key in oldTokens)) {
            criticalChanges.push(`New token added: ${key}: ${newTokens[key]}`);
        } else if (!(key in newTokens)) {
            criticalChanges.push(`Token removed: ${key}`);
        } else if (newTokens[key] !== oldTokens[key]) {
            simpleChanges.push(`Changed ${key} from "${oldTokens[key]}" to "${newTokens[key]}"`);
        }
    });

    // Doppelte Tokens suchen und als kritische Änderung kennzeichnen
    const tokenMap = new Map();
    for (const key in newTokens) {
        if (tokenMap.has(key)) {
            criticalChanges.push(`Duplicate token detected: ${key}`);
        } else {
            tokenMap.set(key, newTokens[key]);
        }
    }

    return { simpleChanges, criticalChanges };
}

// Hauptfunktion
function main() {
    const [newFilePath, oldFilePath, outputFilePath] = process.argv.slice(2);

    const newCSSContent = readCSSFile(newFilePath);
    const oldCSSContent = readCSSFile(oldFilePath);

    const newTokens = extractTokens(newCSSContent);
    const oldTokens = extractTokens(oldCSSContent);

    const { simpleChanges, criticalChanges } = categorizeChanges(newTokens, oldTokens);

    const categorizedChanges = [
        'Simple Changes:',
        ...simpleChanges,
        '',
        'Critical Changes:',
        ...criticalChanges
    ].join('\n');

    fs.writeFileSync(outputFilePath, categorizedChanges);
    console.log('Changes categorized and written to', outputFilePath);
}

main();
