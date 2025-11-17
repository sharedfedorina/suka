const fs = require('fs');
const path = require('path');

// Read user-config.json
const configPath = path.join(__dirname, 'data', 'user-config.json');
const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Read server.js
const serverPath = path.join(__dirname, 'server.js');
let serverCode = fs.readFileSync(serverPath, 'utf8');

// Read index.html
const indexPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

console.log('🔧 Додаю відсутні параметри до server.js та index.html...\n');

// Find the generateHTML function
const generateHTMLMatch = serverCode.match(/function generateHTML\(dataObj, options = \{\}\) \{[\s\S]*?^}/m);
if (!generateHTMLMatch) {
  console.error('❌ Не знайдено функцію generateHTML');
  process.exit(1);
}

const allKeys = Object.keys(userConfig);
const missing = [];

allKeys.forEach(key => {
  const value = userConfig[key];

  // Skip arrays and objects - special handling
  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
    const isInServer = serverCode.includes(`options.${key}`) ||
                       serverCode.includes(`options['${key}']`) ||
                       serverCode.includes(`dataObj.${key}`);
    if (!isInServer) {
      missing.push({ key, value, type: Array.isArray(value) ? 'array' : 'object' });
    }
    return;
  }

  // Check if parameter is processed
  const inServer = serverCode.includes(`options.${key}`) ||
                   serverCode.includes(`options['${key}']`) ||
                   serverCode.includes(`dataObj.${key}`) ||
                   serverCode.includes(`options[\`${key}\`]`);

  const placeholder = `{{${key}}}`;
  const inHtml = indexHtml.includes(placeholder);

  if (!inServer && !inHtml) {
    missing.push({ key, value, type: 'simple' });
  }
});

if (missing.length === 0) {
  console.log('✅ Всі параметри вже присутні!');
  process.exit(0);
}

console.log(`📋 Знайдено ${missing.length} відсутніх параметрів\n`);

// Find where to insert new code in server.js (after existing placeholder processing)
const insertMarker = '    // Замінити плейсхолдери для хедер текст, титл, ціна';
const insertPosition = serverCode.indexOf(insertMarker);

if (insertPosition === -1) {
  console.error('❌ Не знайдено позицію для вставки коду');
  process.exit(1);
}

// Build code to add
let codeToAdd = '\n    // Auto-generated missing parameters\n';
let htmlReplacements = '';

missing.forEach(({ key, value, type }) => {
  if (type === 'array' || type === 'object') {
    // Arrays and objects: simple fallback
    codeToAdd += `    const ${key} = options.${key} || dataObj.${key} || ${type === 'array' ? '[]' : '{}'};\n`;
    console.log(`✅ ${key} (${type})`);
  } else if (typeof value === 'boolean') {
    // Boolean values
    codeToAdd += `    const ${key} = (options.${key} !== undefined) ? options.${key} : (dataObj.${key} !== undefined ? dataObj.${key} : ${value});\n`;
    console.log(`✅ ${key} (boolean)`);
  } else {
    // String values
    const defaultValue = value === '' ? '' : value;
    codeToAdd += `    const ${key} = (options.${key} && options.${key}.trim()) ? options.${key} : (dataObj.${key} || '${defaultValue}');\n`;
    htmlReplacements += `    html = html.replace(/\\{\\{${key}\\}\\}/g, ${key});\n`;
    console.log(`✅ ${key}`);
  }
});

codeToAdd += htmlReplacements;

// Insert code after the marker line
const lines = serverCode.split('\n');
let insertLineIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes(insertMarker)) {
    insertLineIndex = i + 1;
    break;
  }
}

if (insertLineIndex === -1) {
  console.error('❌ Не знайдено рядок для вставки');
  process.exit(1);
}

lines.splice(insertLineIndex, 0, codeToAdd);
serverCode = lines.join('\n');

// Write back
fs.writeFileSync(serverPath, serverCode, 'utf8');

console.log(`\n✅ Додано ${missing.length} параметрів до server.js`);
console.log('Тепер запустіть verify-all-params.js для перевірки');
