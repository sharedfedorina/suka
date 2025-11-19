/**
 * Автоматична генерація mapping між user-config.json та template placeholders
 * Рекурсивно проходить ВСІ поля в config і генерує відповідні placeholders
 */

const fs = require('fs');
const path = require('path');

// Функція для конвертації назви поля в camelCase placeholder
function toCamelCase(str) {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toLowerCase());
}

// Рекурсивна функція для обходу об'єкта
function traverseObject(obj, parentKey = '', result = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = parentKey ? `${parentKey}.${key}` : key;

    if (Array.isArray(value)) {
      // Обробка масивів
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          // Об'єкти в масиві (benefits, products, etc.)
          traverseObject(item, `${currentPath}[${index}]`, result);
        } else {
          // Примітивні значення в масиві
          const placeholder = generatePlaceholder(currentPath, index);
          result[`${currentPath}[${index}]`] = placeholder;
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      // Рекурсивно обробляємо вкладені об'єкти
      traverseObject(value, currentPath, result);
    } else {
      // Примітивні значення
      const placeholder = generatePlaceholder(currentPath);
      result[currentPath] = placeholder;
    }
  }

  return result;
}

// Генерація placeholder з path
function generatePlaceholder(path, arrayIndex = null) {
  let parts = path.split('.');

  // Обробка масивів: benefits[0].title → benefit1Title
  if (path.includes('[') && path.includes(']')) {
    const match = path.match(/([a-zA-Z]+)\[(\d+)\]\.?(.+)?/);
    if (match) {
      const [, arrayName, index, field] = match;
      const itemNumber = parseInt(index) + 1;

      // Видаляємо 's' з кінця якщо є (benefits → benefit)
      const singularName = arrayName.endsWith('s')
        ? arrayName.slice(0, -1)
        : arrayName;

      if (field) {
        // benefits[0].title → benefit1Title
        const fieldCamel = field.charAt(0).toUpperCase() + field.slice(1);
        return `{{${singularName}${itemNumber}${fieldCamel}}}`;
      } else {
        // benefits[0] → benefit1
        return `{{${singularName}${itemNumber}}}`;
      }
    }
  }

  // Звичайні поля: page.title → pageTitle
  if (parts.length > 1) {
    const combined = parts.map((part, i) =>
      i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    ).join('');
    return `{{${combined}}}`;
  }

  // Прості поля: headerText → {{headerText}}
  return `{{${path}}}`;
}

// Завантажити user-config.json
const configPath = path.join(__dirname, 'data', 'user-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('\n' + '='.repeat(60));
console.log('🔄 АВТОМАТИЧНА ГЕНЕРАЦІЯ MAPPING');
console.log('='.repeat(60) + '\n');

// Генерувати mapping
const mapping = traverseObject(config);

console.log(`✅ Знайдено ${Object.keys(mapping).length} полів в user-config.json\n`);

// Створити mapping файл
const outputMapping = {
  description: "Auto-generated mapping between user-config.json parameters and template.ejs placeholders",
  generatedAt: new Date().toISOString(),
  totalFields: Object.keys(mapping).length,
  mapping: mapping
};

const outputPath = path.join(__dirname, 'config-to-placeholder-mapping-AUTO.json');
fs.writeFileSync(outputPath, JSON.stringify(outputMapping, null, 2), 'utf8');

console.log(`📝 Mapping збережено в: config-to-placeholder-mapping-AUTO.json`);
console.log('\n📋 Приклади згенерованих mappings:\n');

// Показати перші 20 прикладів
const entries = Object.entries(mapping);
entries.slice(0, 20).forEach(([key, value]) => {
  console.log(`  ${key.padEnd(40)} → ${value}`);
});

if (entries.length > 20) {
  console.log(`  ... та ще ${entries.length - 20} полів`);
}

console.log('\n' + '='.repeat(60) + '\n');
