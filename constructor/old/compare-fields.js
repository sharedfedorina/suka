const fs = require('fs');
const path = require('path');

// Читаємо конфіг
const config = JSON.parse(fs.readFileSync('data/user-config.json', 'utf8'));
const configKeys = Object.keys(config);

// Знаходимо всі sections/*.html файли
const sectionsDir = path.join(__dirname, 'sections');
const sectionFiles = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.html'));

let formFields = new Set();

sectionFiles.forEach(file => {
  const content = fs.readFileSync(path.join(sectionsDir, file), 'utf8');

  // Знаходимо всі id="..."
  const matches = content.matchAll(/id="([^"]+)"/g);
  for (const match of matches) {
    const id = match[1];
    // Пропускаємо технічні id
    if (!id.includes('Upload') && !id.includes('Preview') && !id.includes('Empty') &&
        !id.includes('Button') && !id.includes('Img') && !id.includes('List') &&
        !id.includes('Input') && !id.includes('Display') && !id.includes('Checkboxes') &&
        !id.includes('Collapsible') && !id.includes('chevron') && !id.includes('Content')) {
      formFields.add(id);
    }
  }
});

// Знаходимо поля які є в конфігу але НЕ в формах
const inConfigNotInForm = configKeys.filter(k => !formFields.has(k));

// Знаходимо поля які є в формах але НЕ в конфігу
const inFormNotInConfig = Array.from(formFields).filter(f => !configKeys.includes(f));

console.log('═══════════════════════════════════════');
console.log('АНАЛІЗ ВІДПОВІДНОСТІ ПОЛІВ');
console.log('═══════════════════════════════════════');
console.log('');
console.log('📊 Статистика:');
console.log('  Полів в конфігу:', configKeys.length);
console.log('  Полів в формах:', formFields.size);
console.log('');
console.log('❌ В конфігу є, а в формах НЕМАЄ:', inConfigNotInForm.length);
if (inConfigNotInForm.length > 0) {
  console.log('  ', inConfigNotInForm.slice(0, 20).join(', '));
  if (inConfigNotInForm.length > 20) {
    console.log('   ... і ще', inConfigNotInForm.length - 20);
  }
}
console.log('');
console.log('⚠️  В формах є, а в конфігу НЕМАЄ:', inFormNotInConfig.length);
if (inFormNotInConfig.length > 0) {
  console.log('  ', inFormNotInConfig.join(', '));
}
