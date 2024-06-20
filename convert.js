const fs = require('fs');
const path = require('path');

const inputFilePath = path.resolve(__dirname, 'tokens.json');
const outputFilePath = path.resolve(__dirname, 'dist', 'tokens.css');

// Funktion zum Auflösen von Token-Referenzen
function resolveReferences(obj, map = new Map()) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      resolveReferences(obj[key], map);
    } else if (key === 'value') {
      map.set(obj[key], key);
    }
  }
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      for (const k in obj[key]) {
        if (typeof obj[key][k] === 'string' && map.has(obj[key][k])) {
          obj[key][k] = obj[key][k].replace(/{(.*?)}/g, (_, v) => obj[v]?.value || v);
        }
      }
    }
  }
  return obj;
}

fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    process.exit(1);
  }

  let tokens;
  try {
    tokens = JSON.parse(data);
  } catch (jsonErr) {
    console.error('Error parsing JSON:', jsonErr);
    process.exit(1);
  }

  tokens = resolveReferences(tokens);

  let cssContent = '';
  function processTokens(obj, prefix = '') {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null && obj[key].value) {
        cssContent += `--${prefix}${key}: ${obj[key].value};\n`;
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        processTokens(obj[key], `${prefix}${key}-`);
      }
    }
  }

  processTokens(tokens);

  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
  fs.writeFile(outputFilePath, cssContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing CSS file:', err);
      process.exit(1);
    }
    console.log('CSS file created successfully at', outputFilePath);
  });
});
