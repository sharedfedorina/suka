const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // Використаємо sharp який вже встановлений

async function generateSimpleReview(data) {
  const { clientName, clientMessage, shopResponse, template = '1' } = data;
  const timestamp = Date.now();

  // Визначаємо кольори за шаблоном
  const templates = {
    '1': { bg: '#f0f2f5', text: '#000000' },
    '2': { bg: '#1c1e21', text: '#ffffff' },
    '3': { bg: '#ffffff', text: '#5b51d8' },
    '4': { bg: '#ffffff', text: '#25d366' }
  };

  const colors = templates[template] || templates['1'];

  // Створюємо SVG з текстом відгуку
  const svg = `
    <svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="600" fill="${colors.bg}"/>

      <!-- Заголовок -->
      <text x="200" y="40" font-family="Arial" font-size="16" fill="#888" text-anchor="middle">
        Відгук клієнта
      </text>

      <!-- Ім'я клієнта -->
      <text x="30" y="90" font-family="Arial" font-size="14" fill="#666">
        ${clientName || 'Клієнт'}
      </text>

      <!-- Бульбашка клієнта -->
      <rect x="30" y="100" width="300" height="120" rx="15" fill="#e3e6ea"/>
      <text x="45" y="130" font-family="Arial" font-size="15" fill="#000">
        <tspan x="45" dy="0">${clientMessage ? clientMessage.slice(0, 35) : 'Дякую за товар!'}</tspan>
        <tspan x="45" dy="20">${clientMessage ? clientMessage.slice(35, 70) : ''}</tspan>
        <tspan x="45" dy="20">${clientMessage ? clientMessage.slice(70, 105) : ''}</tspan>
      </text>

      <!-- ComoYo -->
      <text x="370" y="270" font-family="Arial" font-size="14" fill="#666" text-anchor="end">
        ComoYo
      </text>

      <!-- Бульбашка відповіді -->
      <rect x="70" y="280" width="300" height="100" rx="15" fill="#0084ff"/>
      <text x="85" y="310" font-family="Arial" font-size="15" fill="#fff">
        <tspan x="85" dy="0">${shopResponse ? shopResponse.slice(0, 35) : 'Дякуємо за відгук!'}</tspan>
        <tspan x="85" dy="20">${shopResponse ? shopResponse.slice(35, 70) : ''}</tspan>
      </text>

      <!-- Час -->
      <text x="200" y="550" font-family="Arial" font-size="12" fill="#999" text-anchor="middle">
        ${new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
      </text>
    </svg>
  `;

  // Конвертуємо SVG в PNG використовуючи Sharp
  const fileName = `review-${timestamp}.png`;
  const filePath = path.join(__dirname, '..', 'public', 'img', 'comments', fileName);

  await sharp(Buffer.from(svg))
    .png()
    .toFile(filePath);

  console.log(`Згенеровано відгук: ${fileName}`);
  return `/public/img/comments/${fileName}`;
}

module.exports = { generateSimpleReview };