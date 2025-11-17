#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');

// ═══════════════════════════════════════════════════════════════════
// 🧪 ГОЛОВНИЙ ТЕСТОВИЙ RUNNER
// ═══════════════════════════════════════════════════════════════════

const CONSTRUCTOR_DIR = path.join(__dirname, '..');
const SERVER_URL = 'http://localhost:6614';

// Кольорові коди для консолі
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

function header(text) {
  const line = '━'.repeat(60);
  log(`\n${line}`, colors.cyan);
  log(`  ${text}`, colors.cyan);
  log(line, colors.cyan);
}

function subheader(text) {
  log(`\n${text}`, colors.blue);
}

// ═══════════════════════════════════════════════════════════════════
// УТІЛІТИ
// ═══════════════════════════════════════════════════════════════════

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractPlaceholders(html) {
  const regex = /\{\{([^}]+)\}\}/g;
  const placeholders = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    placeholders.push(match[1]);
  }
  return [...new Set(placeholders)]; // unique
}

function extractMediaPaths(html) {
  const regex = /(src|href)="([^"]*\.(jpg|jpeg|png|gif|webp|mp4))"/gi;
  const paths = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    paths.push(match[2]);
  }
  return [...new Set(paths)];
}

function resolvePath(filePath) {
  // /public/img/... → constructor/public/img/...
  if (filePath.startsWith('/public/')) {
    return path.join(CONSTRUCTOR_DIR, filePath.substring(1));
  }
  // img/... → constructor/public/img/...
  if (filePath.startsWith('img/') || filePath.startsWith('video/')) {
    return path.join(CONSTRUCTOR_DIR, 'public', filePath);
  }
  // favicon/... → constructor/public/favicon/...
  if (filePath.startsWith('favicon/')) {
    return path.join(CONSTRUCTOR_DIR, 'public', filePath);
  }
  return path.join(CONSTRUCTOR_DIR, 'public', filePath);
}

// ═══════════════════════════════════════════════════════════════════
// ТЕСТ 1: ПЛЕЙСХОЛДЕРИ
// ═══════════════════════════════════════════════════════════════════

async function testPlaceholders() {
  subheader('1. PLACEHOLDER TEST');

  const startTime = Date.now();
  let passed = true;

  try {
    // Генеруємо HTML
    const html = await httpGet(`${SERVER_URL}/generate`);

    // Шукаємо незаповнені плейсхолдери
    const unfilled = extractPlaceholders(html);

    if (unfilled.length === 0) {
      log('   ✅ No unfilled placeholders found', colors.green);
    } else {
      log(`   ❌ Found ${unfilled.length} unfilled placeholders:`, colors.red);
      unfilled.forEach(p => log(`      • {{${p}}}`, colors.gray));
      passed = false;
    }

    // Читаємо user-config.json
    const configPath = path.join(CONSTRUCTOR_DIR, 'data', 'user-config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Перевіряємо чи всі плейсхолдери мають значення
    const missingValues = unfilled.filter(p => {
      // Перевіряємо top-level поля
      if (config[p] !== undefined) return false;

      // Перевіряємо benefit поля
      if (p.match(/^benefit\d+/)) {
        const num = p.match(/\d+/)[0];
        const field = p.replace(/^benefit\d+/, '').toLowerCase();
        const benefit = config.benefits?.find(b => b.id == num);
        return !benefit || benefit[field] === undefined;
      }

      return true;
    });

    if (missingValues.length > 0) {
      log(`   ⚠️  ${missingValues.length} placeholders missing from config`, colors.yellow);
    }

  } catch (err) {
    log(`   ❌ Error: ${err.message}`, colors.red);
    passed = false;
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  log(`   ⏱️  Duration: ${duration}s`, colors.gray);

  return passed;
}

// ═══════════════════════════════════════════════════════════════════
// ТЕСТ 2: ФАЙЛИ РЕСУРСІВ
// ═══════════════════════════════════════════════════════════════════

async function testAssets() {
  subheader('2. ASSET FILES TEST');

  const startTime = Date.now();
  let passed = true;

  try {
    // Генеруємо HTML
    const html = await httpGet(`${SERVER_URL}/generate`);

    // Витягуємо всі шляхи
    const mediaPaths = extractMediaPaths(html);

    log(`   📂 Checking ${mediaPaths.length} media files...`, colors.gray);

    const missing = [];
    const found = [];

    for (const mediaPath of mediaPaths) {
      const fullPath = resolvePath(mediaPath);
      if (fs.existsSync(fullPath)) {
        found.push(mediaPath);
      } else {
        missing.push(mediaPath);
      }
    }

    if (missing.length === 0) {
      log(`   ✅ All ${found.length} files exist`, colors.green);
    } else {
      log(`   ❌ Missing ${missing.length} files:`, colors.red);
      missing.forEach(p => log(`      • ${p}`, colors.gray));
      passed = false;
    }

    // Перевіряємо також файли з user-config
    const configPath = path.join(CONSTRUCTOR_DIR, 'data', 'user-config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    const configFiles = [
      config.heroImage,
      config.imageUrl,
      config.videoUrl,
      config.sizeChartImage,
      config.videoThumbnailDesktop,
      config.videoThumbnailMobile,
      ...(config.product1Images || []),
      ...(config.product2Images || []),
      ...(config.product8Images || [])
    ].filter(Boolean);

    log(`   📂 Checking ${configFiles.length} config files...`, colors.gray);

    const missingConfig = [];
    for (const filePath of configFiles) {
      const fullPath = resolvePath(filePath);
      if (!fs.existsSync(fullPath)) {
        missingConfig.push(filePath);
      }
    }

    if (missingConfig.length > 0) {
      log(`   ⚠️  ${missingConfig.length} config files missing:`, colors.yellow);
      missingConfig.forEach(p => log(`      • ${p}`, colors.gray));
    }

  } catch (err) {
    log(`   ❌ Error: ${err.message}`, colors.red);
    passed = false;
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  log(`   ⏱️  Duration: ${duration}s`, colors.gray);

  return passed;
}

// ═══════════════════════════════════════════════════════════════════
// ТЕСТ 3: ФОРМА ↔ ТЕМПЛЕЙТ
// ═══════════════════════════════════════════════════════════════════

async function testFormFields() {
  subheader('3. FORM-TEMPLATE SYNC TEST');

  const startTime = Date.now();
  let passed = true;

  try {
    // Читаємо form.html
    const formPath = path.join(CONSTRUCTOR_DIR, 'form.html');
    const formHtml = fs.readFileSync(formPath, 'utf8');

    // Читаємо index.html (темплейт)
    const templatePath = path.join(CONSTRUCTOR_DIR, 'index.html');
    const templateHtml = fs.readFileSync(templatePath, 'utf8');

    // Витягуємо поля з форми
    const nameRegex = /name="([^"]+)"/g;
    const formFields = [];
    let match;
    while ((match = nameRegex.exec(formHtml)) !== null) {
      formFields.push(match[1]);
    }

    // Витягуємо плейсхолдери з темплейту
    const templatePlaceholders = extractPlaceholders(templateHtml);

    log(`   📝 Form has ${formFields.length} fields`, colors.gray);
    log(`   📄 Template has ${templatePlaceholders.length} placeholders`, colors.gray);

    // Перевіряємо чи всі поля форми є в темплейті
    const orphanFields = formFields.filter(f => !templatePlaceholders.includes(f));
    if (orphanFields.length > 0) {
      log(`   ⚠️  ${orphanFields.length} form fields not in template:`, colors.yellow);
      orphanFields.slice(0, 5).forEach(f => log(`      • ${f}`, colors.gray));
      if (orphanFields.length > 5) log(`      ... and ${orphanFields.length - 5} more`, colors.gray);
    }

    // Перевіряємо чи всі плейсхолдери темплейту є в формі
    const orphanPlaceholders = templatePlaceholders.filter(p => !formFields.includes(p));
    if (orphanPlaceholders.length > 0) {
      log(`   ⚠️  ${orphanPlaceholders.length} template placeholders not in form:`, colors.yellow);
      orphanPlaceholders.slice(0, 5).forEach(p => log(`      • {{${p}}}`, colors.gray));
      if (orphanPlaceholders.length > 5) log(`      ... and ${orphanPlaceholders.length - 5} more`, colors.gray);
    }

    if (orphanFields.length === 0 && orphanPlaceholders.length === 0) {
      log(`   ✅ Perfect sync between form and template`, colors.green);
    }

  } catch (err) {
    log(`   ❌ Error: ${err.message}`, colors.red);
    passed = false;
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  log(`   ⏱️  Duration: ${duration}s`, colors.gray);

  return passed;
}

// ═══════════════════════════════════════════════════════════════════
// ТЕСТ 4: ЗАВАНТАЖЕННЯ ДАНИХ
// ═══════════════════════════════════════════════════════════════════

async function testDataLoading() {
  subheader('4. DATA LOADING TEST');

  const startTime = Date.now();
  let passed = true;

  try {
    // Перевіряємо GET /api/data → має бути landing-data.json
    const apiData = await httpGet(`${SERVER_URL}/api/data`);
    const parsedApiData = JSON.parse(apiData);

    if (parsedApiData.heroTitle === 'Жіночі футболки оверсайз') {
      log('   ✅ /api/data returns landing-data.json (футболки)', colors.green);
    } else {
      log('   ❌ /api/data not returning correct data', colors.red);
      passed = false;
    }

    // Перевіряємо що /generate використовує user-config.json
    const generatedHtml = await httpGet(`${SERVER_URL}/generate`);

    if (generatedHtml.includes('Худі жіночі на флісі')) {
      log('   ✅ /generate uses user-config.json (худі)', colors.green);
    } else {
      log('   ❌ /generate not using user-config', colors.red);
      passed = false;
    }

  } catch (err) {
    log(`   ❌ Error: ${err.message}`, colors.red);
    passed = false;
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  log(`   ⏱️  Duration: ${duration}s`, colors.gray);

  return passed;
}

// ═══════════════════════════════════════════════════════════════════
// ГОЛОВНА ФУНКЦІЯ
// ═══════════════════════════════════════════════════════════════════

async function main() {
  header('🧪 CONSTRUCTOR TEST SUITE');

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  log(`   Started: ${timestamp}`, colors.gray);

  const results = {
    placeholders: await testPlaceholders(),
    assets: await testAssets(),
    formFields: await testFormFields(),
    dataLoading: await testDataLoading()
  };

  // Підсумок
  header('📊 TEST RESULTS');

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  const percentage = ((passed / total) * 100).toFixed(0);

  log(`   Passed: ${passed}/${total} (${percentage}%)`,
    passed === total ? colors.green : colors.yellow);

  Object.entries(results).forEach(([name, pass]) => {
    const icon = pass ? '✅' : '❌';
    const color = pass ? colors.green : colors.red;
    log(`   ${icon} ${name}`, color);
  });

  const line = '━'.repeat(60);
  log(`${line}\n`, colors.cyan);

  if (passed === total) {
    log('🎉 ALL TESTS PASSED!', colors.green);
    process.exit(0);
  } else {
    log(`⚠️  ${total - passed} TEST(S) FAILED`, colors.red);
    process.exit(1);
  }
}

// Запуск
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
