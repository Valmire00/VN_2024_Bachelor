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
