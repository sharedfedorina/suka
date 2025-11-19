const fs = require('fs');
const path = require('path');

// Поля з форм
const sectionsDir = path.join(__dirname, 'sections');
const formFields = new Set();
fs.readdirSync(sectionsDir).filter(f => f.endsWith('.html')).forEach(file => {
  const content = fs.readFileSync(path.join(sectionsDir, file), 'utf8');
  const matches = content.matchAll(/id="([^"]+)"/g);
  for (const match of matches) {
    const id = match[1];
    // Фільтруємо технічні поля
    if (!id.includes('section-') && !id.includes('Upload') && !id.includes('Preview') &&
        !id.includes('Empty') && !id.includes('Img') && !id.includes('List') &&
        !id.includes('Display') && !id.includes('Checkboxes') && !id.includes('Collapsible') &&
        !id.includes('chevron') && !id.includes('Content') && !id.includes('Input') &&
        !id.includes('Button')) {
      formFields.add(id);
    }
  }
});

// Плейсхолдери з модулів
const modulesDir = path.join(__dirname, 'modules');
const placeholders = new Set();
fs.readdirSync(modulesDir).filter(f => f.endsWith('.html')).forEach(file => {
  const content = fs.readFileSync(path.join(modulesDir, file), 'utf8');
  const matches = content.matchAll(/\{\{([^}]+)\}\}/g);
  for (const match of matches) {
    const placeholder = match[1].trim();
    if (!placeholder.startsWith('MODULE_')) {
      placeholders.add(placeholder);
    }
  }
});

// Які важливі поля немає в темплейтах
const inFormNotInTemplates = [...formFields].filter(f => !placeholders.has(f));

// Групуємо за секціями
const grouped = {};

inFormNotInTemplates.forEach(field => {
  // Визначаємо секцію
  let section = 'Інше';
  if (field.includes('hero') || field.includes('Hero')) section = 'Hero';
  else if (field.includes('product')) section = 'Products';
  else if (field.includes('benefit')) section = 'Benefits';
  else if (field.includes('tab')) section = 'Tabs';
  else if (field.includes('comment') || field.includes('review')) section = 'Comments/Reviews';
  else if (field.includes('faq')) section = 'FAQ';
  else if (field.includes('request')) section = 'Request';
  else if (field.includes('footer')) section = 'Footer';
  else if (field.includes('timer') || field.includes('stock')) section = 'Timer/Stock';
  else if (field.includes('enable')) section = 'Enable/Disable';
  else if (field.includes('how')) section = 'HowTo';

  if (!grouped[section]) grouped[section] = [];
  grouped[section].push(field);
});

console.log('ПОЛЯ З ФОРМИ БЕЗ ПЛЕЙСХОЛДЕРІВ В ТЕМПЛЕЙТАХ:');
console.log('═════════════════════════════════════════════');
console.log(`Всього: ${inFormNotInTemplates.length} полів`);
console.log('');

Object.keys(grouped).sort().forEach(section => {
  console.log(`\n📁 ${section} (${grouped[section].length}):`);
  grouped[section].forEach(f => console.log(`   - ${f}`));
});