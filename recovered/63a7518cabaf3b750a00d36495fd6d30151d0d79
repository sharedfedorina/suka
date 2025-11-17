const fs = require('fs');
const path = require('path');

// Read index.html
const indexPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');

// Find all placeholders in index.html
const placeholders = indexHtml.match(/\{\{[^}]+\}\}/g) || [];
const uniquePlaceholders = [...new Set(placeholders)];

console.log(`📋 Знайдено ${uniquePlaceholders.length} унікальних плейсхолдерів в index.html:\n`);
uniquePlaceholders.sort().forEach(p => console.log(`  ${p}`));

// Read server.js
const serverPath = path.join(__dirname, 'server.js');
const serverCode = fs.readFileSync(serverPath, 'utf8');

// Check which placeholders are NOT being replaced in server.js
console.log('\n\n❌ Плейсхолдери БЕЗ обробки в server.js:\n');
let missingCount = 0;

uniquePlaceholders.forEach(placeholder => {
  const cleanName = placeholder.replace(/\{\{|\}\}/g, '');

  // Check if this placeholder is being replaced in server.js
  const isReplaced = serverCode.includes(`'${placeholder}'`) ||
                     serverCode.includes(`"${placeholder}"`) ||
                     serverCode.includes(`\`${placeholder}\``);

  if (!isReplaced) {
    console.log(`  ${placeholder}`);
    missingCount++;
  }
});

console.log(`\n\n📊 Підсумок:`);
console.log(`   Всього плейсхолдерів: ${uniquePlaceholders.length}`);
console.log(`   Без обробки: ${missingCount}`);
console.log(`   З обробкою: ${uniquePlaceholders.length - missingCount}`);
