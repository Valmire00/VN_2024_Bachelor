/*
const fs = require('fs');
const path = require('path');

async function main() {
  const jsondiffpatch = await import('jsondiffpatch');
  const newTokensDir = process.argv[2];
  const oldTokensDir = process.argv[3];
  const outputFilePath = process.argv[4];

  const newFiles = new Set(fs.readdirSync(newTokensDir).filter(file => file.endsWith('.json')));
  const oldFiles = new Set(fs.readdirSync(oldTokensDir).filter(file => file.endsWith('.json')));

  // Find common files in both new and old directories
  const commonFiles = [...newFiles].filter(file => oldFiles.has(file));

  const changes = [];

  commonFiles.forEach(file => {
    const newPath = path.join(newTokensDir, file);
    const oldPath = path.join(oldTokensDir, file);
    const newContent = readJSONFile(newPath);
    const oldContent = readJSONFile(oldPath);

    if (!newContent || !oldContent) return;

    const delta = jsondiffpatch.diff(oldContent, newContent);
    if (delta) {
      changes.push(`Changes in ${file}:`);
      changes.push(JSON.stringify(delta, null, 2));
    }
  });

  if (changes.length > 0) {
    const output = changes.join('\n');
    fs.writeFileSync(outputFilePath, output);
    console.log('Changes categorized and written successfully.');
  } else {
    fs.writeFileSync(outputFilePath, 'No changes to categorize.');
    console.log('No changes to categorize.');
  }
}

function readJSONFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`Error reading JSON from ${filePath}:`, e);
    return null;
  }
}

main();
*/

import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const changesFilePath = process.argv[2];
  const outputFilePath = process.argv[3];

  const changes = readJSONFile(changesFilePath);
  if (changes === 'No changes to categorize.') {
    fs.writeFileSync(outputFilePath, changes);
    console.log(changes);
    return;
  }

  const changesData = JSON.parse(changes);
  const categorizedChanges = {
    added: [],
    modified: [],
    removed: []
  };

  changesData.forEach(change => {
    const { file, delta } = change;

    Object.keys(delta).forEach(key => {
      if (delta[key].length === 1 && delta[key][0] === undefined) {
        // Added key
        categorizedChanges.added.push({ file, key, value: delta[key][0] });
      } else if (delta[key].length === 1 && delta[key][1] === 0) {
        // Removed key
        categorizedChanges.removed.push({ file, key });
      } else {
        // Modified key
        categorizedChanges.modified.push({ file, key, oldValue: delta[key][0], newValue: delta[key][1] });
      }
    });
  });

  let output = '';
  if (categorizedChanges.added.length > 0) {
    output += 'Added:\n';
    categorizedChanges.added.forEach(change => {
      output += `File: ${change.file}, Key: ${change.key}, Value: ${JSON.stringify(change.value, null, 2)}\n`;
    });
  }

  if (categorizedChanges.modified.length > 0) {
    output += 'Modified:\n';
    categorizedChanges.modified.forEach(change => {
      output += `File: ${change.file}, Key: ${change.key}, Old Value: ${JSON.stringify(change.oldValue, null, 2)}, New Value: ${JSON.stringify(change.newValue, null, 2)}\n`;
    });
  }

  if (categorizedChanges.removed.length > 0) {
    output += 'Removed:\n';
    categorizedChanges.removed.forEach(change => {
      output += `File: ${change.file}, Key: ${change.key}\n`;
    });
  }

  if (output.length > 0) {
    fs.writeFileSync(outputFilePath, output);
    console.log('Changes categorized and written successfully.');
  } else {
    fs.writeFileSync(outputFilePath, 'No changes to categorize.');
    console.log('No changes to categorize.');
  }
}

function readJSONFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    console.error(`Error reading JSON from ${filePath}:`, e);
    return null;
  }
}

main();