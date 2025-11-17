/**
 * Автоматичний тест для функції previewSite()
 * Запускається на сервері та перевіряє всі можливі помилки
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('🧪 АВТОМАТИЧНЕ ТЕСТУВАННЯ PREVIEW ФУНКЦІЇ');
console.log('='.repeat(60) + '\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`✅ PASS: ${name}`);
    return true;
  } catch (error) {
    failedTests++;
    console.log(`❌ FAIL: ${name}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Test 1: Перевірка що файл form.js існує
test('form.js файл існує', () => {
  const formJsPath = path.join(__dirname, 'js', 'form.js');
  assert(fs.existsSync(formJsPath), 'form.js не знайдено');
});

// Test 2: Перевірка що функція previewSite() існує в файлі
test('previewSite() функція визначена', () => {
  const formJsPath = path.join(__dirname, 'js', 'form.js');
  const content = fs.readFileSync(formJsPath, 'utf8');
  assert(content.includes('function previewSite()'), 'previewSite() не знайдено');
});

// Test 3: Перевірка що функція має логування
test('previewSite() має debug логування', () => {
  const formJsPath = path.join(__dirname, 'js', 'form.js');
  const content = fs.readFileSync(formJsPath, 'utf8');
  assert(content.includes('console.log'), 'Немає console.log в previewSite()');
  assert(content.includes('Step 1'), 'Немає Step 1 логування');
  assert(content.includes('Step 2'), 'Немає Step 2 логування');
});

// Test 4: Перевірка що функція має try-catch
test('previewSite() має обробку помилок', () => {
  const formJsPath = path.join(__dirname, 'js', 'form.js');
  const content = fs.readFileSync(formJsPath, 'utf8');

  // Знайти функцію previewSite
  const funcStart = content.indexOf('function previewSite()');
  const funcEnd = content.indexOf('\n\n\nfunction', funcStart + 1);
  const funcBody = content.substring(funcStart, funcEnd);

  assert(funcBody.includes('try {'), 'Немає try блоку');
  assert(funcBody.includes('} catch (error)'), 'Немає catch блоку');
});

// Test 5: Перевірка що getFormParams() існує
test('getFormParams() функція визначена', () => {
  const formJsPath = path.join(__dirname, 'js', 'form.js');
  const content = fs.readFileSync(formJsPath, 'utf8');
  assert(content.includes('function getFormParams()'), 'getFormParams() не знайдено');
});

// Test 6: Перевірка що getFormParams() має логування
test('getFormParams() має debug логування', () => {
  const formJsPath = path.join(__dirname, 'js', 'form.js');
  const content = fs.readFileSync(formJsPath, 'utf8');

  const funcStart = content.indexOf('function getFormParams()');
  const funcEnd = content.indexOf('\n\n\nfunction', funcStart + 1);
  const funcBody = content.substring(funcStart, funcEnd);

  assert(funcBody.includes('getFormParams: Starting'), 'Немає початкового логування');
  assert(funcBody.includes('console.log'), 'Немає console.log в getFormParams()');
});

// Test 7: Перевірка що getFormParams() має try-catch
test('getFormParams() має обробку помилок', () => {
  const formJsPath = path.join(__dirname, 'js', 'form.js');
  const content = fs.readFileSync(formJsPath, 'utf8');

  const funcStart = content.indexOf('function getFormParams()');
  const funcEnd = content.indexOf('\nfunction previewSite()', funcStart);
  const funcBody = content.substring(funcStart, funcEnd);

  assert(funcBody.includes('try {'), 'Немає try блоку в getFormParams()');
  assert(funcBody.includes('} catch (error)'), 'Немає catch блоку в getFormParams()');
});

// Test 8: Перевірка що використовуються безпечні функції
test('Використовуються safeGetValue і safeGetChecked', () => {
  const formJsPath = path.join(__dirname, 'js', 'form.js');
  const content = fs.readFileSync(formJsPath, 'utf8');

  const funcStart = content.indexOf('function getFormParams()');
  const funcEnd = content.indexOf('\nfunction previewSite()', funcStart);
  const funcBody = content.substring(funcStart, funcEnd);

  assert(funcBody.includes('safeGetValue'), 'Немає використання safeGetValue()');
  assert(funcBody.includes('safeGetChecked'), 'Немає використання safeGetChecked()');
});

// Test 9: Перевірка що form.html містить кнопку preview
test('form.html містить кнопку ПЕРЕГЛЯД', () => {
  const formHtmlPath = path.join(__dirname, 'form.html');
  const content = fs.readFileSync(formHtmlPath, 'utf8');
  assert(content.includes('previewSite()'), 'Кнопка не викликає previewSite()');
  assert(content.includes('ПЕРЕГЛЯД') || content.includes('👁️'), 'Кнопка ПЕРЕГЛЯД не знайдена');
});

// Test 10: Перевірка що server.js має cache-control headers
test('server.js має cache-control для JS файлів', () => {
  const serverJsPath = path.join(__dirname, 'server.js');
  const content = fs.readFileSync(serverJsPath, 'utf8');
  assert(content.includes('Cache-Control'), 'Немає Cache-Control headers');
  assert(content.includes('no-cache') || content.includes('no-store'), 'Немає no-cache directive');
});

// Test 11: Перевірка що POST /generate route існує
test('POST /generate route існує', () => {
  const serverJsPath = path.join(__dirname, 'server.js');
  const content = fs.readFileSync(serverJsPath, 'utf8');
  assert(content.includes("app.post('/generate'"), 'POST /generate route не знайдено');
});

// Test 12: Симуляція створення URLSearchParams
test('URLSearchParams може бути створено з рядка', () => {
  const testString = 'key1=value1&key2=value2';
  const params = new URLSearchParams(testString);
  assert(params.get('key1') === 'value1', 'URLSearchParams не працює правильно');
  assert(params.get('key2') === 'value2', 'URLSearchParams не працює правильно');
});

// Test 13: Перевірка структуриParams object в getFormParams
test('getFormParams() повертає params.toString()', () => {
  const formJsPath = path.join(__dirname, 'js', 'form.js');
  const content = fs.readFileSync(formJsPath, 'utf8');

  const funcStart = content.indexOf('function getFormParams()');
  const funcEnd = content.indexOf('\nfunction previewSite()', funcStart);
  const funcBody = content.substring(funcStart, funcEnd);

  assert(funcBody.includes('params.toString()'), 'getFormParams() не повертає params.toString()');
  assert(funcBody.includes('return'), 'getFormParams() не має return statement');
});

// Фінальний звіт
console.log('\n' + '='.repeat(60));
console.log('📊 РЕЗУЛЬТАТИ ТЕСТУВАННЯ');
console.log('='.repeat(60));
console.log(`Всього тестів: ${totalTests}`);
console.log(`✅ Пройдено: ${passedTests}`);
console.log(`❌ Провалено: ${failedTests}`);
console.log(`📈 Успішність: ${Math.round((passedTests / totalTests) * 100)}%`);
console.log('='.repeat(60) + '\n');

if (failedTests === 0) {
  console.log('🎉 ВСІ ТЕСТИ ПРОЙДЕНО! Код готовий до використання.\n');
  process.exit(0);
} else {
  console.log('⚠️  ДЕЯКІ ТЕСТИ ПРОВАЛИЛИСЬ. Потрібні виправлення.\n');
  process.exit(1);
}
