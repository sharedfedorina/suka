/**
 * Скрипт для виводу всіх параметрів з форми конструктора
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// Отримати конфіг з сервера
function getConfig() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:6614/api/get-user-config', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Отримати згенерований HTML
function getGeneratedHTML() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:6614/api/preview', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Знайти скільки разів значення зустрічається в HTML
function findValueInHTML(fieldName, configValue, html) {
  if (!configValue || configValue === '') return '';
  if (Array.isArray(configValue)) return '[array]';
  if (typeof configValue === 'object') return '[object]';

  const valueStr = String(configValue);
  const escapedValue = valueStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedValue, 'g');
  const matches = html.match(regex);
  const count = matches ? matches.length : 0;

  if (count === 0) return 'NOT FOUND';
  if (count === 1) return valueStr.substring(0, 30);
  return `${valueStr.substring(0, 25)} (x${count})`;
}

// Витягнути всі name атрибути з HTML файлу
function extractFieldNames(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const names = [];

  // Шукати input, textarea, select з атрибутом name
  const regex = /<(?:input|textarea|select)[^>]*name=["']([^"']+)["']/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    names.push(match[1]);
  }

  return names;
}

// Перевірити чи є плейсхолдер в БУДЬ-ЯКОМУ template модулі
function findPlaceholderInTemplate(fieldName) {
  const modulesDir = path.join(__dirname, '..', 'modules');
  const moduleFiles = fs.readdirSync(modulesDir).filter(f => f.endsWith('.html'));

  let totalCount = 0;
  const foundInModules = [];

  moduleFiles.forEach(file => {
    const modulePath = path.join(modulesDir, file);
    const content = fs.readFileSync(modulePath, 'utf8');
    const regex = new RegExp(`\\{\\{${fieldName}\\}\\}`, 'g');
    const matches = content.match(regex);
    const count = matches ? matches.length : 0;

    if (count > 0) {
      totalCount += count;
      foundInModules.push(file.replace('.html', ''));
    }
  });

  if (totalCount === 0) return '';

  const placeholder = `{{${fieldName}}}`;
  if (totalCount === 1) return placeholder;
  return `${placeholder} (x${totalCount})`;
}

// Мапінг секцій до модулів
const SECTION_TO_MODULE = {
  'Basic': 'basic',
  'Hero': 'hero',
  'Benefits': 'benefits',
  'Pluslogo': 'pluslogo',
  'Video': 'video',
  'Products': 'products',
  'Sizechart': 'sizechart',
  'Tabs': 'tabs',
  'Comments': 'comments',
  'Reviews': 'reviews',
  'FAQ': 'faq',
  'Howto': 'howto',
  'Request': 'request',
  'Footer': 'footer',
  'SEO': 'seo',
  'SalesDrive': 'salesdrive'
};

// Порядок секцій з форми
const sections = [
  { file: 'basic.html', name: 'Basic' },
  { file: 'hero.html', name: 'Hero' },
  { file: 'benefits.html', name: 'Benefits' },
  { file: 'pluslogo.html', name: 'Pluslogo' },
  { file: 'video.html', name: 'Video' },
  { file: 'products.html', name: 'Products' },
  { file: 'sizechart.html', name: 'Sizechart' },
  { file: 'tabs.html', name: 'Tabs' },
  { file: 'comments.html', name: 'Comments' },
  { file: 'reviews.html', name: 'Reviews' },
  { file: 'faq.html', name: 'FAQ' },
  { file: 'howto.html', name: 'Howto' },
  { file: 'request.html', name: 'Request' },
  { file: 'footer.html', name: 'Footer' },
  { file: 'seo.html', name: 'SEO' },
  { file: 'salesdrive.html', name: 'SalesDrive' }
];

async function main() {
  try {
    const config = await getConfig();
    const html = await getGeneratedHTML();

    console.log('СЕКЦІЯ       | ПАРАМЕТР (NAME З ФОРМИ)      | ЗНАЧЕННЯ В КОНФІГУ      | ПЛЕЙСХОЛДЕР В ТЕМПЛЕЙТІ | ЗНАЧЕННЯ В ЛЕНДІНГУ');
    console.log('-------------|------------------------------|-------------------------|-------------------------|---------------------');

    sections.forEach(section => {
      const filePath = path.join(__dirname, '..', 'sections', section.file);

      if (!fs.existsSync(filePath)) {
        console.log(`${section.name.padEnd(12)} | (файл не знайдено)`.padEnd(59) + ' | '.padEnd(26) + ' | '.padEnd(26) + ' | ');
        return;
      }

      const fields = extractFieldNames(filePath);

      if (fields.length === 0) {
        console.log(`${section.name.padEnd(12)} | (немає полів)`.padEnd(59) + ' | '.padEnd(26) + ' | '.padEnd(26) + ' | ');
      } else {
        fields.forEach(field => {
          const configValue = config.hasOwnProperty(field) ? config[field] : '';
          const valueStr = configValue === '' ? '' :
                          Array.isArray(configValue) ? `[${configValue.length} items]` :
                          typeof configValue === 'object' ? '[object]' :
                          String(configValue).substring(0, 23);

          const placeholder = findPlaceholderInTemplate(field);
          const htmlValue = findValueInHTML(field, configValue, html);

          console.log(`${section.name.padEnd(12)} | ${field.padEnd(28)} | ${valueStr.padEnd(23)} | ${placeholder.padEnd(23)} | ${htmlValue}`);
        });
      }
    });

  } catch (error) {
    console.error('Помилка:', error.message);
    process.exit(1);
  }
}

main();
