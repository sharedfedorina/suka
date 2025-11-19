/**
 * Інтеграційний тест - симулює реальний запит preview
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('🔬 ІНТЕГРАЦІЙНИЙ ТЕСТ PREVIEW');
console.log('='.repeat(60) + '\n');

// Перевірка чи запущений сервер
function checkServer() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 6614,
      path: '/',
      method: 'GET',
      timeout: 2000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Сервер запущений на порту 6614');
        resolve(true);
      } else {
        reject(new Error(`Сервер повернув статус ${res.statusCode}`));
      }
    });

    req.on('error', (e) => {
      reject(new Error(`Сервер не відповідає: ${e.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout - сервер не відповідає'));
    });

    req.end();
  });
}

// Тест POST /generate з мінімальними даними
function testGenerateEndpoint() {
  return new Promise((resolve, reject) => {
    // Відправляємо як form-data, а не JSON
    const testData = 'headerText=Test+Header&heroTitle=Test+Title&heroPrice=500+грн&enableTimer=off&enableStock=off';

    const options = {
      hostname: 'localhost',
      port: 6614,
      path: '/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(testData)
      },
      timeout: 5000
    };

    console.log('\n📤 Відправляю POST /generate запит...');

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ POST /generate повернув 200 OK');
          console.log(`📏 Розмір відповіді: ${(data.length / 1024).toFixed(2)} KB`);

          // Перевірка що це HTML
          if (data.includes('<!DOCTYPE html>') || data.includes('<html')) {
            console.log('✅ Відповідь містить HTML');
            resolve(true);
          } else {
            reject(new Error('Відповідь не містить HTML'));
          }
        } else {
          reject(new Error(`POST /generate повернув статус ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Помилка запиту: ${e.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout - сервер не відповів на POST /generate'));
    });

    req.write(testData);
    req.end();
  });
}

// Перевірка що form.js завантажується без помилок
function testFormJsLoads() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 6614,
      path: '/js/form.js',
      method: 'GET',
      timeout: 2000
    };

    console.log('\n📥 Завантажую /js/form.js...');

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ /js/form.js завантажився (200 OK)');
          console.log(`📏 Розмір: ${(data.length / 1024).toFixed(2)} KB`);

          // Перевірка cache headers
          const cacheControl = res.headers['cache-control'];
          if (cacheControl && (cacheControl.includes('no-cache') || cacheControl.includes('no-store'))) {
            console.log('✅ Cache-Control headers присутні:', cacheControl);
          } else {
            console.log('⚠️  Cache-Control headers відсутні');
          }

          // Перевірка що файл містить функцію
          if (data.includes('function previewSite()')) {
            console.log('✅ form.js містить function previewSite()');
            resolve(true);
          } else {
            reject(new Error('form.js не містить function previewSite()'));
          }
        } else {
          reject(new Error(`/js/form.js повернув статус ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Помилка завантаження form.js: ${e.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout - form.js не завантажився'));
    });

    req.end();
  });
}

// Перевірка синтаксису JavaScript
function testJavaScriptSyntax() {
  return new Promise((resolve, reject) => {
    console.log('\n🔍 Перевірка JavaScript синтаксису...');

    const formJsPath = path.join(__dirname, 'js', 'form.js');
    const content = fs.readFileSync(formJsPath, 'utf8');

    // Базові перевірки синтаксису
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;

    console.log(`   Відкриті дужки {: ${openBraces}`);
    console.log(`   Закриті дужки }: ${closeBraces}`);
    console.log(`   Відкриті дужки (: ${openParens}`);
    console.log(`   Закриті дужки ): ${closeParens}`);

    if (openBraces !== closeBraces) {
      reject(new Error(`Незбалансовані дужки {}: ${openBraces} відкритих, ${closeBraces} закритих`));
      return;
    }

    if (openParens !== closeParens) {
      reject(new Error(`Незбалансовані дужки (): ${openParens} відкритих, ${closeParens} закритих`));
      return;
    }

    console.log('✅ Синтаксис JavaScript коректний');
    resolve(true);
  });
}

// Основна функція запуску тестів
async function runTests() {
  let allPassed = true;

  try {
    await checkServer();
  } catch (error) {
    console.log('❌ FAIL:', error.message);
    console.log('\n⚠️  Сервер не запущений. Запусти: cd constructor && node server.js');
    process.exit(1);
  }

  try {
    await testJavaScriptSyntax();
  } catch (error) {
    console.log('❌ FAIL:', error.message);
    allPassed = false;
  }

  try {
    await testFormJsLoads();
  } catch (error) {
    console.log('❌ FAIL:', error.message);
    allPassed = false;
  }

  try {
    await testGenerateEndpoint();
  } catch (error) {
    console.log('❌ FAIL:', error.message);
    allPassed = false;
  }

  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('🎉 ВСІ ІНТЕГРАЦІЙНІ ТЕСТИ ПРОЙШЛИ!');
    console.log('='.repeat(60) + '\n');
    process.exit(0);
  } else {
    console.log('❌ ДЕЯКІ ТЕСТИ ПРОВАЛИЛИСЬ');
    console.log('='.repeat(60) + '\n');
    process.exit(1);
  }
}

runTests();
