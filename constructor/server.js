const express = require('express');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const PORT = 6614;

app.use(express.json());

// GET / - Сервірування конструктора з окремих файлів
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

app.use(express.static(__dirname, { index: false }));

// Налаштування multer для завантаження фото
const heroImageDir = path.join(__dirname, 'public', 'img', 'hero');
if (!fs.existsSync(heroImageDir)) {
  fs.mkdirSync(heroImageDir, { recursive: true });
}

const imageDir = path.join(__dirname, 'public', 'img', 'image');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

const videoDir = path.join(__dirname, 'video');
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, heroImageDir);
  },
  filename: (req, file, cb) => {
    // Зберігаємо з одинаковим ім'ям, отримуємо розширення з оригіналу
    const ext = path.extname(file.originalname);
    cb(null, 'custom-hero' + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB максимум
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Тільки зображення дозволені'));
    }
  }
});

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'custom-image' + ext);
  }
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB максимум
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Тільки зображення дозволені'));
    }
  }
});

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    const timestamp = Date.now();
    cb(null, 'custom-video-' + timestamp + ext);
  }
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB ?????
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('????????? ???? ??????????'));
    }
  }
});

// Функція для генерування слайдів з масиву зображень
function generateSlides(images = []) {
  if (!Array.isArray(images) || images.length === 0) {
    return '';
  }

  return images.map(imagePath => {
    // Convert JPG to mobile format (replace .jpg with _m.webp)
    const mobilePath = imagePath.replace(/\.jpg$/, '_m.webp');

    return `          <div class="swiper-slide products-slide">
           <picture>
            <source srcset="${imagePath}" media="(min-width: 800px)">
            <img src="${mobilePath}" alt="img">
           </picture>
          </div>`;
  }).join('\n');
}

// Функція для генерування HTML з даних
function generateHTML(dataObj, options = {}) {
  try {
    const templatePath = path.join(__dirname, 'index.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // Замінити основні поля
    html = html.replace(
      /<title>.*?<\/title>/,
      `<title>${dataObj.page.title}</title>`
    );

    // Замінити плейсхолдери для хедер текст, титл, ціна
    const finalHeaderText = (options.headerText && options.headerText.trim()) ? options.headerText : (dataObj.headerText || '');
    const finalHeroTitle = (options.heroTitle && options.heroTitle.trim()) ? options.heroTitle : (dataObj.heroTitle || '');
    const finalHeroPrice = (options.heroPrice && options.heroPrice.trim()) ? options.heroPrice : (dataObj.hero?.price || '');
    const finalStockCount = (options.stockCount && options.stockCount.toString().trim()) ? options.stockCount : (dataObj.hero?.stock_count || '19');

    html = html.replace('{{headerText}}', finalHeaderText);
    html = html.replace('{{heroTitle}}', finalHeroTitle);
    html = html.replace('{{heroPrice}}', finalHeroPrice);
    html = html.replace('{{stockCount}}', finalStockCount);

    // Видалити таймер якщо вимкнено
    if (options.enableTimer !== 'on' && options.enableTimer !== true) {
      // Видалити весь блок за допомогою HTML коментарів
      html = html.replace(/\s*<!--\s*timer\s*-->[\s\S]*?<!--\s*\/timer\s*-->\s*/g, '');
    }

    // Видалити блок "Залишилось X футболок" якщо вимкнено
    if (options.enableStock !== 'on' && options.enableStock !== true) {
      // Видалити весь блок за допомогою HTML коментарів
      html = html.replace(/\s*<!--\s*stock\s*-->[\s\S]*?<!--\s*\/stock\s*-->\s*/g, '');
    }

    // Замінити hero фото
    if (options.heroImage) {
      html = html.replace(
        /img\/start\/start-1_m\.webp/g,
        options.heroImage
      );
    }

    // Замінити imageUrl у plus-logo блоці
    const finalImageUrl = (options.imageUrl && options.imageUrl.trim()) ? options.imageUrl : (dataObj.imageUrl || '');
    html = html.replace(`{{imageUrl}}`, finalImageUrl);

    const imageToggle = (options.enableImage !== undefined) ? options.enableImage : dataObj.enableImage;


    // Видалити image блок якщо вимкнено
    if (imageToggle !== 'on' && imageToggle !== true) {
      html = html.replace(/\s*<!--\s*image\s*-->[\s\S]*?<!--\s*\/image\s*-->\s*/g, '');
    }

    const finalVideoUrl = (options.videoUrl && options.videoUrl.trim()) ? options.videoUrl : (dataObj.videoUrl || '');
    html = html.replace('{{videoUrl}}', finalVideoUrl);
    const videoToggle = (options.enableVideo !== undefined) ? options.enableVideo : dataObj.enableVideo;


    if (videoToggle !== 'on' && videoToggle !== true) {
      html = html.replace(/\s*<!--\s*video\s*-->[\s\S]*?<!--\s*\/video\s*-->\s*/g, '');
    }

    // Замінити плейсхолдери для 5 продуктів
    for (let i = 1; i <= 5; i++) {
      const productName = options[`product${i}Name`] || '';
      const productColor = options[`product${i}Color`] || '';
      const productColorHex = options[`product${i}ColorHex`] || '';
      const productSize = options[`product${i}Size`] || '';
      const productMaterial = options[`product${i}Material`] || '';
      const productPriceOld = options[`product${i}PriceOld`] || '';
      const productPrice = options[`product${i}Price`] || '';
      const productImages = options[`product${i}Images`] || [];

      html = html.replace(`{{product${i}Name}}`, productName);
      html = html.replace(`{{product${i}Color}}`, productColor);
      html = html.replace(`{{product${i}ColorHex}}`, productColorHex);
      html = html.replace(`{{product${i}Size}}`, productSize);
      html = html.replace(`{{product${i}Material}}`, productMaterial);
      html = html.replace(`{{product${i}PriceOld}}`, productPriceOld);
      html = html.replace(`{{product${i}Price}}`, productPrice);

      // Генерувати слайди з масиву зображень
      const slides = generateSlides(productImages);
      html = html.replace(`{{product${i}Slides}}`, slides);

      // Видалити продукт блок якщо вимкнено
      if (options[`enableProduct${i}`] !== 'on' && options[`enableProduct${i}`] !== true) {
        html = html.replace(new RegExp(`<!--product${i}-->\\s*[\\s\\S]*?<!--\\/product${i}-->\\s*`, 'g'), '');
      }
    }

    // Замінити переваги (простій текстовий заміни плейсхолдерів)
    if (options.benefits && Array.isArray(options.benefits)) {
      options.benefits.forEach((benefit) => {
        const num = benefit.id;
        html = html.replace(`{{benefit${num}Title}}`, benefit.title);
        html = html.replace(`{{benefit${num}Description}}`, benefit.description);
      });
    }

    console.log(`✅ HTML успішно згенерований (${html.length} байт)`);
    return html;
  } catch (err) {
    console.error('❌ Помилка при генеруванні HTML:', err.message);
    throw err;
  }
}

// GET /api/data - Повернути JSON дані
app.get('/api/data', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'landing-data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`✅ JSON дані відправлені (${Object.keys(data).length} полів)`);
    res.json(data);
  } catch (err) {
    console.error('❌ Помилка при читанні JSON:', err.message);
    res.status(500).json({ error: 'Помилка при читанні даних' });
  }
});

// GET /api/original-form-data - Отримати оригінальні дані з landing-data.json
app.get('/api/original-form-data', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'landing-data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    const formData = {
      headerText: data.headerText,
      heroTitle: data.heroTitle,
      heroPrice: data.hero.price,
      enableTimer: data.enableTimer,
      enableStock: data.enableStock,
      heroImage: data.heroImage,
      enableImage: data.enableImage,
      imageUrl: data.imageUrl,
      enableVideo: data.enableVideo,
      videoUrl: data.videoUrl,
      benefits: data.benefits || [],
      // Product data
      product1Name: data.product1Name || '',
      product1Color: data.product1Color || '',
      product1ColorHex: data.product1ColorHex || '',
      product1Size: data.product1Size || '',
      product1Material: data.product1Material || '',
      product1PriceOld: data.product1PriceOld || '',
      product1Price: data.product1Price || '',
      product1Images: data.product1Images || [],
      enableProduct1: data.enableProduct1 || true,
      product2Name: data.product2Name || '',
      product2Color: data.product2Color || '',
      product2ColorHex: data.product2ColorHex || '',
      product2Size: data.product2Size || '',
      product2Material: data.product2Material || '',
      product2PriceOld: data.product2PriceOld || '',
      product2Price: data.product2Price || '',
      product2Images: data.product2Images || [],
      enableProduct2: data.enableProduct2 || true,
      product3Name: data.product3Name || '',
      product3Color: data.product3Color || '',
      product3ColorHex: data.product3ColorHex || '',
      product3Size: data.product3Size || '',
      product3Material: data.product3Material || '',
      product3PriceOld: data.product3PriceOld || '',
      product3Price: data.product3Price || '',
      product3Images: data.product3Images || [],
      enableProduct3: data.enableProduct3 || true,
      product4Name: data.product4Name || '',
      product4Color: data.product4Color || '',
      product4ColorHex: data.product4ColorHex || '',
      product4Size: data.product4Size || '',
      product4Material: data.product4Material || '',
      product4PriceOld: data.product4PriceOld || '',
      product4Price: data.product4Price || '',
      product4Images: data.product4Images || [],
      enableProduct4: data.enableProduct4 || true,
      product5Name: data.product5Name || '',
      product5Color: data.product5Color || '',
      product5ColorHex: data.product5ColorHex || '',
      product5Size: data.product5Size || '',
      product5Material: data.product5Material || '',
      product5PriceOld: data.product5PriceOld || '',
      product5Price: data.product5Price || '',
      product5Images: data.product5Images || [],
      enableProduct5: data.enableProduct5 || true
    };

    console.log(`✅ Оригінальні дані форми отримані`);
    res.json(formData);
  } catch (err) {
    console.error('❌ Помилка при читанні оригінальних даних:', err.message);
    res.status(500).json({ error: 'Помилка при читанні даних' });
  }
});

// GET /api/get-user-config - Отримати збережену конфігурацію користувача
app.get('/api/get-user-config', (req, res) => {
  try {
    const configPath = path.join(__dirname, 'data', 'user-config.json');

    // Якщо файл не існує, повертаємо порожні дані
    if (!fs.existsSync(configPath)) {
      return res.json({
        headerText: '',
        heroTitle: '',
        heroPrice: 'від 330 грн',
        enableTimer: true,
        enableStock: true,
        heroImage: '',
        enableImage: true,
        imageUrl: '',
        enableVideo: true,
        videoUrl: '',
        benefits: [],
        // Product data defaults
        product1Name: '', product1Color: '', product1ColorHex: '', product1Size: '', product1Material: '', product1PriceOld: '', product1Price: '', enableProduct1: true,
        product2Name: '', product2Color: '', product2ColorHex: '', product2Size: '', product2Material: '', product2PriceOld: '', product2Price: '', enableProduct2: true,
        product3Name: '', product3Color: '', product3ColorHex: '', product3Size: '', product3Material: '', product3PriceOld: '', product3Price: '', enableProduct3: true,
        product4Name: '', product4Color: '', product4ColorHex: '', product4Size: '', product4Material: '', product4PriceOld: '', product4Price: '', enableProduct4: true,
        product5Name: '', product5Color: '', product5ColorHex: '', product5Size: '', product5Material: '', product5PriceOld: '', product5Price: '', enableProduct5: true
      });
    }

    // Читати з явним UTF-8 кодуванням
    const fileContent = fs.readFileSync(configPath, { encoding: 'utf8' });
    const config = JSON.parse(fileContent);
    console.log(`✅ Збережена конфігурація отримана:`, config);
    res.json(config);
  } catch (err) {
    console.error('❌ Помилка при читанні конфігурації:', err.message);
    res.status(500).json({ error: 'Помилка при читанні даних' });
  }
});

// POST /api/save-config - Зберегти конфігурацію користувача
app.post('/api/save-config', express.json(), (req, res) => {
  try {
    const configPath = path.join(__dirname, 'data', 'user-config.json');
    const configData = req.body;

    // Записати з явним UTF-8 кодуванням
    const jsonContent = JSON.stringify(configData, null, 2);
    fs.writeFileSync(configPath, jsonContent, { encoding: 'utf8' });
    console.log(`✅ Конфігурація збережена на сервері:`, configData);
    res.json({ success: true, message: 'Конфігурація збережена' });
  } catch (err) {
    console.error('❌ Помилка при збереженні конфігурації:', err.message);
    res.status(500).json({ error: 'Помилка при збереженні даних' });
  }
});

// POST /upload-image - Завантажити нове фото для plus-logo блоку
app.post('/upload-image', uploadImage.single('imageUpload'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажений' });
    }

    console.log(`\n🖼️ ФОТО PLUS-LOGO ЗАВАНТАЖЕНО`);
    console.log(`📁 Оригінальний файл: ${req.file.filename}`);
    console.log(`📏 Розмір: ${(req.file.size / 1024).toFixed(2)} KB`);

    // Отримати базову назву без розширення
    const timestamp = Date.now();
    const basename = `image-${timestamp}`;
    const uploadedPath = req.file.path;

    // Пересохранити та оптимізувати для десктопу (1200x600 - cover)
    const desktopPath = path.join(imageDir, `${basename}.jpg`);
    await sharp(uploadedPath)
      .resize(1200, 600, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile(desktopPath);
    console.log(`✅ Десктоп: ${basename}.jpg (1200x600, 85% quality)`);

    // Пересохранити та оптимізувати для мобільного (600x400 - cover)
    const mobilePath = path.join(imageDir, `${basename}_m.webp`);
    await sharp(uploadedPath)
      .resize(600, 400, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toFile(mobilePath);
    console.log(`✅ Мобільний: ${basename}_m.webp (600x400, 80% quality)`);

    // Видалити оригінальний завантажений файл
    fs.unlinkSync(uploadedPath);
    console.log(`✅ Оригінальний файл видалено\n`);

    res.json({
      success: true,
      filename: `/public/img/image/${basename}_m.webp`,
      message: 'Фото успішно оптимізовано та завантажено'
    });
  } catch (err) {
    console.error('❌ Помилка при завантаженні:', err.message);
    // Спробуємо видалити файл якщо сталася помилка
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // Ігноруємо помилку видалення
      }
    }
    res.status(500).json({ error: err.message });
  }
});

// POST /upload-video - Завантажити нове відео для відео блоку
app.post('/upload-video', uploadVideo.single('videoUpload'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажений' });
    }

    console.log(`\n🎬 ВІДЕО ЗАВАНТАЖЕНО`);
    console.log(`📁 Оригінальний файл: ${req.file.filename}`);
    console.log(`📏 Розмір: ${(req.file.size / 1024).toFixed(2)} KB`);

    const timestamp = Date.now();
    const basename = `video-${timestamp}`;
    const relativePath = `/video/${req.file.filename}`;

    res.json({
      success: true,
      filename: relativePath,
      message: 'Відео успішно завантажено'
    });
  } catch (err) {
    console.error('❌ Помилка при завантаженні відео:', err.message);
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // cleanup при помилці
      }
    }
    res.status(500).json({ error: err.message });
  }
});

// POST /upload-hero-image - Завантажити нове фото для hero блоку
app.post('/upload-hero-image', upload.single('heroImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажений' });
    }

    console.log(`\n🖼️ ФОТО ЗАВАНТАЖЕНО`);
    console.log(`📁 Оригінальний файл: ${req.file.filename}`);
    console.log(`📏 Розмір: ${(req.file.size / 1024).toFixed(2)} KB`);

    // Отримати базову назву без розширення
    const timestamp = Date.now();
    const basename = `hero-${timestamp}`;
    const uploadedPath = req.file.path;

    // Пересохранити та оптимізувати для десктопу (1200x600 - cover)
    const desktopPath = path.join(heroImageDir, `${basename}.jpg`);
    await sharp(uploadedPath)
      .resize(1200, 600, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile(desktopPath);
    console.log(`✅ Десктоп: ${basename}.jpg (1200x600, 85% quality)`);

    // Пересохранити та оптимізувати для мобільного (600x400 - cover)
    const mobilePath = path.join(heroImageDir, `${basename}_m.webp`);
    await sharp(uploadedPath)
      .resize(600, 400, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toFile(mobilePath);
    console.log(`✅ Мобільний: ${basename}_m.webp (600x400, 80% quality)`);

    // Видалити оригінальний завантажений файл
    fs.unlinkSync(uploadedPath);
    console.log(`✅ Оригінальний файл видалено\n`);

    res.json({
      success: true,
      filename: `/public/img/hero/${basename}_m.webp`,
      message: 'Фото успішно оптимізовано та завантажено'
    });
  } catch (err) {
    console.error('❌ Помилка при завантаженні:', err.message);
    // Спробуємо видалити файл якщо сталася помилка
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // Ігноруємо помилку видалення
      }
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /generate - Генерувати та відправити HTML з параметрами
app.get('/generate', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'landing-data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Отримати параметри з query string
    const options = {
      headerText: req.query.headerText,
      heroTitle: req.query.heroTitle,
      heroPrice: req.query.heroPrice,
      enableTimer: req.query.enableTimer,
      enableStock: req.query.enableStock,
      heroImage: req.query.heroImage,
      enableImage: req.query.enableImage,
      imageUrl: req.query.imageUrl,
      enableVideo: req.query.enableVideo,
      videoUrl: req.query.videoUrl
    };

    // Парсити benefits якщо передано як JSON string
    if (req.query.benefits) {
      try {
        options.benefits = JSON.parse(decodeURIComponent(req.query.benefits));
      } catch (e) {
        console.error('❌ Помилка при парсингу benefits:', e.message);
      }
    }

    console.log(`\n🎨 ГЕНЕРУВАННЯ САЙТУ...`);
    console.log(`📝 Параметри:`, options);
    const html = generateHTML(data, options);

    console.log(`✅ Сайт успішно згенерований`);
    console.log(`📏 Розмір: ${(html.length / 1024).toFixed(2)} KB\n`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    console.error('❌ Помилка:', err.message);
    res.status(500).send(`<h1>Помилка при генеруванні</h1><p>${err.message}</p>`);
  }
});

// POST /generate - Генерувати HTML з користувацькими даними
app.post('/generate', (req, res) => {
  try {
    const customData = req.body || {};
    const dataPath = path.join(__dirname, 'data', 'landing-data.json');
    const defaultData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Об'єднати дефолтні та користувацькі дані
    const mergedData = { ...defaultData, ...customData };

    console.log(`\n🎨 ГЕНЕРУВАННЯ З CUSTOM ДАНИМИ...`);
    const html = generateHTML(mergedData);

    console.log(`✅ Сайт успішно згенерований з custom даними`);
    console.log(`📏 Розмір: ${(html.length / 1024).toFixed(2)} KB\n`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    console.error('❌ Помилка:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /export - Генерувати та скачати ZIP архів зі статичним сайтом
app.get('/export', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'landing-data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Отримати параметри з query string
    const options = {
      headerText: req.query.headerText,
      heroTitle: req.query.heroTitle,
      heroPrice: req.query.heroPrice,
      enableTimer: req.query.enableTimer,
      enableStock: req.query.enableStock,
      heroImage: req.query.heroImage,
      enableImage: req.query.enableImage,
      imageUrl: req.query.imageUrl,
      enableVideo: req.query.enableVideo,
      videoUrl: req.query.videoUrl
    };

    // Парсити benefits якщо передано як JSON string
    if (req.query.benefits) {
      try {
        options.benefits = JSON.parse(decodeURIComponent(req.query.benefits));
      } catch (e) {
        console.error('❌ Помилка при парсингу benefits:', e.message);
      }
    }

    console.log(`\n📦 ЕКСПОРТ - СТВОРЕННЯ ZIP АРХІВУ...`);
    console.log(`📝 Параметри:`, options);

    // Генерувати HTML
    const html = generateHTML(data, options);

    // Створити ZIP архів
    const archive = archiver('zip', {
      zlib: { level: 9 } // 9 = максимальне стиснення
    });

    // Обробка помилок
    archive.on('error', (err) => {
      console.error('❌ Помилка при створенні ZIP:', err.message);
      res.status(500).send('Помилка при створенні архіву');
    });

    // Встановити заголовок для скачування
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=landing-kopo.zip');

    // Додати HTML файл
    archive.append(html, { name: 'index.html' });

    // Додати статичні папки
    const dirs = ['css', 'js', 'img', 'fonts', 'icons', 'video'];
    for (const dir of dirs) {
      const dirPath = path.join(__dirname, dir);
      if (fs.existsSync(dirPath)) {
        archive.directory(dirPath, dir);
        console.log(`✅ Додано папку: ${dir}`);
      }
    }

    // Додати завантажене фото якщо існує
    if (options.heroImage) {
      // Витягти ім'я файлу без розширення (hero-123456_m -> hero-123456)
      const filename = path.basename(options.heroImage, '.webp').replace('_m', '');

      // Додати десктоп версію (jpg)
      const heroDesktopPath = path.join(heroImageDir, `${filename}.jpg`);
      if (fs.existsSync(heroDesktopPath)) {
        archive.file(heroDesktopPath, { name: `img/hero/${filename}.jpg` });
        console.log(`✅ Додано десктоп фото: img/hero/${filename}.jpg`);
      }

      // Додати мобільну версію (webp)
      const heroMobilePath = path.join(heroImageDir, `${filename}_m.webp`);
      if (fs.existsSync(heroMobilePath)) {
        archive.file(heroMobilePath, { name: `img/hero/${filename}_m.webp` });
        console.log(`✅ Додано мобільне фото: img/hero/${filename}_m.webp`);
      }
    }

    // Додати файл даних
    archive.append(JSON.stringify(data, null, 2), { name: 'data.json' });

    // Додати .htaccess для Apache (якщо потрібно)
    const htaccess = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ index.html [L]
</IfModule>`;
    archive.append(htaccess, { name: '.htaccess' });

    // Финалізувати архів
    archive.finalize();

    // Передати в response
    archive.pipe(res);

    console.log(`✅ ZIP архів успішно створений и відправлений`);
    console.log(`📏 Розмір сайту: ${(html.length / 1024).toFixed(2)} KB\n`);

  } catch (err) {
    console.error('❌ Помилка при експорті:', err.message);
    res.status(500).send(`Помилка при експорті: ${err.message}`);
  }
});

// Статичні файли (CSS, JS, фото, шрифти) - МАЮТЬ БУТИ В КІНЦІ!
app.use(express.static(path.join(__dirname)));

// Запуск сервера
app.listen(PORT, () => {
  console.log('\n╔═════════════════════════════════════════╗');
  console.log('║  🚀  КОНСТРУКТОР ЛЕНДІНГІВ - ЗАПУЩЕНО  ║');
  console.log('╚═════════════════════════════════════════╝\n');
  console.log(`✅ Сервер працює на порту: ${PORT}`);
  console.log(`🔗 Головна сторінка: http://localhost:${PORT}/`);
  console.log(`📊 API дані: http://localhost:${PORT}/api/data`);
  console.log(`🎨 Генерувати сайт: http://localhost:${PORT}/generate\n`);
  console.log('⏹️  Для зупинки натисніть CTRL+C\n');
});
