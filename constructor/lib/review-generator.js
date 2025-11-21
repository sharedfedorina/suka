const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Генерує зображення чат-відгуку з текстом
 * @param {Object} data - Дані для генерації
 * @param {string} data.clientName - Ім'я клієнта
 * @param {string} data.clientMessage - Повідомлення клієнта
 * @param {string} data.shopResponse - Відповідь магазину
 * @param {string} data.template - Номер шаблону (1-4)
 * @returns {Promise<string>} - Шлях до згенерованого файлу
 */
async function generateChatReview(data) {
  try {
    const { clientName, clientMessage, shopResponse, template = '1' } = data;
    const timestamp = Date.now();

    // Визначаємо параметри шаблону
    const templates = {
      '1': {
        bgColor: '#f0f2f5',
        clientBubbleColor: '#e3e6ea',
        shopBubbleColor: '#0084ff',
        clientTextColor: '#000000',
        shopTextColor: '#ffffff',
        font: 'Arial'
      },
      '2': {
        bgColor: '#1c1e21',
        clientBubbleColor: '#3a3b3c',
        shopBubbleColor: '#0084ff',
        clientTextColor: '#e4e6eb',
        shopTextColor: '#ffffff',
        font: 'Arial'
      },
      '3': {
        bgColor: '#ffffff',
        clientBubbleColor: '#efefef',
        shopBubbleColor: '#5b51d8',
        clientTextColor: '#000000',
        shopTextColor: '#ffffff',
        font: 'Arial'
      },
      '4': {
        bgColor: '#ffffff',
        clientBubbleColor: '#f1f1f1',
        shopBubbleColor: '#25d366',
        clientTextColor: '#000000',
        shopTextColor: '#ffffff',
        font: 'Arial'
      }
    };

    const config = templates[template] || templates['1'];

    // Створюємо canvas
    const width = 400;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Фон
    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, width, height);

    // Функція для малювання бульбашки повідомлення
    function drawBubble(x, y, width, height, radius, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
    }

    // Функція для обгортання тексту
    function wrapText(text, maxWidth) {
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }

    // Налаштування шрифту
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    let yPosition = 50;
    const padding = 20;
    const bubblePadding = 12;
    const maxBubbleWidth = 280;

    // Заголовок чату (опціонально)
    ctx.fillStyle = '#888888';
    ctx.font = '14px Arial';
    ctx.fillText('Відгуки клієнтів', width / 2 - 50, 20);

    // Повідомлення клієнта
    if (clientMessage) {
      ctx.font = '16px Arial';
      const clientLines = wrapText(clientMessage, maxBubbleWidth - bubblePadding * 2);
      const clientHeight = clientLines.length * 22 + bubblePadding * 2;
      const clientWidth = Math.min(
        Math.max(...clientLines.map(line => ctx.measureText(line).width)) + bubblePadding * 2,
        maxBubbleWidth
      );

      // Малюємо бульбашку клієнта (ліва сторона)
      drawBubble(padding, yPosition, clientWidth, clientHeight, 15, config.clientBubbleColor);

      // Текст клієнта
      ctx.fillStyle = config.clientTextColor;
      clientLines.forEach((line, index) => {
        ctx.fillText(line, padding + bubblePadding, yPosition + bubblePadding + index * 22);
      });

      // Ім'я клієнта
      ctx.fillStyle = '#888888';
      ctx.font = '12px Arial';
      ctx.fillText(clientName || 'Клієнт', padding, yPosition - 20);

      yPosition += clientHeight + 30;
    }

    // Відповідь магазину
    if (shopResponse) {
      ctx.font = '16px Arial';
      const shopLines = wrapText(shopResponse, maxBubbleWidth - bubblePadding * 2);
      const shopHeight = shopLines.length * 22 + bubblePadding * 2;
      const shopWidth = Math.min(
        Math.max(...shopLines.map(line => ctx.measureText(line).width)) + bubblePadding * 2,
        maxBubbleWidth
      );

      // Малюємо бульбашку магазину (права сторона)
      const shopX = width - padding - shopWidth;
      drawBubble(shopX, yPosition, shopWidth, shopHeight, 15, config.shopBubbleColor);

      // Текст магазину
      ctx.fillStyle = config.shopTextColor;
      shopLines.forEach((line, index) => {
        ctx.fillText(line, shopX + bubblePadding, yPosition + bubblePadding + index * 22);
      });

      // Назва магазину
      ctx.fillStyle = '#888888';
      ctx.font = '12px Arial';
      ctx.fillText('ComoYo', shopX + shopWidth - 50, yPosition - 20);
    }

    // Додаємо час (опціонально)
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '11px Arial';
    const time = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    ctx.fillText(time, width / 2 - 20, height - 30);

    // Зберігаємо зображення
    const fileName = `review-${timestamp}.png`;
    const filePath = path.join(__dirname, '..', 'public', 'img', 'comments', fileName);
    const buffer = canvas.toBuffer();  // Використовуємо синхронний метод без параметрів
    fs.writeFileSync(filePath, buffer);

    logger.log(`Згенеровано відгук: ${fileName}`);
    return `/public/img/comments/${fileName}`;

  } catch (error) {
    logger.error('Помилка генерації відгуку:', error);
    throw error;
  }
}

module.exports = {
  generateChatReview
};