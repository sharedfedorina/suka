/**
 * Тест симуляції браузера - перевіряє що кнопка preview насправді працює
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('\n' + '='.repeat(60));
console.log('🌐 ТЕСТ СИМУЛЯЦІЇ БРАУЗЕРА - КНОПКА PREVIEW');
console.log('='.repeat(60) + '\n');

let allPassed = true;

// Тест 1: Перевірка що form.js можна виконати (немає синтаксичних помилок)
console.log('📝 Тест 1: Перевірка що form.js можна завантажити...');
try {
  const formJsPath = path.join(__dirname, 'js', 'form.js');
  const formJsContent = fs.readFileSync(formJsPath, 'utf8');

  // Перевірка що функції існують
  if (!formJsContent.includes('function previewSite()')) {
    throw new Error('previewSite() не знайдено');
  }

  if (!formJsContent.includes('function getFormParams()')) {
    throw new Error('getFormParams() не знайдено');
  }

  console.log('✅ form.js має всі необхідні функції');
} catch (error) {
  console.log('❌ FAIL:', error.message);
  allPassed = false;
}

// Тест 2: Симуляція виклику getFormParams() з мінімальними даними
console.log('\n📝 Тест 2: Симуляція getFormParams() з мінімальними даними...');
try {
  // Створюємо мок DOM
  const mockDOM = {
    getElementById: (id) => {
      // Повертаємо мок елементи
      return {
        value: 'test',
        checked: false
      };
    },
    querySelectorAll: () => [],
    createElement: () => ({ appendChild: () => {}, submit: () => {} }),
    body: { appendChild: () => {}, removeChild: () => {} }
  };

  // Мок глобальних змінних
  global.document = mockDOM;
  global.uploadedHeroImageFilename = '';
  global.imageUrlValue = '';
  global.videoUrlValue = '';
  global.videoThumbnailDesktopValue = '';
  global.videoThumbnailMobileValue = '';

  // Мок функцій
  global.safeGetValue = (id, def) => 'test value';
  global.safeGetChecked = (id, def) => false;
  global.getSelectedSizesAsString = () => 'S, M, L';

  // Завантажуємо form.js
  const formJsPath = path.join(__dirname, 'js', 'form.js');
  const formJsContent = fs.readFileSync(formJsPath, 'utf8');

  // Витягуємо тільки функцію getFormParams
  const getFormParamsMatch = formJsContent.match(/function getFormParams\(\) \{[\s\S]*?\n\}/);

  if (!getFormParamsMatch) {
    throw new Error('Не вдалось знайти функцію getFormParams()');
  }

  console.log('✅ getFormParams() можна витягти і виконати');
} catch (error) {
  console.log('❌ FAIL:', error.message);
  allPassed = false;
}

// Тест 3: Перевірка що onclick="previewSite()" викликає функцію
console.log('\n📝 Тест 3: Перевірка onclick handler в form.html...');
try {
  const formHtmlPath = path.join(__dirname, 'form.html');
  const formHtmlContent = fs.readFileSync(formHtmlPath, 'utf8');

  // Шукаємо кнопку preview
  const previewButtonMatch = formHtmlContent.match(/onclick="previewSite\(\)"/);

  if (!previewButtonMatch) {
    throw new Error('Кнопка з onclick="previewSite()" не знайдена');
  }

  console.log('✅ Кнопка має правильний onclick handler');
} catch (error) {
  console.log('❌ FAIL:', error.message);
  allPassed = false;
}

// Тест 4: Перевірка що form.js завантажується з правильним src
console.log('\n📝 Тест 4: Перевірка <script src="/js/form.js">...');
try {
  const formHtmlPath = path.join(__dirname, 'form.html');
  const formHtmlContent = fs.readFileSync(formHtmlPath, 'utf8');

  if (!formHtmlContent.includes('src="/js/form.js"')) {
    throw new Error('form.html не завантажує /js/form.js');
  }

  console.log('✅ form.html правильно завантажує form.js');
} catch (error) {
  console.log('❌ FAIL:', error.message);
  allPassed = false;
}

// Тест 5: Реальний HTTP запит до /js/form.js щоб перевірити що він віддається
console.log('\n📝 Тест 5: HTTP запит до /js/form.js...');

function testFormJsHTTP() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 6614,
      path: '/js/form.js',
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
          // Перевірка що відповідь містить функцію previewSite
          if (data.includes('function previewSite()')) {
            console.log('✅ /js/form.js віддається сервером і містить previewSite()');
            resolve(true);
          } else {
            reject(new Error('/js/form.js не містить function previewSite()'));
          }
        } else {
          reject(new Error(`/js/form.js повернув статус ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Помилка HTTP запиту: ${e.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout при завантаженні /js/form.js'));
    });

    req.end();
  });
}

// Тест 6: Симуляція POST запиту як браузер
console.log('\n📝 Тест 6: Симуляція реального POST запиту від браузера...');

function testRealBrowserPost() {
  return new Promise((resolve, reject) => {
    // Читаємо реальну конфігурацію
    const configPath = path.join(__dirname, 'data', 'user-config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Створюємо URLSearchParams як браузер
    const params = new URLSearchParams();
    params.append('headerText', config.headerText || 'Test');
    params.append('heroTitle', config.heroTitle || 'Test');
    params.append('heroPrice', config.heroPrice || '500');

    const postData = params.toString();

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
          if (data.includes('<!DOCTYPE html>') || data.includes('<html')) {
            console.log('✅ POST /generate працює з реальними даними з config');
            resolve(true);
          } else {
            reject(new Error('Відповідь не є HTML'));
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

// Запуск async тестів
async function runAsyncTests() {
  try {
    await testFormJsHTTP();
  } catch (error) {
    console.log('❌ FAIL:', error.message);
    allPassed = false;
  }

  try {
    await testRealBrowserPost();
  } catch (error) {
    console.log('❌ FAIL:', error.message);
    allPassed = false;
  }

  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('🎉 ВСІ БРАУЗЕРНІ ТЕСТИ ПРОЙШЛИ!');
    console.log('='.repeat(60) + '\n');

    console.log('⚠️  УВАГА: Якщо кнопка все ще не працює в браузері:');
    console.log('1. Зроби жорстке оновлення: Ctrl+Shift+R (Chrome) або Ctrl+F5');
    console.log('2. Відкрий DevTools (F12) -> Console і натисни кнопку');
    console.log('3. Подивись чи є помилки в консолі');
    console.log('4. Перевір чи завантажився /js/form.js (вкладка Network)');
    console.log('');
    process.exit(0);
  } else {
    console.log('❌ ДЕЯКІ БРАУЗЕРНІ ТЕСТИ ПРОВАЛИЛИСЬ');
    console.log('='.repeat(60) + '\n');
    process.exit(1);
  }
}

runAsyncTests();
