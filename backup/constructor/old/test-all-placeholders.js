/**
 * Тест для перевірки ВСІХ placeholders з auto-generated mapping
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('🧪 ТЕСТ ВСІХ PLACEHOLDERS З AUTO-MAPPING');
console.log('='.repeat(60) + '\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Завантажуємо auto-generated mapping
const mappingPath = path.join(__dirname, 'config-to-placeholder-mapping-AUTO.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Завантажуємо template
const templatePath = path.join(__dirname, 'views', 'template.ejs');
const templateContent = fs.readFileSync(templatePath, 'utf8');

console.log(`📊 Всього полів в config: ${mapping.totalFields}`);
console.log(`📅 Згенеровано: ${new Date(mapping.generatedAt).toLocaleString('uk-UA')}\n`);

console.log('📋 Перевірка кожного placeholder...\n');

const failed = [];
const passed = [];

// Перевіряємо кожен placeholder
for (const [configKey, placeholder] of Object.entries(mapping.mapping)) {
  totalTests++;

  if (templateContent.includes(placeholder)) {
    passedTests++;
    passed.push({ configKey, placeholder });
    console.log(`✅ ${configKey.padEnd(45)} → ${placeholder}`);
  } else {
    failedTests++;
    failed.push({ configKey, placeholder });
    console.log(`❌ ${configKey.padEnd(45)} → ${placeholder} НЕ ЗНАЙДЕНО`);
  }
}

// Зворотна перевірка: placeholders в template що не в mapping
console.log('\n📋 Зворотна перевірка: placeholders в template без mapping...\n');

const templatePlaceholders = templateContent.match(/\{\{[a-zA-Z0-9_]+\}\}/g) || [];
const uniquePlaceholders = [...new Set(templatePlaceholders)];
const mappedPlaceholders = Object.values(mapping.mapping);

let unmappedCount = 0;
const unmapped = [];

for (const placeholder of uniquePlaceholders) {
  if (!mappedPlaceholders.includes(placeholder)) {
    unmappedCount++;
    unmapped.push(placeholder);
    console.log(`⚠️  ${placeholder} є в template але ВІДСУТНІЙ в config`);
  }
}

if (unmappedCount === 0) {
  console.log('✅ Всі placeholders з template мають відповідність в config');
}

// Підсумок
console.log('\n' + '='.repeat(60));
console.log('📊 РЕЗУЛЬТАТИ ТЕСТУВАННЯ');
console.log('='.repeat(60));
console.log(`Всього тестів: ${totalTests}`);
console.log(`✅ Пройдено: ${passedTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
console.log(`❌ Провалено: ${failedTests} (${((failedTests / totalTests) * 100).toFixed(1)}%)`);

if (unmappedCount > 0) {
  console.log(`⚠️  Не змаплено: ${unmappedCount}`);
}

console.log('='.repeat(60));

// Детальний звіт провалених
if (failedTests > 0) {
  console.log('\n' + '='.repeat(60));
  console.log('❌ ПРОВАЛЕНІ ТЕСТИ (placeholders відсутні в template):');
  console.log('='.repeat(60));
  failed.forEach(({ configKey, placeholder }) => {
    console.log(`  ${configKey} → ${placeholder}`);
  });
}

// Детальний звіт не змаплених
if (unmappedCount > 0) {
  console.log('\n' + '='.repeat(60));
  console.log('⚠️  PLACEHOLDERS В TEMPLATE БЕЗ ВІДПОВІДНОСТІ В CONFIG:');
  console.log('='.repeat(60));
  unmapped.forEach(placeholder => {
    console.log(`  ${placeholder}`);
  });
}

console.log('\n' + '='.repeat(60) + '\n');

if (failedTests === 0 && unmappedCount === 0) {
  console.log('🎉 ВСІ PLACEHOLDERS ВАЛІДНІ!');
  console.log('Кожен параметр з config має відповідний placeholder в template.\n');
  process.exit(0);
} else {
  console.log('❌ ЗНАЙДЕНО ПРОБЛЕМИ З PLACEHOLDERS');
  console.log('Перевір template.ejs та server.js\n');
  process.exit(1);
}
