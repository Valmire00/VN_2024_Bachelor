const fs = require('fs');
const path = require('path');

const inputFilePath = path.resolve(__dirname, 'tokens.json');
const outputFilePath = path.resolve(__dirname, 'dist', 'tokens.css');

fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    process.exit(1);
  }

  const tokens = JSON.parse(data);
  let cssContent = '';

  for (const [key, value] of Object.entries(tokens)) {
    cssContent += `--${key}: ${value};\n`;
  }

  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
  fs.writeFile(outputFilePath, cssContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing CSS file:', err);
      process.exit(1);
    }
    console.log('CSS file created successfully at', outputFilePath);
  });
});
