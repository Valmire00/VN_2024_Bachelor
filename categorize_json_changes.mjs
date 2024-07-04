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
  const jsondiffpatch = await import('jsondiffpatch');
  const newTokensDir = process.argv[2];
  const oldTokensDir = process.argv[3];
  const outputFilePath = process.argv[4];

  const newFiles = new Set(fs.readdirSync(newTokensDir).filter(file => file.endsWith('.json')));
  const oldFiles = new Set(fs.readdirSync(oldTokensDir).filter(file => file.endsWith('.json')));

  // Find common files in both new and old directories
  const commonFiles = [...newFiles].filter(file => oldFiles.has(file));

  const changes = {
    added: [],
    modified: [],
    removed: []
  };

  commonFiles.forEach(file => {
    const newPath = path.join(newTokensDir, file);
    const oldPath = path.join(oldTokensDir, file);
    const newContent = readJSONFile(newPath);
    const oldContent = readJSONFile(oldPath);

    if (!newContent || !oldContent) return;

    const delta = jsondiffpatch.diff(oldContent, newContent);
    if (delta) {
      Object.keys(delta).forEach(key => {
        if (delta[key].length === 1 && delta[key][0] === undefined) {
          // Added key
          changes.added.push({ file, key, value: newContent[key] });
        } else if (delta[key].length === 1 && delta[key][1] === 0) {
          // Removed key
          changes.removed.push({ file, key });
        } else {
          // Modified key
          changes.modified.push({ file, key, oldValue: oldContent[key], newValue: newContent[key] });
        }
      });
    }
  });

  let output = '';
  if (changes.added.length > 0) {
    output += 'Added:\n';
    changes.added.forEach(change => {
      output += `File: ${change.file}, Key: ${change.key}, Value: ${JSON.stringify(change.value, null, 2)}\n`;
    });
  }

  if (changes.modified.length > 0) {
    output += 'Modified:\n';
    changes.modified.forEach(change => {
      output += `File: ${change.file}, Key: ${change.key}, Old Value: ${JSON.stringify(change.oldValue, null, 2)}, New Value: ${JSON.stringify(change.newValue, null, 2)}\n`;
    });
  }

  if (changes.removed.length > 0) {
    output += 'Removed:\n';
    changes.removed.forEach(change => {
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
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`Error reading JSON from ${filePath}:`, e);
    return null;
  }
}

main();
