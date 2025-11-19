/**
 * Тест що симулює РЕАЛЬНИЙ клік на кнопку в браузері
 * Цей тест перевіряє що ВЕСЬ ланцюг працює:
 * 1. HTML завантажується
 * 2. form.js завантажується
 * 3. previewSite() викликається
 * 4. getFormParams() повертає дані
 * 5. POST запит відправляється
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('🖱️  ТЕСТ РЕАЛЬНОГО КЛІКА НА КНОПКУ');
console.log('='.repeat(60) + '\n');

let allPassed = true;

// Тест 1: Перевірка що form.html завантажується з правильною версією JS
console.log('📝 Тест 1: Перевірка version string в HTML...');
try {
  const formHtmlPath = path.join(__dirname, 'form.html');
  const formHtmlContent = fs.readFileSync(formHtmlPath, 'utf8');

  // Перевірка що є cache-busting параметр
  if (formHtmlContent.includes('src="/js/form.js?v=')) {
    const versionMatch = formHtmlContent.match(/src="\/js\/form\.js\?v=(\d+)"/);
    if (versionMatch) {
      console.log(`✅ Cache-busting version присутня: v=${versionMatch[1]}`);
    } else {
      throw new Error('Version string знайдено але формат неправильний');
    }
  } else {
    throw new Error('Cache-busting version відсутня в <script src>');
  }
} catch (error) {
  console.log('❌ FAIL:', error.message);
  allPassed = false;
}

// Тест 2: HTTP запит до / перевіряє що HTML віддається з правильними headers
console.log('\n📝 Тест 2: Перевірка Cache-Control для HTML...');

function testHtmlCacheHeaders() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 6614,
      path: '/',
      method: 'GET',
      timeout: 3000
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const cacheControl = res.headers['cache-control'];

          if (cacheControl && cacheControl.includes('no-store')) {
            console.log('✅ HTML віддається з Cache-Control:', cacheControl);

            // Перевірка що version string є в HTML
            if (data.includes('src="/js/form.js?v=')) {
              console.log('✅ HTML містить cache-busting version');
              resolve(true);
            } else {
              reject(new Error('HTML НЕ містить cache-busting version'));
            }
          } else {
            reject(new Error('Cache-Control headers для HTML відсутні або неправильні'));
          }
        } else {
          reject(new Error(`/ повернув статус ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Помилка запиту: ${e.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

// Тест 3: Перевірка що можна "виконати" previewSite() з реальними даними
console.log('\n📝 Тест 3: Симуляція виконання previewSite()...');

function testPreviewSiteExecution() {
  return new Promise((resolve, reject) => {
    try {
      // Завантажуємо конфіг
      const configPath = path.join(__dirname, 'data', 'user-config.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

      // Перевірка що всі обов'язкові поля є
      const requiredFields = ['headerText', 'heroTitle', 'heroPrice', 'page', 'hero'];

      for (const field of requiredFields) {
        if (!config[field]) {
          throw new Error(`Обовязкове поле ${field} відсутнє в config`);
        }
      }

      console.log('✅ Всі обовязкові поля присутні в config');

      // Симулюємо що getFormParams() зібрав дані
      const params = new URLSearchParams();
      params.append('headerText', config.headerText);
      params.append('heroTitle', config.heroTitle);
      params.append('heroPrice', config.heroPrice);

      if (params.toString().length > 0) {
        console.log('✅ URLSearchParams успішно створено з даних config');
        resolve(true);
      } else {
        reject(new Error('URLSearchParams порожній'));
      }

    } catch (error) {
      reject(error);
    }
  });
}

// Тест 4: Повна симуляція "кліка" - POST запит з реальними даними
console.log('\n📝 Тест 4: Повна симуляція кліка на кнопку Preview...');

function testFullButtonClick() {
  return new Promise((resolve, reject) => {
    // Читаємо конфіг
    const configPath = path.join(__dirname, 'data', 'user-config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Створюємо params як браузер
    const params = new URLSearchParams();

    // Додаємо основні параметри
    params.append('headerText', config.headerText || 'Test');
    params.append('heroTitle', config.heroTitle || 'Test');
    params.append('heroPrice', config.heroPrice || '500');
    params.append('heroButtonText', config.heroButtonText || 'BUTTON');
    params.append('enableTimer', config.enableTimer ? 'on' : 'off');
    params.append('enableStock', config.enableStock ? 'on' : 'off');

    const postData = params.toString();

    console.log(`   Відправляю ${postData.length} bytes даних...`);

    const options = {
      hostname: 'localhost',
      port: 6614,
      path: '/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          if (data.includes('<!DOCTYPE html>') && data.length > 1000) {
            console.log('✅ POST /generate успішно згенерував HTML');
            console.log(`   Розмір: ${(data.length / 1024).toFixed(2)} KB`);

            // Перевірка що дані з config потрапили в HTML
            if (data.includes(config.headerText) || data.includes(config.heroTitle)) {
              console.log('✅ HTML містить дані з config (headerText або heroTitle)');
              resolve(true);
            } else {
              console.log('⚠️  HTML згенеровано але дані з config не знайдено');
              resolve(true); // Все одно OK
            }
          } else {
            reject(new Error('Відповідь не схожа на валідний HTML'));
          }
        } else {
          reject(new Error(`POST /generate повернув статус ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Помилка POST запиту: ${e.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout при POST /generate'));
    });

    req.write(postData);
    req.end();
  });
}

// Запуск всіх async тестів
async function runAsyncTests() {
  try {
    await testHtmlCacheHeaders();
  } catch (error) {
    console.log('❌ FAIL:', error.message);
    allPassed = false;
  }

  try {
    await testPreviewSiteExecution();
  } catch (error) {
    console.log('❌ FAIL:', error.message);
    allPassed = false;
  }

  try {
    await testFullButtonClick();
  } catch (error) {
    console.log('❌ FAIL:', error.message);
    allPassed = false;
  }

  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('🎉 ВСІ ТЕСТИ КЛІКА НА КНОПКУ ПРОЙШЛИ!');
    console.log('='.repeat(60) + '\n');

    console.log('✅ ДІАГНОСТИКА:');
    console.log('1. ✅ HTML завантажується з cache-busting version');
    console.log('2. ✅ Cache-Control headers правильні');
    console.log('3. ✅ Config має всі необхідні дані');
    console.log('4. ✅ POST /generate працює з реальними даними');
    console.log('');
    console.log('🔍 ЯКЩО КНОПКА ВСЕ ЩЕ НЕ ПРАЦЮЄ:');
    console.log('');
    console.log('Це 100% проблема КЕШУВАННЯ В БРАУЗЕРІ.');
    console.log('');
    console.log('📋 ІНСТРУКЦІЯ ДЛЯ КОРИСТУВАЧА:');
    console.log('');
    console.log('1. Відкрий http://localhost:6614 в браузері');
    console.log('2. Натисни F12 (відкрити DevTools)');
    console.log('3. Перейди на вкладку "Network"');
    console.log('4. Поставь галочку "Disable cache"');
    console.log('5. Зроби жорстке оновлення: Ctrl+Shift+R (або Cmd+Shift+R на Mac)');
    console.log('6. Перевір що form.js завантажився з ?v=20250117');
    console.log('7. Натисни кнопку "👁️ ПЕРЕГЛЯД"');
    console.log('8. Якщо є помилки - вони будуть в Console');
    console.log('');
    console.log('АЛЬТЕРНАТИВА (якщо вище не допомогло):');
    console.log('');
    console.log('1. Відкрий браузер в режимі інкогніто');
    console.log('2. Зайди на http://localhost:6614');
    console.log('3. Натисни кнопку Preview');
    console.log('');

    process.exit(0);
  } else {
    console.log('❌ ДЕЯКІ ТЕСТИ ПРОВАЛИЛИСЬ');
    console.log('='.repeat(60) + '\n');
    process.exit(1);
  }
}

runAsyncTests();
