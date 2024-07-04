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
