// Простий тест canvas
const { createCanvas } = require('canvas');

try {
  console.log('Тестуємо canvas...');

  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  // Малюємо простий прямокутник
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 200, 200);

  // Спробуємо отримати buffer
  const buffer = canvas.toBuffer('image/png');
  console.log('Buffer створено успішно:', buffer.length, 'байт');

  // Зберігаємо файл
  const fs = require('fs');
  fs.writeFileSync('./test-canvas.png', buffer);
  console.log('Файл збережено успішно!');

} catch (error) {
  console.error('Помилка:', error);
}