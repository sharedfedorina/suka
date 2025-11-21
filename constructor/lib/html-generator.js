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

  // Очищаємо непарні {{/if}} які могли залишитись
  html = html.replace(/\{\{\/if\}\}/g, '');

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
 * Генерує фінальний HTML: читає base.html + замінює MODULE плейсхолдери + замінює дані
 */
function generateHTML(config) {
  try {
    console.log('\n🔨 Генерація HTML...');

    // 1. Читаємо base.html (template з MODULE плейсхолдерами)
    const basePath = path.join(PATHS.MODULES, 'base.html');
    let html = fs.readFileSync(basePath, 'utf8');

    // 2. Замінюємо всі {{MODULE_*}} плейсхолдери на відповідні модулі
    const modules = [
      'basic', 'hero', 'benefits', 'pluslogo', 'video',
      'products', 'sizechart', 'tabs', 'comments', 'reviews',
      'faq', 'howto', 'request', 'footer', 'salesdrive'
    ];

    modules.forEach(moduleName => {
      const placeholder = `{{MODULE_${moduleName.toUpperCase()}}}`;
      const modulePath = path.join(PATHS.MODULES, `${moduleName}.html`);

      if (fs.existsSync(modulePath)) {
        const moduleContent = fs.readFileSync(modulePath, 'utf8');
        html = html.replace(placeholder, moduleContent);
      } else {
        console.warn(`⚠️  Модуль не знайдений: ${moduleName}.html`);
        html = html.replace(placeholder, '');
      }
    });

    // 3. Застосовуємо модульні replacements
    const applyAllReplacements = require('../server/replacements/index');
    html = applyAllReplacements(html, {}, config);

    // 4. Обробляємо умовні блоки {{#if}}...{{/if}}
    html = processConditionals(html, config);

    // 5. Замінюємо плейсхолдери даних {{headerText}} і т.д.
    html = replacePlaceholders(html, config);

    console.log(`✅ HTML згенеровано (${html.length} байт)\n`);
    return html;
  } catch (err) {
    console.error('❌ Помилка при генерації HTML:', err.message);
    throw err;
  }
}

module.exports = {
  assembleModules,
  processConditionals,
  replacePlaceholders,
  generateHTML
};
