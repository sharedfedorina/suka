const http = require('http');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Створюємо тестове зображення
const testImagePath = path.join(__dirname, 'test-image.jpg');
const testImageBuffer = Buffer.from('fake image data for testing');
fs.writeFileSync(testImagePath, testImageBuffer);

console.log('🧪 ТЕСТУЮ UPLOAD HERO IMAGE API');
console.log('==========================================\n');

// Створюємо FormData
const form = new FormData();
form.append('heroImage', fs.createReadStream(testImagePath));

// Відправляємо запит
const options = {
  hostname: 'localhost',
  port: 6614,
  path: '/upload-hero-image',
  method: 'POST',
  headers: form.getHeaders()
};

const req = http.request(options, (res) => {
  console.log(`📥 STATUS: ${res.statusCode}`);
  console.log(`📥 HEADERS:`, JSON.stringify(res.headers, null, 2));

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n📦 RESPONSE BODY:');
    console.log(data);
    console.log('\n==========================================');

    // Видаляємо тестовий файл
    fs.unlinkSync(testImagePath);

    if (res.statusCode === 200) {
      console.log('✅ ТЕСТ ПРОЙДЕНИЙ!');
    } else {
      console.log('❌ ТЕСТ НЕ ПРОЙДЕНИЙ!');
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ ПОМИЛКА ЗАПИТУ:', error.message);
  fs.unlinkSync(testImagePath);
  process.exit(1);
});

form.pipe(req);
