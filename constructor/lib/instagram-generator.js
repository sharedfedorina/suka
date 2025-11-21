const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateInstagramReview(data) {
  const { clientName, clientMessage, shopResponse, template = '1' } = data;
  const timestamp = Date.now();

  // Визначаємо стилі для різних шаблонів
  const templates = {
    '1': { // Instagram Light
      bgColor: '#ffffff',
      headerBg: '#ffffff',
      borderColor: '#dbdbdb',
      textColor: '#262626',
      secondaryText: '#8e8e8e',
      shopNameColor: '#262626',
      heartColor: '#ed4956'
    },
    '2': { // Instagram Dark
      bgColor: '#000000',
      headerBg: '#000000',
      borderColor: '#262626',
      textColor: '#ffffff',
      secondaryText: '#a8a8a8',
      shopNameColor: '#ffffff',
      heartColor: '#ed4956'
    },
    '3': { // Facebook/Messenger
      bgColor: '#f0f2f5',
      headerBg: '#ffffff',
      borderColor: '#e4e6e9',
      textColor: '#050505',
      secondaryText: '#65676b',
      shopNameColor: '#050505',
      heartColor: '#f02849'
    },
    '4': { // WhatsApp style
      bgColor: '#e5ddd5',
      headerBg: '#075e54',
      borderColor: '#075e54',
      textColor: '#303030',
      secondaryText: '#667781',
      shopNameColor: '#075e54',
      heartColor: '#25d366'
    }
  };

  const style = templates[template] || templates['1'];

  // SVG з Instagram-подібним дизайном
  const svg = `
    <svg width="400" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="avatar" x="0" y="0" width="100%" height="100%">
          <circle cx="20" cy="20" r="20" fill="#ff6b6b"/>
          <text x="20" y="26" font-family="Arial" font-size="18" fill="white" text-anchor="middle">
            ${clientName ? clientName.charAt(0).toUpperCase() : 'U'}
          </text>
        </pattern>
      </defs>

      <!-- Фон -->
      <rect width="400" height="800" fill="${style.bgColor}"/>

      <!-- Верхня панель (статус бар) -->
      <rect x="0" y="0" width="400" height="40" fill="${style.headerBg}"/>
      <text x="20" y="28" font-family="Arial" font-size="14" fill="${style.textColor}">14:17</text>
      <text x="360" y="28" font-family="Arial" font-size="14" fill="${style.textColor}" text-anchor="end">63%</text>

      <!-- Заголовок секції -->
      <rect x="0" y="40" width="400" height="60" fill="${style.headerBg}"/>
      <text x="200" y="75" font-family="Arial" font-size="18" fill="${style.textColor}" font-weight="500" text-anchor="middle">
        Відгуки
      </text>

      <!-- Розділова лінія -->
      <line x1="0" y1="100" x2="400" y2="100" stroke="${style.borderColor}" stroke-width="1"/>

      <!-- Коментар клієнта -->
      <g transform="translate(20, 120)">
        <!-- Аватар -->
        <circle cx="25" cy="25" r="22" fill="url(#avatar)"/>

        <!-- Ім'я користувача -->
        <text x="60" y="22" font-family="Arial" font-size="14" font-weight="600" fill="${style.textColor}">
          ${clientName || 'Клієнт'}
        </text>

        <!-- Текст коментаря -->
        <foreignObject x="60" y="30" width="300" height="200">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial; font-size: 14px; color: ${style.textColor}; line-height: 1.4;">
            ${clientMessage || 'Дякую за чудовий товар!'}
          </div>
        </foreignObject>

        <!-- Час і реакції -->
        <text x="60" y="130" font-family="Arial" font-size="12" fill="${style.secondaryText}">
          3 год.
        </text>
        <text x="110" y="130" font-family="Arial" font-size="12" fill="${style.secondaryText}">
          Супер
        </text>
        <text x="170" y="130" font-family="Arial" font-size="12" fill="${style.secondaryText}">
          Відповісти
        </text>

        <!-- Лайк -->
        <text x="330" y="130" font-family="Arial" font-size="14" fill="${style.heartColor}">
          1 ❤️
        </text>
      </g>

      <!-- Відповідь магазину -->
      <g transform="translate(40, 280)">
        <!-- Аватар магазину -->
        <circle cx="25" cy="25" r="22" fill="${style.shopNameColor}"/>
        <text x="25" y="30" font-family="Arial" font-size="16" fill="white" font-weight="bold" text-anchor="middle">
          C
        </text>

        <!-- Назва магазину з галочкою -->
        <text x="60" y="22" font-family="Arial" font-size="14" font-weight="600" fill="${style.textColor}">
          ComoYo
        </text>
        <text x="120" y="22" font-family="Arial" font-size="12" fill="#0095f6">✓</text>
        <text x="140" y="22" font-family="Arial" font-size="12" fill="${style.secondaryText}">Автор</text>

        <!-- Текст відповіді з тегом -->
        <text x="60" y="45" font-family="Arial" font-size="14" fill="#0095f6">
          @${clientName ? clientName.toLowerCase().replace(/\s+/g, '') : 'user'}
        </text>

        <foreignObject x="60" y="50" width="280" height="100">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial; font-size: 14px; color: ${style.textColor}; line-height: 1.4;">
            ${shopResponse || 'Дякуємо за ваш відгук! ❤️ Раді, що все сподобалось 😊'}
          </div>
        </foreignObject>

        <!-- Час і реакції -->
        <text x="60" y="140" font-family="Arial" font-size="12" fill="${style.secondaryText}">
          3 год.
        </text>
        <text x="110" y="140" font-family="Arial" font-size="12" fill="${style.secondaryText}">
          Подобається
        </text>
        <text x="190" y="140" font-family="Arial" font-size="12" fill="${style.secondaryText}">
          Відповісти
        </text>
      </g>

      <!-- Нижня панель введення -->
      <g transform="translate(0, 680)">
        <rect x="0" y="0" width="400" height="1" fill="${style.borderColor}"/>
        <rect x="0" y="1" width="400" height="80" fill="${style.headerBg}"/>

        <rect x="20" y="20" width="280" height="40" rx="20" fill="${style.bgColor}" stroke="${style.borderColor}" stroke-width="1"/>
        <text x="40" y="45" font-family="Arial" font-size="14" fill="${style.secondaryText}">
          Відповісти від імені ComoYo...
        </text>

        <!-- Іконки -->
        <text x="320" y="45" font-family="Arial" font-size="20">📷</text>
        <text x="345" y="45" font-family="Arial" font-size="20">GIF</text>
        <text x="370" y="45" font-family="Arial" font-size="20">😊</text>
      </g>
    </svg>
  `;

  // Зберігаємо як PNG
  const fileName = `review-${timestamp}.png`;
  const filePath = path.join(__dirname, '..', 'public', 'img', 'comments', fileName);

  await sharp(Buffer.from(svg))
    .png()
    .resize(400, 800)
    .toFile(filePath);

  console.log(`Згенеровано Instagram-стиль відгук: ${fileName}`);
  return `/public/img/comments/${fileName}`;
}

module.exports = { generateInstagramReview };