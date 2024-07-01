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
import fs from 'fs';

// Lesen der CSS-Dateien
const oldCSS = fs.readFileSync(process.argv[3], 'utf8');
const newCSS = fs.readFileSync(process.argv[2], 'utf8');

// Parsing der CSS-Dateien in Zeilen
const oldLines = oldCSS.split('\n');
const newLines = newCSS.split('\n');

// Ändern Sie die Kategorien in "simple" und "fatal"
const simpleChanges = [];
const fatalChanges = [];

// Token-Tracking für das Erkennen von doppelten Token
const tokenSet = new Set();

// Überprüfen von Änderungen zwischen alten und neuen Zeilen
const maxLength = Math.max(oldLines.length, newLines.length);
for (let i = 0; i < maxLength; i++) {
    const oldLine = oldLines[i] || '';
    const newLine = newLines[i] || '';

    // Überprüfen, ob eine Zeile hinzugefügt oder entfernt wurde
    if (!oldLine && newLine) {
        // Überprüfen auf doppelte Token
        const tokenMatch = newLine.match(/(--[\w-]+):/);
        if (tokenMatch && tokenSet.has(tokenMatch[1])) {
            fatalChanges.push(`Duplicate token: ${tokenMatch[1]} added in new file at line ${i + 1}`);
        } else {
            tokenSet.add(tokenMatch ? tokenMatch[1] : '');
            simpleChanges.push(`Added: ${newLine} at line ${i + 1}`);
        }
    } else if (oldLine && !newLine) {
        fatalChanges.push(`Removed: ${oldLine} at line ${i + 1}`);
    } else if (oldLine !== newLine) {
        simpleChanges.push(`Changed from "${oldLine}" to "${newLine}" at line ${i + 1}`);
    }
}

// Schreiben der Ergebnisse in die Datei
const result = [
    'Simple Changes:',
    ...simpleChanges,
    '',
    'Fatal Changes:',
    ...fatalChanges
].join('\n');

fs.writeFileSync(process.argv[4], result, 'utf8');
