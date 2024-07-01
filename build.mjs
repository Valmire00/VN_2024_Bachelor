/*import StyleDictionary from 'style-dictionary';
import fs from 'fs';
import path from 'path';
import { registerTransforms } from '@tokens-studio/sd-transforms';

// Funktion zum Konvertieren der JSON-Daten in das Style Dictionary-Format
function convertJsonToStyleDictionaryFormat(data) {
  const result = {
    properties: {}
  };

  // Rekursive Funktion zum Durchlaufen der JSON-Datenstruktur
  function traverse(obj, path = []) {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Wenn das Objekt ein Token mit $value enthält
        if (value.value !== undefined) {
          let tokenName = path.concat(key).join('-');

          // Entfernen Sie führende Zahlen
          tokenName = tokenName.replace(/^\d+-/, '');

          result.properties[tokenName] = { value: value.value };
        } else {
          // Rekursiv durchlaufen, wenn es sich um ein verschachteltes Objekt handelt
          traverse(value, path.concat(key));
        }
      }
    });
  }

  traverse(data);
  return result;
}

// Definieren Sie den Pfad zur JSON-Datei
const variablesPath = path.resolve('tokens/variables2json.json');

// Laden der JSON-Datei
const rawdata = fs.readFileSync(variablesPath);
const jsonData = JSON.parse(rawdata);

// Überprüfen Sie die Struktur der JSON-Daten
console.log('Loaded JSON Data:', JSON.stringify(jsonData, null, 2));

// Konvertieren der JSON-Daten
const styleDictionaryData = convertJsonToStyleDictionaryFormat(jsonData);

// Überprüfen Sie die konvertierten Daten
console.log('Converted Style Dictionary Data:', JSON.stringify(styleDictionaryData, null, 2));

// Schreiben der konvertierten Daten in eine neue Datei
fs.writeFileSync('tokens/variables2json.json', JSON.stringify(styleDictionaryData, null, 2));

// Style Dictionary konfigurieren
registerTransforms(StyleDictionary, {
  casing: 'kebab',
});

const sd = StyleDictionary.extend({
  source: ['tokens/variables2json.json'],
  platforms: {
    css: {
      buildPath: 'dist/theme/',
      files: [
        {
          destination: 'design.token.css',
          format: 'css/variables',
        },
      ],
      transformGroup: 'tokens-studio',
    },
  },
});

console.log('Build started...');
sd.cleanAllPlatforms();
console.log('\n======================================');
sd.buildAllPlatforms();
console.log('\n======================================');
console.log('\nBuild completed!\n');

*/
// build.mjs
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
const combinedTokenData = {};

// Kombinieren der Token-Daten aus allen Dateien
tokenFiles.forEach(file => {
  const filePath = path.join(tokensFolderPath, file);
  const rawdata = fs.readFileSync(filePath);
  const jsonData = JSON.parse(rawdata);

  Object.keys(jsonData).forEach(key => {
    if (!combinedTokenData[key]) {
      combinedTokenData[key] = jsonData[key];
    } else {
      // Wenn der Schlüssel bereits existiert, kombinieren Sie die Daten
      Object.assign(combinedTokenData[key], jsonData[key]);
    }
  });
});

// Überprüfen Sie die Struktur der kombinierten JSON-Daten
console.log('Loaded JSON Data:', JSON.stringify(combinedTokenData, null, 2));

// Konvertieren der JSON-Daten
const styleDictionaryData = convertJsonToStyleDictionaryFormat(combinedTokenData);

// Überprüfen Sie die konvertierten Daten
console.log('Converted Style Dictionary Data:', JSON.stringify(styleDictionaryData, null, 2));

// Temporäre Datei erstellen, um die konvertierten Daten zu speichern
const tempFilePath = path.resolve('temp.tokens.json');
fs.writeFileSync(tempFilePath, JSON.stringify(styleDictionaryData, null, 2));

// Style Dictionary konfigurieren
registerTransforms(StyleDictionary, {
  casing: 'kebab',
});

const sd = StyleDictionary.extend({
  source: [`${tokensFolderPath}/*.json`],
  platforms: {
    css: {
      buildPath: 'dist/theme/',
      files: [
        {
          destination: 'design.token.css',
          format: 'css/variables',
        },
      ],
      transformGroup: 'tokens-studio',
    },
  },
});

console.log('Build started...');
sd.cleanAllPlatforms();
console.log('\n======================================');
sd.buildAllPlatforms();
console.log('\n======================================');
console.log('\nBuild completed!\n');

// Temporäre Datei nach dem Build entfernen
fs.unlinkSync(tempFilePath);
