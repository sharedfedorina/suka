const fs = require('fs');
const path = require('path');

// Читаємо конфіг
const config = JSON.parse(fs.readFileSync('data/user-config.json', 'utf8'));

// Знаходимо всі sections/*.html файли
const sectionsDir = path.join(__dirname, 'sections');
const sectionFiles = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.html'));

let formFields = new Set();

sectionFiles.forEach(file => {
  const content = fs.readFileSync(path.join(sectionsDir, file), 'utf8');
  const matches = content.matchAll(/id="([^"]+)"/g);
  for (const match of matches) {
    formFields.add(match[1]);
  }
});

// Залишаємо тільки поля які є в формах
const cleanConfig = {};
Object.keys(config).forEach(key => {
  if (formFields.has(key)) {
    cleanConfig[key] = config[key];
  }
});

// Бекап старого конфігу
fs.writeFileSync('data/user-config.backup-before-clean.json', JSON.stringify(config, null, 2), 'utf8');

// Зберігаємо чистий конфіг
fs.writeFileSync('data/user-config.json', JSON.stringify(cleanConfig, null, 2), 'utf8');

console.log('✅ Було полів:', Object.keys(config).length);
console.log('✅ Залишилось полів:', Object.keys(cleanConfig).length);
console.log('✅ Видалено зайвих полів:', Object.keys(config).length - Object.keys(cleanConfig).length);
console.log('✅ Бекап збережено в user-config.backup-before-clean.json');
