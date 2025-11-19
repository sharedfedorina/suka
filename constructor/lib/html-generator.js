const fs = require('fs');
const path = require('path');
const { PATHS, SECTIONS } = require('./constants');

/**
 * Конкатенує всі модулі HTML в один файл (для генерації лендінгу)
 */
function assembleModules() {
  let html = '';

  SECTIONS.forEach(moduleName => {
    const modulePath = path.join(PATHS.MODULES, `${moduleName}.html`);

    if (!fs.existsSync(modulePath)) {
      console.warn(`⚠️  Модуль не знайдений: ${moduleName}.html`);
      return;
    }

    const moduleContent = fs.readFileSync(modulePath, 'utf8');
    html += moduleContent + '\n';
  });

  return html;
}

/**
 * Обробляє умовні блоки {{#if condition}}...{{/if}}
 */
function processConditionals(html, config) {
  // Regex для пошуку {{#if key}}...{{/if}}
  const ifRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;

  html = html.replace(ifRegex, (match, key, content) => {
    const value = config[key];

    // Якщо значення truthy (true, "text", 123, тощо) → залишаємо контент
    // Якщо falsy (false, "", 0, null, undefined) → видаляємо блок
    if (value) {
      return content;
    } else {
      return '';
    }
  });

  return html;
}

/**
 * Замінює всі плейсхолдери {{key}} на значення з конфігу
 */
function replacePlaceholders(html, config) {
  Object.keys(config).forEach(key => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    const value = config[key] !== null && config[key] !== undefined ? config[key] : '';
    html = html.replace(regex, value);
  });

  return html;
}

/**
 * Генерує фінальний HTML: конкатенує модулі + замінює плейсхолдери
 */
function generateHTML(config) {
  try {
    console.log('\n🔨 Генерація HTML...');

    // 1. Склеюємо всі модулі (templates лендінгу)
    let html = assembleModules();
    console.log(`✅ Модулі склеєно (${SECTIONS.length} файлів)`);

    // 2. Обробляємо умовні блоки {{#if}}...{{/if}}
    html = processConditionals(html, config);
    console.log(`✅ Умовні блоки оброблено`);

    // 3. Замінюємо плейсхолдери {{key}}
    html = replacePlaceholders(html, config);
    console.log(`✅ Плейсхолдери замінено (${Object.keys(config).length} ключів)`);

    console.log(`✅ HTML успішно згенерований (${html.length} байт)\n`);
    return html;
  } catch (err) {
    console.error('❌ Помилка при генеруванні HTML:', err.message);
    throw err;
  }
}

module.exports = {
  assembleModules,
  processConditionals,
  replacePlaceholders,
  generateHTML
};
