const fs = require('fs');
const path = require('path');

// ============================================================================
// 1. ЗБИРАЄМО ПОЛЯ З ФОРМИ (sections/*.html)
// ============================================================================
function getFormFields() {
  const sectionsDir = path.join(__dirname, 'sections');
  const sectionFiles = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.html'));
  const fields = new Set();

  sectionFiles.forEach(file => {
    const content = fs.readFileSync(path.join(sectionsDir, file), 'utf8');
    const matches = content.matchAll(/id="([^"]+)"/g);

    for (const match of matches) {
      const id = match[1];
      // Фільтруємо тільки справжні поля форми
      if (!id.includes('section-') &&
          !id.includes('Upload') &&
          !id.includes('Preview') &&
          !id.includes('Empty') &&
          !id.includes('Img') &&
          !id.includes('List') &&
          !id.includes('Display') &&
          !id.includes('Checkboxes') &&
          !id.includes('Collapsible') &&
          !id.includes('chevron') &&
          !id.includes('Content') &&
          !id.includes('Input') &&
          !id.includes('Button')) {
        fields.add(id);
      }
    }
  });

  return fields;
}

// ============================================================================
// 2. ЗБИРАЄМО КЛЮЧІ З КОНФІГУ
// ============================================================================
function getConfigKeys() {
  const config = JSON.parse(fs.readFileSync('data/user-config.json', 'utf8'));
  return new Set(Object.keys(config));
}

// ============================================================================
// 3. ЗБИРАЄМО ПЛЕЙСХОЛДЕРИ З ТЕМПЛЕЙТІВ (modules/*.html)
// ============================================================================
function getTemplatePlaceholders() {
  const modulesDir = path.join(__dirname, 'modules');
  const moduleFiles = fs.readdirSync(modulesDir).filter(f => f.endsWith('.html'));
  const placeholders = new Set();

  moduleFiles.forEach(file => {
    const content = fs.readFileSync(path.join(modulesDir, file), 'utf8');
    const matches = content.matchAll(/\{\{([^}]+)\}\}/g);

    for (const match of matches) {
      const placeholder = match[1].trim();
      // Пропускаємо MODULE_ плейсхолдери (вони для збирання модулів)
      if (!placeholder.startsWith('MODULE_')) {
        placeholders.add(placeholder);
      }
    }
  });

  return placeholders;
}

// ============================================================================
// 4. АНАЛІЗУЄМО
// ============================================================================
const formFields = getFormFields();
const configKeys = getConfigKeys();
const placeholders = getTemplatePlaceholders();

console.log('');
console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║         АНАЛІЗ СИНХРОНІЗАЦІЇ ПОЛІВ ТА ПЛЕЙСХОЛДЕРІВ       ║');
console.log('╚══════════════════════════════════════════════════════════╝');
console.log('');

console.log('📊 ЗАГАЛЬНА СТАТИСТИКА:');
console.log('───────────────────────');
console.log(`  Полів у формі (sections/*.html):     ${formFields.size}`);
console.log(`  Ключів у конфігу (user-config.json): ${configKeys.size}`);
console.log(`  Плейсхолдерів у темплейтах (modules/*.html): ${placeholders.size}`);
console.log('');

// Перетин всіх трьох множин - ідеальні поля
const perfectFields = new Set([...formFields].filter(f => configKeys.has(f) && placeholders.has(f)));

console.log('✅ ПОВНІСТЮ СИНХРОНІЗОВАНІ ПОЛЯ:');
console.log('─────────────────────────────────');
console.log(`  Кількість: ${perfectFields.size}`);
console.log('');

// Проблеми
console.log('⚠️  ПРОБЛЕМНІ ПОЛЯ:');
console.log('──────────────────');

// Є в формі, немає в конфігу
const inFormNotInConfig = [...formFields].filter(f => !configKeys.has(f));
if (inFormNotInConfig.length > 0) {
  console.log(`\n  📝 Є в формі, НЕМАЄ в конфігу (${inFormNotInConfig.length}):`);
  inFormNotInConfig.forEach(f => console.log(`     - ${f}`));
}

// Є в формі, немає в темплейтах
const inFormNotInTemplates = [...formFields].filter(f => !placeholders.has(f));
if (inFormNotInTemplates.length > 0) {
  console.log(`\n  📝 Є в формі, НЕМАЄ в темплейтах (${inFormNotInTemplates.length}):`);
  inFormNotInTemplates.slice(0, 20).forEach(f => console.log(`     - ${f}`));
  if (inFormNotInTemplates.length > 20) {
    console.log(`     ... і ще ${inFormNotInTemplates.length - 20}`);
  }
}

// Є в темплейтах, немає в конфігу
const inTemplatesNotInConfig = [...placeholders].filter(p => !configKeys.has(p));
if (inTemplatesNotInConfig.length > 0) {
  console.log(`\n  🔧 Є в темплейтах, НЕМАЄ в конфігу (${inTemplatesNotInConfig.length}):`);
  inTemplatesNotInConfig.slice(0, 20).forEach(p => console.log(`     - ${p}`));
  if (inTemplatesNotInConfig.length > 20) {
    console.log(`     ... і ще ${inTemplatesNotInConfig.length - 20}`);
  }
}

// Є в конфігу, немає в формі
const inConfigNotInForm = [...configKeys].filter(k => !formFields.has(k));
if (inConfigNotInForm.length > 0) {
  console.log(`\n  💾 Є в конфігу, НЕМАЄ в формі (${inConfigNotInForm.length}):`);
  console.log('     Можливо це поля для темплейтів або старі поля');
  // Перевіримо чи вони в темплейтах
  const inConfigAndTemplates = inConfigNotInForm.filter(k => placeholders.has(k));
  const onlyInConfig = inConfigNotInForm.filter(k => !placeholders.has(k));

  if (inConfigAndTemplates.length > 0) {
    console.log(`     ✅ З них використовуються в темплейтах: ${inConfigAndTemplates.length}`);
  }
  if (onlyInConfig.length > 0) {
    console.log(`     ❌ Не використовуються ніде: ${onlyInConfig.length}`);
    onlyInConfig.slice(0, 10).forEach(k => console.log(`        - ${k}`));
    if (onlyInConfig.length > 10) {
      console.log(`        ... і ще ${onlyInConfig.length - 10}`);
    }
  }
}

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('');

// Генеруємо файл з рекомендаціями
const recommendations = [];

if (inFormNotInConfig.length > 0) {
  recommendations.push('// ДОДАТИ В КОНФІГ:');
  inFormNotInConfig.forEach(f => {
    recommendations.push(`"${f}": "",`);
  });
}

if (inTemplatesNotInConfig.length > 0) {
  recommendations.push('\n// ДОДАТИ В КОНФІГ (для темплейтів):');
  inTemplatesNotInConfig.forEach(p => {
    recommendations.push(`"${p}": "",`);
  });
}

if (recommendations.length > 0) {
  fs.writeFileSync('recommendations.txt', recommendations.join('\n'), 'utf8');
  console.log('💡 Рекомендації збережено в recommendations.txt');
}