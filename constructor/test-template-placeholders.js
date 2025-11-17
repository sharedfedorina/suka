/**
 * Юніт тест для перевірки placeholders в template.ejs
 * Перевіряє чи кожен placeholder з mapping файлу існує в template
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('🧪 ТЕСТ PLACEHOLDERS В TEMPLATE');
console.log('='.repeat(60) + '\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Завантажуємо mapping
const mappingPath = path.join(__dirname, 'config-to-placeholder-mapping.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Завантажуємо template
const templatePath = path.join(__dirname, 'views', 'template.ejs');
const templateContent = fs.readFileSync(templatePath, 'utf8');

console.log('📋 Перевірка основних placeholders...\n');

// Перевіряємо кожен placeholder з mapping
for (const [configKey, placeholder] of Object.entries(mapping.mapping)) {
  totalTests++;

  if (templateContent.includes(placeholder)) {
    passedTests++;
    console.log(`✅ PASS: ${configKey} -> ${placeholder}`);
  } else {
    failedTests++;
    console.log(`❌ FAIL: ${configKey} -> ${placeholder} НЕ ЗНАЙДЕНО в template`);
  }
}

console.log('\n📋 Перевірка спеціальних placeholders...\n');

// Перевіряємо спеціальні placeholders
for (const placeholder of mapping.specialPlaceholders.placeholders) {
  totalTests++;

  if (templateContent.includes(placeholder)) {
    passedTests++;
    console.log(`✅ PASS: ${placeholder} (спеціальний)`);
  } else {
    failedTests++;
    console.log(`❌ FAIL: ${placeholder} НЕ ЗНАЙДЕНО в template (спеціальний)`);
  }
}

// Зворотна перевірка: чи всі placeholders з template є в mapping
console.log('\n📋 Зворотна перевірка: чи всі placeholders з template є в mapping...\n');

const templatePlaceholders = templateContent.match(/\{\{[a-zA-Z0-9_]+\}\}/g) || [];
const uniquePlaceholders = [...new Set(templatePlaceholders)];

const allMappedPlaceholders = [
  ...Object.values(mapping.mapping),
  ...mapping.specialPlaceholders.placeholders
];

let unmappedCount = 0;

for (const placeholder of uniquePlaceholders) {
  if (!allMappedPlaceholders.includes(placeholder)) {
    unmappedCount++;
    console.log(`⚠️  WARNING: ${placeholder} є в template але ВІДСУТНІЙ в mapping`);
  }
}

if (unmappedCount === 0) {
  console.log('✅ Всі placeholders з template є в mapping');
}

// Підсумок
console.log('\n' + '='.repeat(60));
console.log('📊 РЕЗУЛЬТАТИ ТЕСТУВАННЯ');
console.log('='.repeat(60));
console.log(`Всього тестів: ${totalTests}`);
console.log(`✅ Пройдено: ${passedTests}`);
console.log(`❌ Провалено: ${failedTests}`);

if (unmappedCount > 0) {
  console.log(`⚠️  Не змаплено: ${unmappedCount}`);
}

console.log(`📈 Успішність: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log('='.repeat(60) + '\n');

if (failedTests === 0 && unmappedCount === 0) {
  console.log('🎉 ВСІ PLACEHOLDERS ВАЛІДНІ!');
  console.log('Кожен параметр з config має відповідний placeholder в template.\n');
  process.exit(0);
} else {
  console.log('❌ ДЕЯКІ PLACEHOLDERS ВІДСУТНІ АБО НЕ ЗМАПЛЕНІ');
  console.log('Перевір mapping файл та template.ejs\n');
  process.exit(1);
}
