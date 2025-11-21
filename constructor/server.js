const express = require('express');
const path = require('path');
const fs = require('fs');

// Імпорт модулів
const { PATHS, SERVER_CONFIG } = require('./lib/constants');
const configManager = require('./lib/config-manager');
const htmlGenerator = require('./lib/html-generator');
const media = require('./lib/media');
const logger = require('./lib/logger');

// Очищаємо лог при старті
logger.clearLog();
logger.log('Запуск сервера...');

// Express app
const app = express();
const PORT = SERVER_CONFIG.PORT;

// Middleware для логування всіх запитів
app.use((req, res, next) => {
  logger.request(req.method, req.url, req.ip);
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статичні файли
app.use('/public', express.static(PATHS.PUBLIC));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/sections', express.static(PATHS.SECTIONS));

logger.log('Middleware налаштовано');

// ============================================================================
// API ROUTES - КОНФІГУРАЦІЯ
// ============================================================================

app.get('/api/get-user-config', (req, res) => {
  try {
    logger.log('Завантаження конфігу...');
    const config = configManager.loadConfig();
    const keysCount = Object.keys(config).length;
    logger.log('Конфіг завантажено (' + keysCount + ' ключів)');
    res.json(config);
  } catch (err) {
    logger.error('Помилка завантаження конфігу', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/save-config', (req, res) => {
  try {
    logger.log('Збереження конфігу...');
    const success = configManager.updateConfig(req.body);
    if (success) {
      logger.log('Конфіг успішно збережено');
      res.json({ success: true, message: 'Конфіг збережено' });
    } else {
      logger.error('Не вдалось зберегти конфіг');
      res.status(500).json({ error: 'Помилка збереження' });
    }
  } catch (err) {
    logger.error('Помилка збереження конфігу', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/save-config-backup', (req, res) => {
  try {
    const { timestamp, config } = req.body;
    logger.log('Створення бекапу (' + timestamp + ')...');

    if (!fs.existsSync(PATHS.BACKUPS)) {
      fs.mkdirSync(PATHS.BACKUPS, { recursive: true });
    }

    const backupPath = path.join(PATHS.BACKUPS, 'user-config-' + timestamp + '.json');
    fs.writeFileSync(backupPath, JSON.stringify(config, null, 2), 'utf8');

    logger.log('Бекап створено: ' + timestamp);
    res.json({ success: true, message: 'Бекап створено' });
  } catch (err) {
    logger.error('Помилка створення бекапу', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// API ROUTES - ЗАВАНТАЖЕННЯ ФОТО
// ============================================================================

const heroUploader = media.createHeroImageUploader(PATHS.PUBLIC_IMG_HERO);
app.post('/api/upload-hero-image', heroUploader.single('heroImage'), (req, res) => {
  logger.log('Завантаження hero image...');
  media.handleHeroImageUpload(req, res, PATHS.PUBLIC_IMG_HERO);
});

const productUploader = media.createProductImageUploader(PATHS.PUBLIC_IMG_PRODUCTS);
app.post('/api/upload-product-image/:productNumber', productUploader.single('productImage'), (req, res) => {
  const productNumber = req.params.productNumber;
  logger.log('Завантаження product image ' + productNumber + '...');
  media.handleProductImageUpload(req, res, PATHS.PUBLIC_IMG_PRODUCTS, productNumber);
});

// ============================================================================
// ГОЛОВНА СТОРІНКА - ФОРМА КОНСТРУКТОРА
// ============================================================================

app.get('/', (req, res) => {
  logger.log('Відправка form.html');
  res.sendFile(PATHS.FORM_HTML);
});

// ============================================================================
// ГЕНЕРАЦІЯ HTML
// ============================================================================

app.get('/api/preview', (req, res) => {
  try {
    logger.log('Генерація preview...');
    const config = configManager.loadConfig();
    const html = htmlGenerator.generateHTML(config);
    logger.log('Preview згенеровано успішно');
    res.send(html);
  } catch (err) {
    logger.error('Помилка генерації preview', err);
    res.status(500).send('<h1>Помилка генерації</h1><pre>' + err.message + '</pre>');
  }
});

// ============================================================================
// API для генерації чат-відгуків
// ============================================================================

app.post('/api/generate-chat-review', async (req, res) => {
  logger.request(req);
  logger.log('Генерація чат-відгуку...');

  try {
    const { clientName, clientMessage, shopResponse, template } = req.body;

    // Імпортуємо Instagram-стиль генератор
    const { generateInstagramReview } = require('./lib/instagram-generator');

    // Генеруємо відгук з текстом
    const imagePath = await generateInstagramReview({
      clientName: clientName || 'Клієнт',
      clientMessage: clientMessage || 'Дякую за товар!',
      shopResponse: shopResponse || 'Дякуємо за відгук!',
      template: template || '1'
    });

    // Дані відгуку для повернення
    const reviewData = {
      clientName,
      clientMessage,
      shopResponse,
      template,
      imagePath,
      timestamp: Date.now()
    };

    logger.log('Чат-відгук згенеровано:', reviewData);
    res.json({ success: true, imagePath, data: reviewData });

  } catch (err) {
    logger.error('Помилка генерації чат-відгуку', err);

    // Якщо генерація не вдалась, повертаємо існуючий файл як fallback
    const fallbackImages = [
      '/public/img/comments/comments-1.webp',
      '/public/img/comments/comments-2.webp',
      '/public/img/comments/comments-3.webp',
      '/public/img/comments/comments-4.webp'
    ];

    const template = req.body.template || '1';
    const templateIndex = parseInt(template) - 1;
    const fallbackImage = fallbackImages[templateIndex] || fallbackImages[0];

    res.json({
      success: true,
      imagePath: fallbackImage,
      data: req.body,
      fallback: true
    });
  }
});

app.post('/api/generate', (req, res) => {
  try {
    logger.log('Генерація index.html...');
    const config = configManager.loadConfig();
    const html = htmlGenerator.generateHTML(config);

    fs.writeFileSync(PATHS.OUTPUT_INDEX, html, 'utf8');

    logger.log('index.html успішно згенеровано');
    res.json({
      success: true,
      message: 'Сайт згенеровано',
      path: PATHS.OUTPUT_INDEX
    });
  } catch (err) {
    logger.error('Помилка генерації', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// ЗАПУСК СЕРВЕРА
// ============================================================================

const server = app.listen(PORT, () => {
  logger.log('Сервер запущено на порту ' + PORT);
  console.log('\n╔═════════════════════════════════════════╗');
  console.log('║  🚀  КОНСТРУКТОР ЛЕНДІНГІВ - ЗАПУЩЕНО  ║');
  console.log('╚═════════════════════════════════════════╝\n');
  console.log('✅ Сервер працює на порту: ' + PORT);
  console.log('🔗 Головна сторінка: http://localhost:' + PORT + '/');
  console.log('📊 API дані: http://localhost:' + PORT + '/api/get-user-config');
  console.log('🎨 Перегляд: http://localhost:' + PORT + '/api/preview');
  console.log('📝 Логи: constructor/server.log\n');
  console.log('⏹️  Для зупинки натисніть CTRL+C\n');
});

server.on('error', (err) => {
  logger.error('Помилка сервера', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.log('SIGTERM отримано, зупинка сервера...');
  server.close(() => {
    logger.log('Сервер зупинено');
    process.exit(0);
  });
});
