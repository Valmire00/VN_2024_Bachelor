/*import { fileURLToPath } from 'url';
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

  const changes = [];

  commonFiles.forEach(file => {
    const newPath = path.join(newTokensDir, file);
    const oldPath = path.join(oldTokensDir, file);
    const newContent = readJSONFile(newPath);
    const oldContent = readJSONFile(oldPath);

    if (!newContent || !oldContent) return;

    const delta = jsondiffpatch.diff(oldContent, newContent);
    if (delta) {
      changes.push({ file, delta });
    }
  });

  if (changes.length > 0) {
    fs.writeFileSync(outputFilePath, JSON.stringify(changes, null, 2));
    console.log('Changes detected and written successfully.');
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
/* -- bisher der beste Ansatz:
import { diff } from 'jsondiffpatch';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readJSONFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`Error reading JSON from ${filePath}:`, e);
    return null;
  }
}

function categorizeChanges(delta) {
  const changes = {
    added: [],
    modified: [],
    removed: []
  };

  function recursiveCategorize(delta, path = []) {
    for (const key in delta) {
      if (Array.isArray(delta[key])) {
        if (delta[key].length === 1 && delta[key][0] !== undefined) {
          changes.added.push({ path: [...path, key], value: delta[key][0] });
        } else if (delta[key].length === 1 && delta[key][0] === undefined) {
          changes.removed.push({ path: [...path, key] });
        } else if (delta[key].length === 2) {
          changes.modified.push({ path: [...path, key], oldValue: delta[key][0], newValue: delta[key][1] });
        }
      } else if (typeof delta[key] === 'object') {
        recursiveCategorize(delta[key], [...path, key]);
      }
    }
  }

  recursiveCategorize(delta);
  return changes;
}

async function main() {
  const newTokensDir = process.argv[2];
  const oldTokensDir = process.argv[3];
  const outputFilePath = process.argv[4];

  const newFiles = new Set(fs.readdirSync(newTokensDir).filter(file => file.endsWith('.json')));
  const oldFiles = new Set(fs.readdirSync(oldTokensDir).filter(file => file.endsWith('.json')));

  // Find common files in both new and old directories
  const commonFiles = [...newFiles].filter(file => oldFiles.has(file));

  const changes = [];

  for (const file of commonFiles) {
    const newPath = path.join(newTokensDir, file);
    const oldPath = path.join(oldTokensDir, file);
    const newContent = readJSONFile(newPath);
    const oldContent = readJSONFile(oldPath);

    if (!newContent || !oldContent) continue;

    const delta = diff(oldContent, newContent);
    if (delta) {
      const categorizedChanges = categorizeChanges(delta);
      changes.push({ file, changes: categorizedChanges });
    }
  }

  if (changes.length > 0) {
    fs.writeFileSync(outputFilePath, JSON.stringify(changes, null, 2));
    console.log('Changes detected and written successfully.');
  } else {
    fs.writeFileSync(outputFilePath, 'No changes to categorize.');
    console.log('No changes to categorize.');
  }
}

main();
*/

import { diff } from 'jsondiffpatch';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readJSONFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`Error reading JSON from ${filePath}:`, e);
    return null;
  }
}

function categorizeChanges(delta) {
  const changes = {
    added: [],
    modified: [],
    removed: []
  };

  function recursiveCategorize(delta, path = []) {
    for (const key in delta) {
      if (Array.isArray(delta[key])) {
        if (delta[key].length === 1 && delta[key][0] !== undefined) {
          changes.added.push({ path: [...path, key], value: delta[key][0] });
        } else if (delta[key].length === 1 && delta[key][0] === undefined) {
          changes.removed.push({ path: [...path, key] });
        } else if (delta[key].length === 2) {
          changes.modified.push({ path: [...path, key], oldValue: delta[key][0], newValue: delta[key][1] });
        }
      } else if (typeof delta[key] === 'object') {
        recursiveCategorize(delta[key], [...path, key]);
      }
    }
  }

  recursiveCategorize(delta);
  return changes;
}

async function main() {
  const newTokensDir = process.argv[2];
  const oldTokensDir = process.argv[3];
  const outputFilePath = process.argv[4];

  const newFiles = new Set(fs.readdirSync(newTokensDir).filter(file => file.endsWith('.json')));
  const oldFiles = new Set(fs.readdirSync(oldTokensDir).filter(file => file.endsWith('.json')));

  const allFiles = new Set([...newFiles, ...oldFiles]);

  const changes = [];

  for (const file of allFiles) {
    const newPath = path.join(newTokensDir, file);
    const oldPath = path.join(oldTokensDir, file);

    const newContent = fs.existsSync(newPath) ? readJSONFile(newPath) : {};
    const oldContent = fs.existsSync(oldPath) ? readJSONFile(oldPath) : {};

    const delta = diff(oldContent, newContent);
    if (delta) {
      const categorizedChanges = categorizeChanges(delta);
      changes.push({ file, changes: categorizedChanges });
    }
  }

  if (changes.length > 0) {
    fs.writeFileSync(outputFilePath, JSON.stringify(changes, null, 2));
    console.log('Changes detected and written successfully.');
  } else {
    fs.writeFileSync(outputFilePath, 'No changes to categorize.');
    console.log('No changes to categorize.');
  }
}

main();
