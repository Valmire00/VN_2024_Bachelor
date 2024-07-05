import StyleDictionary from 'style-dictionary';
import fs from 'fs';
import path from 'path';
import { registerTransforms } from '@tokens-studio/sd-transforms';

// Funktion zum Konvertieren der JSON-Daten in das Style Dictionary-Format
function convertJsonToStyleDictionaryFormat(data) {
  const result = {};

  // Rekursive Funktion zum Durchlaufen der JSON-Datenstruktur
  function traverse(obj, parentKey = '') {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      // Entfernen Sie führende Zahlen
      let newKey = parentKey ? `${parentKey}-${key}` : key;
      newKey = newKey.replace(/^\d+-/, '');

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Wenn das Objekt ein Token mit value enthält
        if (value.value !== undefined) {
          result[newKey] = { value: value.value };
        } else {
          // Rekursiv durchlaufen, wenn es sich um ein verschachteltes Objekt handelt
          traverse(value, newKey);
        }
      }
    });
  }

  traverse(data);
  return { properties: result };
}

// Definieren Sie den Pfad zum Tokens-Ordner
const tokensFolderPath = path.resolve('tokens');

// Laden aller JSON-Dateien im Tokens-Ordner
const tokenFiles = fs.readdirSync(tokensFolderPath).filter(file => file.endsWith('.json'));

tokenFiles.forEach(file => {
  const filePath = path.join(tokensFolderPath, file);
  const rawdata = fs.readFileSync(filePath);
  const jsonData = JSON.parse(rawdata);

  // Konvertieren der JSON-Daten
  const styleDictionaryData = convertJsonToStyleDictionaryFormat(jsonData);

  // Temporäre Datei erstellen, um die konvertierten Daten zu speichern
  const tempFilePath = path.resolve(`temp_${file}`);
  fs.writeFileSync(tempFilePath, JSON.stringify(styleDictionaryData, null, 2));

  // Style Dictionary konfigurieren
  registerTransforms(StyleDictionary, {
    casing: 'kebab',
  });

  const sd = StyleDictionary.extend({
    source: [tempFilePath],
    platforms: {
      css: {
        buildPath: 'dist/theme/',
        files: [
          {
            destination: `${file.replace('.json', '.css')}`,
            format: 'css/variables',
          },
        ],
        transformGroup: 'tokens-studio',
      },
    },
  });

  console.log(`Build started for ${file}...`);
  sd.cleanAllPlatforms();
  sd.buildAllPlatforms();
  console.log(`Build completed for ${file}!`);

  // Temporäre Datei nach dem Build entfernen
  fs.unlinkSync(tempFilePath);
});

console.log('\nAll builds completed!\n');
