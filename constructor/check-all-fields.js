const fs = require('fs');
const path = require('path');

// Читаємо user-config.json
const configPath = path.join(__dirname, 'data', 'user-config.json');
const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Читаємо server.js
const serverPath = path.join(__dirname, 'server.js');
const serverCode = fs.readFileSync(serverPath, 'utf8');

// Extract generateHTML function
const generateHTMLMatch = serverCode.match(/function generateHTML\(dataObj, options = \{\}\) \{[\s\S]*?^}/m);
if (!generateHTMLMatch) {
  console.error('❌ Не знайдено функцію generateHTML');
  process.exit(1);
}
const generateHTMLCode = generateHTMLMatch[0];

console.log('🔍 ПЕРЕВІРКА ВСІХ ПАРАМЕТРІВ З user-config.json\n');
console.log('='.repeat(80));

const allKeys = Object.keys(userConfig);
const missing = [];
const found = [];

allKeys.forEach(key => {
  // Skip arrays (як benefits, commentsImages) - вони обробляються окремо
  if (Array.isArray(userConfig[key])) {
    // Check if array is processed
    if (generateHTMLCode.includes(`options.${key}`) || generateHTMLCode.includes(`options['${key}']`)) {
      found.push(key);
      console.log(`✅ ${key} - OK (array)`);
    } else {
      missing.push(key);
      console.log(`❌ ${key} - ВІДСУТНЄ в generateHTML (array)`);
    }
    return;
  }

  // Check if key is used in generateHTML
  // Patterns: options.KEY or options['KEY'] or options[`KEY`]
  const pattern1 = new RegExp(`options\\.${key}\\b`);
  const pattern2 = new RegExp(`options\\['${key}'\\]`);
  const pattern3 = new RegExp(`options\\[\`${key}\`\\]`);
  const pattern4 = new RegExp(`\\{\\{${key}\\}\\}`); // Також check placeholder

  if (pattern1.test(generateHTMLCode) || pattern2.test(generateHTMLCode) || pattern3.test(generateHTMLCode) || pattern4.test(generateHTMLCode)) {
    found.push(key);
    console.log(`✅ ${key} - OK`);
  } else {
    missing.push(key);
    console.log(`❌ ${key} - ВІДСУТНЄ в generateHTML`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n📊 РЕЗУЛЬТАТ:`);
console.log(`   ✅ Знайдено: ${found.length}/${allKeys.length}`);
console.log(`   ❌ Відсутні: ${missing.length}/${allKeys.length}`);

if (missing.length > 0) {
  console.log(`\n❌ ВІДСУТНІ ПАРАМЕТРИ (${missing.length}):`);
  missing.forEach(key => {
    console.log(`   - ${key}: "${userConfig[key]}"`);
  });
  process.exit(1);
} else {
  console.log('\n✅ ВСІ ПАРАМЕТРИ ПРИСУТНІ!');
  process.exit(0);
}
