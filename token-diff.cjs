const fs = require('fs');
const diff = require('deep-diff').diff;

const oldFile = JSON.parse(fs.readFileSync('old_tokens/new_tokens.json', 'utf8'));
const newFile = JSON.parse(fs.readFileSync('tokens/new_tokens.json', 'utf8'));

const differences = diff(oldFile, newFile);

if (differences) {
  differences.forEach(change => {
    if (change.kind === 'N') {
      console.log(`Neuer Token: ${change.path.join('.')} = ${change.rhs}`);
    } else if (change.kind === 'D') {
      console.log(`Gelöschter Token: ${change.path.join('.')}`);
    } else if (change.kind === 'E') {
      console.log(`Geänderter Token: ${change.path.join('.')} von ${change.lhs} zu ${change.rhs}`);
    }
  });
} else {
  console.log('Keine Änderungen.');
}

fs.writeFileSync('change_report.txt', JSON.stringify(differences, null, 2));
