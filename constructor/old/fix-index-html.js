const fs = require('fs');
const path = require('path');

// Читаємо user-config.json
const configPath = path.join(__dirname, 'data', 'user-config.json');
const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Читаємо index.html
const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

console.log('🔧 Починаю автоматичне виправлення index.html...\n');

let changesCount = 0;

// Функція для екранування спецсимволів у regex
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Пройдемось по ВСІХ полях з user-config.json
Object.keys(userConfig).forEach(key => {
  const value = userConfig[key];

  // Пропускаємо масиви та булеві значення
  if (Array.isArray(value) || typeof value === 'boolean') {
    return;
  }

  // Пропускаємо пусті значення
  if (!value || value.trim() === '') {
    return;
  }

  // Створюємо placeholder
  const placeholder = `{{${key}}}`;

  // Перевіряємо чи placeholder вже є
  if (html.includes(placeholder)) {
    return; // Вже є placeholder
  }

  // Шукаємо точне значення в HTML і замінюємо на placeholder
  const escapedValue = escapeRegex(value);
  const regex = new RegExp(escapedValue, 'g');

  const matchCount = (html.match(regex) || []).length;

  if (matchCount > 0) {
    html = html.replace(regex, placeholder);
    console.log(`✅ ${key}: замінено ${matchCount} входжень`);
    changesCount += matchCount;
  }
});

// Записуємо оновлений HTML
fs.writeFileSync(indexPath, html, 'utf8');

console.log(`\n✅ ЗАВЕРШЕНО! Замінено ${changesCount} значень на placeholders`);
console.log(`Тепер запустіть check-all-fields.js для перевірки`);
