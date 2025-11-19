const fs = require('fs');
const path = require('path');

// Читаємо поточний конфіг
const config = JSON.parse(fs.readFileSync('data/user-config.json', 'utf8'));

// Знаходимо всі sections/*.html файли
const sectionsDir = path.join(__dirname, 'sections');
const sectionFiles = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.html'));

let foundFields = new Set();

sectionFiles.forEach(file => {
  const content = fs.readFileSync(path.join(sectionsDir, file), 'utf8');

  // Знаходимо всі id="..."
  const matches = content.matchAll(/id="([^"]+)"/g);
  for (const match of matches) {
    const id = match[1];
    // Пропускаємо технічні id
    if (!id.includes('Upload') && !id.includes('Preview') && !id.includes('Empty') && !id.includes('Button')) {
      foundFields.add(id);
    }
  }
});

// Знаходимо відсутні поля
const missing = Array.from(foundFields).filter(field => !(field in config));

console.log('Всього полів у формах:', foundFields.size);
console.log('Є в конфігу:', foundFields.size - missing.length);
console.log('Відсутніх у конфігу:', missing.length);
console.log('');

if (missing.length > 0) {
  console.log('Відсутні поля:');
  missing.forEach(field => console.log('  -', field));
  console.log('');

  // Додаємо відсутні поля з дефолтними значеннями
  missing.forEach(field => {
    config[field] = '';
  });

  // Зберігаємо оновлений конфіг
  fs.writeFileSync('data/user-config.json', JSON.stringify(config, null, 2), 'utf8');
  console.log('✅ Додано', missing.length, 'полів в конфіг');
} else {
  console.log('✅ Всі поля присутні в конфігу');
}
