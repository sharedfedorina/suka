const fs = require('fs');
const path = require('path');

// Read user-config.json
const configPath = path.join(__dirname, 'data', 'user-config.json');
const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Read server.js
const serverPath = path.join(__dirname, 'server.js');
let serverCode = fs.readFileSync(serverPath, 'utf8');

// Read index.html to find all placeholders
const indexPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
const placeholders = [...new Set(indexHtml.match(/\{\{[^}]+\}\}/g) || [])];

console.log(`📋 Знайдено ${placeholders.length} плейсхолдерів в index.html\n`);

// Find placeholders that are NOT in server.js
const missing = [];
placeholders.forEach(placeholder => {
  const cleanName = placeholder.replace(/\{\{|\}\}/g, '');

  // Check if already processed in server.js
  const isReplaced = serverCode.includes(`'${placeholder}'`) ||
                     serverCode.includes(`"${placeholder}"`) ||
                     serverCode.includes(`\`${placeholder}\``);

  if (!isReplaced && userConfig[cleanName] !== undefined) {
    missing.push(cleanName);
  }
});

console.log(`❌ Відсутні плейсхолдери: ${missing.length}\n`);

if (missing.length === 0) {
  console.log('✅ Всі плейсхолдери вже обробляються!');
  process.exit(0);
}

// Generate code to add
let codeToAdd = '\n    // AUTO-GENERATED: Missing placeholders from user-config.json\n';

missing.forEach(fieldName => {
  const value = userConfig[fieldName];

  if (Array.isArray(value)) {
    // Skip arrays - they need special handling
    console.log(`⚠️  Пропускаю масив: ${fieldName}`);
  } else if (typeof value === 'object' && value !== null) {
    // Skip objects - they need special handling
    console.log(`⚠️  Пропускаю об'єкт: ${fieldName}`);
  } else {
    // Simple field - add placeholder replacement
    codeToAdd += `    html = html.replace('{{${fieldName}}}', dataObj.${fieldName} || '');\\n`;
    console.log(`✅ Додаю: ${fieldName}`);
  }
});

// Find where to insert (before the benefits section)
const insertMarker = '    // Замінити переваги (тільки з user-config.json)';
const insertPosition = serverCode.indexOf(insertMarker);

if (insertPosition === -1) {
  console.error('❌ Не знайдено маркер для вставки');
  process.exit(1);
}

// Insert code
serverCode = serverCode.substring(0, insertPosition) + codeToAdd + '\n' + serverCode.substring(insertPosition);

// Write back
fs.writeFileSync(serverPath, serverCode, 'utf8');

console.log(`\n✅ Додано ${missing.length - missing.filter(f => Array.isArray(userConfig[f]) || typeof userConfig[f] === 'object').length} рядків коду`);
console.log('Перезапустіть сервер!');
