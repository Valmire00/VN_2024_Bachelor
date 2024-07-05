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
/*
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
      if (Array.isArray(delta[key]) && delta[key].length === 1) {
        // Added key
        categorizedChanges.added.push({ file, key, value: delta[key][0] });
      } else if (Array.isArray(delta[key]) && delta[key].length === 1 && delta[key][0] === undefined) {
        // Removed key
        categorizedChanges.removed.push({ file, key });
      } else if (Array.isArray(delta[key]) && delta[key].length === 2) {
        // Modified key
        categorizedChanges.modified.push({ file, key, oldValue: delta[key][0], newValue: delta[key][1] });
      } else {
        // Modified key (detailed changes)
        categorizedChanges.modified.push({ file, key, changes: delta[key] });
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
      if (change.oldValue !== undefined && change.newValue !== undefined) {
        output += `File: ${change.file}, Key: ${change.key}, Old Value: ${JSON.stringify(change.oldValue, null, 2)}, New Value: ${JSON.stringify(change.newValue, null, 2)}\n`;
      } else {
        output += `File: ${change.file}, Key: ${change.key}, Changes: ${JSON.stringify(change.changes, null, 2)}\n`;
      }
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
*/
/*import fs from 'fs';
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
      if (Array.isArray(delta[key]) && delta[key].length === 1) {
        // Added key
        categorizedChanges.added.push({ file, key, value: delta[key][0] });
      } else if (Array.isArray(delta[key]) && delta[key].length === 1 && delta[key][0] === undefined) {
        // Removed key
        categorizedChanges.removed.push({ file, key });
      } else if (Array.isArray(delta[key]) && delta[key].length === 2) {
        // Modified key
        categorizedChanges.modified.push({ file, key, oldValue: delta[key][0], newValue: delta[key][1] });
      } else {
        // Modified key (detailed changes)
        categorizedChanges.modified.push({ file, key, changes: delta[key] });
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
      if (change.oldValue !== undefined && change.newValue !== undefined) {
        output += `File: ${change.file}, Key: ${change.key}, Old Value: ${JSON.stringify(change.oldValue, null, 2)}, New Value: ${JSON.stringify(change.newValue, null, 2)}\n`;
      } else {
        output += `File: ${change.file}, Key: ${change.key}, Changes: ${JSON.stringify(change.changes, null, 2)}\n`;
      }
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
*/

import { fileURLToPath } from 'url';
/*

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
      const changeType = detectChangeType(delta[key]);
      switch (changeType) {
        case 'added':
          categorizedChanges.added.push({ file, key, value: delta[key][0] });
          break;
        case 'removed':
          categorizedChanges.removed.push({ file, key });
          break;
        case 'modified':
          categorizedChanges.modified.push({ file, key, oldValue: delta[key][0], newValue: delta[key][1] });
          break;
        case 'detailed':
          categorizedChanges.modified.push({ file, key, changes: delta[key] });
          break;
      }
    });
  });

  let output = '';
  if (categorizedChanges.added.length > 0) {
    output += 'Added:\n';
    categorizedChanges.added.forEach(change => {
      output += `Added - File: ${change.file}, Key: ${change.key}, Value: ${JSON.stringify(change.value, null, 2)}\n`;
    });
  }

  if (categorizedChanges.modified.length > 0) {
    output += 'Modified:\n';
    categorizedChanges.modified.forEach(change => {
      if (change.oldValue !== undefined && change.newValue !== undefined) {
        output += `Modified - File: ${change.file}, Key: ${change.key}, Old Value: ${JSON.stringify(change.oldValue, null, 2)}, New Value: ${JSON.stringify(change.newValue, null, 2)}\n`;
      } else {
        output += `Modified - File: ${change.file}, Key: ${change.key}, Changes: ${JSON.stringify(change.changes, null, 2)}\n`;
      }
    });
  }

  if (categorizedChanges.removed.length > 0) {
    output += 'Removed:\n';
    categorizedChanges.removed.forEach(change => {
      output += `Removed - File: ${change.file}, Key: ${change.key}\n`;
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

function detectChangeType(delta) {
  if (Array.isArray(delta)) {
    if (delta.length === 1 && delta[0] !== undefined) return 'added';
    if (delta.length === 1 && delta[0] === undefined) return 'removed';
    if (delta.length === 2) return 'modified';
  }
  if (typeof delta === 'object' && delta !== null) {
    return 'detailed';
  }
  return 'modified';
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
*/

/* -- ist bisher der beste Ansatz.
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
  let output = '';

  changesData.forEach(change => {
    const { file, changes: categorizedChanges } = change;

    if (categorizedChanges.added.length > 0) {
      output += 'Added:\n';
      categorizedChanges.added.forEach(change => {
        output += `Added - File: ${file}, Path: ${change.path.join('.')}, Value: ${JSON.stringify(change.value, null, 2)}\n`;
      });
    }

    if (categorizedChanges.modified.length > 0) {
      output += 'Modified:\n';
      categorizedChanges.modified.forEach(change => {
        output += `Modified - File: ${file}, Path: ${change.path.join('.')}, Old Value: ${JSON.stringify(change.oldValue, null, 2)}, New Value: ${JSON.stringify(change.newValue, null, 2)}\n`;
      });
    }

    if (categorizedChanges.removed.length > 0) {
      output += 'Removed:\n';
      categorizedChanges.removed.forEach(change => {
        output += `Removed - File: ${file}, Path: ${change.path.join('.')}\n`;
      });
    }
  });

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
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  let output = '';

  changesData.forEach(change => {
    const { file, changes: categorizedChanges } = change;

    if (categorizedChanges.added.length > 0) {
      output += 'Added:\n';
      categorizedChanges.added.forEach(change => {
        output += `Added - File: ${file}, Path: ${change.path.join('.')}, Value: ${JSON.stringify(change.value, null, 2)}\n`;
      });
    }

    if (categorizedChanges.modified.length > 0) {
      output += 'Modified:\n';
      categorizedChanges.modified.forEach(change => {
        output += `Modified - File: ${file}, Path: ${change.path.join('.')}, Old Value: ${JSON.stringify(change.oldValue, null, 2)}, New Value: ${JSON.stringify(change.newValue, null, 2)}\n`;
      });
    }

    if (categorizedChanges.removed.length > 0) {
      output += 'Removed:\n';
      categorizedChanges.removed.forEach(change => {
        output += `Removed - File: ${file}, Path: ${change.path.join('.')}\n`;
      });
    }
  });

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
