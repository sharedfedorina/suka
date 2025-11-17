const express = require('express');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const PORT = 6614;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Для обробки form data

// GET / - Сервірування конструктора з окремих файлів
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

// Disable caching for JS files in development
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  next();
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

const videoThumbnailDir = path.join(__dirname, 'public', 'img', 'video');
if (!fs.existsSync(videoThumbnailDir)) {
  fs.mkdirSync(videoThumbnailDir, { recursive: true });
}

const productsImageDir = path.join(__dirname, 'public', 'img', 'products');
if (!fs.existsSync(productsImageDir)) {
  fs.mkdirSync(productsImageDir, { recursive: true });
}
const productImageDir = productsImageDir; // Alias для сумісності

const sizeChartImageDir = path.join(__dirname, 'public', 'img', 'info');
if (!fs.existsSync(sizeChartImageDir)) {
  fs.mkdirSync(sizeChartImageDir, { recursive: true });
}

const DEFAULT_VIDEO_THUMBNAIL_DESKTOP = 'img/promo/promo-1.jpg';
const DEFAULT_VIDEO_THUMBNAIL_MOBILE = 'img/promo/promo-1_m.webp';

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


const videoThumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoThumbnailDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const timestamp = Date.now();
    cb(null, 'custom-video-thumb-' + timestamp + ext);
  }
});

const uploadVideoThumbnail = multer({
  storage: videoThumbnailStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Неприпустимий формат прев\'ю'));
    }
  }
});

const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsImageDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const timestamp = Date.now();
    cb(null, 'product-' + timestamp + ext);
  }
});

const uploadProductImage = multer({
  storage: productImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB максимум
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Тільки зображення дозволені'));
    }
  }
});

const sizeChartImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, sizeChartImageDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const timestamp = Date.now();
    cb(null, 'size-chart-' + timestamp + ext);
  }
});

const uploadSizeChartImage = multer({
  storage: sizeChartImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB максимум
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Тільки зображення дозволені'));
    }
  }
});

function parseArrayParam(value, fallback = []) {
  if (!value) {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (err) {
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch (parseErr) {
      console.error('Failed to parse array param:', parseErr.message);
      return fallback;
    }
  }
}


// Функція для генерування слайдів з масиву зображень
function generateSlides(images = []) {
  if (!Array.isArray(images) || images.length === 0) {
    return '';
  }

  return images.map(imagePath => {
    // Remove leading slash for relative paths in generated HTML
    const desktopPath = imagePath.replace(/^\//, '');

    // Generate mobile path: replace .jpg with _m.webp
    const mobilePath = desktopPath.replace(/\.jpg$/, '_m.webp');

    // Desktop gets JPG, mobile gets WebP
    return `          <div class="swiper-slide products-slide">
           <picture>
            <source srcset="${desktopPath}" media="(min-width: 800px)">
            <img src="${mobilePath}" alt="img">
           </picture>
          </div>`;
  }).join('\n');
}

// Функція для генерування HTML з даних
function generateHTML(dataObj, options = {}) {
  try {
    const templatePath = path.join(__dirname, 'views', 'template.ejs');
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

    // Замінити hero фото (desktop + mobile)
    if (options.heroImage) {
      // Видалити тільки початковий слеш: /public/img/hero/hero-123.jpg -> public/img/hero/hero-123.jpg
      const desktopPath = options.heroImage.replace(/^\//, '');

      // Згенерувати mobile шлях: public/img/hero/hero-123.jpg -> public/img/hero/hero-123_m.webp
      const mobilePath = desktopPath.replace(/\.jpg$/, '_m.webp');

      // Замінити desktop версію
      html = html.replace(
        /img\/start\/start-1\.png/g,
        desktopPath
      );

      // Замінити mobile версію
      html = html.replace(
        /img\/start\/start-1_m\.webp/g,
        mobilePath
      );
    }

    // Замінити imageUrl у plus-logo блоці
    const rawImageUrl = (options.imageUrl && options.imageUrl.trim()) ? options.imageUrl : (dataObj.imageUrl || '');
    const finalImageUrl = rawImageUrl.replace(/^\//, '');
    html = html.replace(`{{imageUrl}}`, finalImageUrl);

    const imageToggle = (options.enableImage !== undefined) ? options.enableImage : dataObj.enableImage;


    // Видалити image блок якщо вимкнено
    if (imageToggle !== 'on' && imageToggle !== true) {
      html = html.replace(/\s*<!--\s*image\s*-->[\s\S]*?<!--\s*\/image\s*-->\s*/g, '');
    }

    const rawVideoUrl = (options.videoUrl && options.videoUrl.trim()) ? options.videoUrl : (dataObj.videoUrl || '');
    const finalVideoUrl = rawVideoUrl.replace(/^\//, '');
    html = html.replace('{{videoUrl}}', finalVideoUrl);
    const videoToggle = (options.enableVideo !== undefined) ? options.enableVideo : dataObj.enableVideo;


    if (videoToggle !== 'on' && videoToggle !== true) {
      html = html.replace(/\s*<!--\s*video\s*-->[\s\S]*?<!--\s*\/video\s*-->\s*/g, '');
    }

    const rawVideoThumbnailDesktop = (options.videoThumbnailDesktop && options.videoThumbnailDesktop.trim()) ? options.videoThumbnailDesktop : (dataObj.videoThumbnailDesktop || DEFAULT_VIDEO_THUMBNAIL_DESKTOP);
    const rawVideoThumbnailMobile = (options.videoThumbnailMobile && options.videoThumbnailMobile.trim()) ? options.videoThumbnailMobile : (dataObj.videoThumbnailMobile || DEFAULT_VIDEO_THUMBNAIL_MOBILE);
    const finalVideoThumbnailDesktop = rawVideoThumbnailDesktop.replace(/^\//, '');
    const finalVideoThumbnailMobile = rawVideoThumbnailMobile.replace(/^\//, '');
    html = html.replace('{{videoThumbnailDesktop}}', finalVideoThumbnailDesktop);
    html = html.replace('{{videoThumbnailMobile}}', finalVideoThumbnailMobile);
    const videoThumbnailToggle = (options.enableVideoThumbnail !== undefined) ? options.enableVideoThumbnail : (dataObj.enableVideoThumbnail !== undefined ? dataObj.enableVideoThumbnail : true);
    if (videoThumbnailToggle !== 'on' && videoThumbnailToggle !== true) {
      html = html.replace(/\s*<!--\s*videoThumbnail\s*-->[\s\S]*?<!--\s*\/videoThumbnail\s*-->\s*/g, '');
    }

    // Замінити фото розмірної сітки
    const rawSizeChartImage = (options.sizeChartImage && options.sizeChartImage.trim()) ? options.sizeChartImage : (dataObj.sizeChartImage || 'img/info/info-1.webp');
    const finalSizeChartImage = rawSizeChartImage.replace(/^\//, '');
    html = html.replace('{{sizeChartImage}}', finalSizeChartImage);

    // Генерація інформаційного блоку (список характеристик)
    // Збираємо ColorHex з увімкнених продуктів для автогенерації кольорів
    const productColors = [];
    for (let i = 1; i <= 5; i++) {
      const enabledOpt = options[`enableProduct${i}`] === 'on' || options[`enableProduct${i}`] === true;
      const enabledData = dataObj[`enableProduct${i}`] === true;
      const enabled = enabledOpt || (options[`enableProduct${i}`] === undefined && enabledData);
      if (enabled) {
        const colorHex = (options[`product${i}ColorHex`] && options[`product${i}ColorHex`].trim()) ? options[`product${i}ColorHex`] : (dataObj[`product${i}ColorHex`] || '');
        if (colorHex) productColors.push(colorHex);
      }
    }
    // Продукти 8 та 9
    const enabled8Opt = options.enableProduct8 === 'on' || options.enableProduct8 === true;
    const enabled8Data = dataObj.enableProduct8 === true;
    const enabled8 = enabled8Opt || (options.enableProduct8 === undefined && enabled8Data);
    if (enabled8) {
      const colorHex8 = (options.product8ColorHex && options.product8ColorHex.trim()) ? options.product8ColorHex : (dataObj.product8ColorHex || '');
      if (colorHex8) productColors.push(colorHex8);
    }
    const enabled9Opt = options.enableProduct9 === 'on' || options.enableProduct9 === true;
    const enabled9Data = dataObj.enableProduct9 === true;
    const enabled9 = enabled9Opt || (options.enableProduct9 === undefined && enabled9Data);
    if (enabled9) {
      const colorHex9 = (options.product9ColorHex && options.product9ColorHex.trim()) ? options.product9ColorHex : (dataObj.product9ColorHex || '');
      if (colorHex9) productColors.push(colorHex9);
    }

    // Генеруємо SVG кружечки для кольорів
    const colorCircles = productColors.map(color => {
      return `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
           <circle cx="13" cy="13" r="13" fill="${color}" />
          </svg>`;
    }).join('\n           ');

    // Обробка кожного поля інформаційного блоку
    const infoBrandLabel = (options.infoBrandLabel && options.infoBrandLabel.trim()) ? options.infoBrandLabel : (dataObj.infoBrandLabel || 'Бренд');
    const infoBrandValue = (options.infoBrandValue && options.infoBrandValue.trim()) ? options.infoBrandValue : (dataObj.infoBrandValue || 'Kopo™ (Україна)');
    const infoModelLabel = (options.infoModelLabel && options.infoModelLabel.trim()) ? options.infoModelLabel : (dataObj.infoModelLabel || 'Модель');
    const infoModelValue = (options.infoModelValue && options.infoModelValue.trim()) ? options.infoModelValue : (dataObj.infoModelValue || 'Жіноча');
    const infoQuantityLabel = (options.infoQuantityLabel && options.infoQuantityLabel.trim()) ? options.infoQuantityLabel : (dataObj.infoQuantityLabel || 'Кількість');
    const infoQuantityValue = (options.infoQuantityValue && options.infoQuantityValue.trim()) ? options.infoQuantityValue : (dataObj.infoQuantityValue || 'Одна футболка або набір');
    const infoColorsLabel = (options.infoColorsLabel && options.infoColorsLabel.trim()) ? options.infoColorsLabel : (dataObj.infoColorsLabel || 'Кольори');
    const infoSizesLabel = (options.infoSizesLabel && options.infoSizesLabel.trim()) ? options.infoSizesLabel : (dataObj.infoSizesLabel || 'Розміри');
    const infoSizesValue = (options.infoSizesValue && options.infoSizesValue.trim()) ? options.infoSizesValue : (dataObj.infoSizesValue || 'від S до 5XL');
    const infoMaterialLabel = (options.infoMaterialLabel && options.infoMaterialLabel.trim()) ? options.infoMaterialLabel : (dataObj.infoMaterialLabel || 'Матеріал');
    const infoMaterialValue = (options.infoMaterialValue && options.infoMaterialValue.trim()) ? options.infoMaterialValue : (dataObj.infoMaterialValue || 'Бавовна 95%, еластан 5%');
    const infoPackagingLabel = (options.infoPackagingLabel && options.infoPackagingLabel.trim()) ? options.infoPackagingLabel : (dataObj.infoPackagingLabel || 'Упаковка');
    const infoPackagingValue = (options.infoPackagingValue && options.infoPackagingValue.trim()) ? options.infoPackagingValue : (dataObj.infoPackagingValue || 'Футболки запаковані у фірмовий пакет. Можлива упаковка у подарункову коробку за додаткову плату.');

    html = html.replace('{{infoBrandLabel}}', infoBrandLabel);
    html = html.replace('{{infoBrandValue}}', infoBrandValue);
    html = html.replace('{{infoModelLabel}}', infoModelLabel);
    html = html.replace('{{infoModelValue}}', infoModelValue);
    html = html.replace('{{infoQuantityLabel}}', infoQuantityLabel);
    html = html.replace('{{infoQuantityValue}}', infoQuantityValue);
    html = html.replace('{{infoColorsLabel}}', infoColorsLabel);
    html = html.replace('{{infoColorCircles}}', colorCircles);
    html = html.replace('{{infoSizesLabel}}', infoSizesLabel);
    html = html.replace('{{infoSizesValue}}', infoSizesValue);
    html = html.replace('{{infoMaterialLabel}}', infoMaterialLabel);
    html = html.replace('{{infoMaterialValue}}', infoMaterialValue);
    html = html.replace('{{infoPackagingLabel}}', infoPackagingLabel);
    html = html.replace('{{infoPackagingValue}}', infoPackagingValue);

    // Видалити поля якщо вимкнені (з fallback на dataObj)
    const infoEnableBrand = (options.infoEnableBrand === 'on' || options.infoEnableBrand === true) || (options.infoEnableBrand === undefined && dataObj.infoEnableBrand === true);
    const infoEnableModel = (options.infoEnableModel === 'on' || options.infoEnableModel === true) || (options.infoEnableModel === undefined && dataObj.infoEnableModel === true);
    const infoEnableQuantity = (options.infoEnableQuantity === 'on' || options.infoEnableQuantity === true) || (options.infoEnableQuantity === undefined && dataObj.infoEnableQuantity === true);
    const infoEnableColors = (options.infoEnableColors === 'on' || options.infoEnableColors === true) || (options.infoEnableColors === undefined && dataObj.infoEnableColors === true);
    const infoEnableSizes = (options.infoEnableSizes === 'on' || options.infoEnableSizes === true) || (options.infoEnableSizes === undefined && dataObj.infoEnableSizes === true);
    const infoEnableMaterial = (options.infoEnableMaterial === 'on' || options.infoEnableMaterial === true) || (options.infoEnableMaterial === undefined && dataObj.infoEnableMaterial === true);
    const infoEnablePackaging = (options.infoEnablePackaging === 'on' || options.infoEnablePackaging === true) || (options.infoEnablePackaging === undefined && dataObj.infoEnablePackaging === true);

    if (!infoEnableBrand) {
      html = html.replace(/\s*<!--\s*infoBrand\s*-->[\s\S]*?<!--\s*\/infoBrand\s*-->\s*/g, '');
    }
    if (!infoEnableModel) {
      html = html.replace(/\s*<!--\s*infoModel\s*-->[\s\S]*?<!--\s*\/infoModel\s*-->\s*/g, '');
    }
    if (!infoEnableQuantity) {
      html = html.replace(/\s*<!--\s*infoQuantity\s*-->[\s\S]*?<!--\s*\/infoQuantity\s*-->\s*/g, '');
    }
    if (!infoEnableColors) {
      html = html.replace(/\s*<!--\s*infoColors\s*-->[\s\S]*?<!--\s*\/infoColors\s*-->\s*/g, '');
    }
    if (!infoEnableSizes) {
      html = html.replace(/\s*<!--\s*infoSizes\s*-->[\s\S]*?<!--\s*\/infoSizes\s*-->\s*/g, '');
    }
    if (!infoEnableMaterial) {
      html = html.replace(/\s*<!--\s*infoMaterial\s*-->[\s\S]*?<!--\s*\/infoMaterial\s*-->\s*/g, '');
    }
    if (!infoEnablePackaging) {
      html = html.replace(/\s*<!--\s*infoPackaging\s*-->[\s\S]*?<!--\s*\/infoPackaging\s*-->\s*/g, '');
    }

    // Замінити плейсхолдери для 5 продуктів
    for (let i = 1; i <= 5; i++) {
      const productName = (options[`product${i}Name`] && options[`product${i}Name`].trim()) ? options[`product${i}Name`] : (dataObj[`product${i}Name`] || '');
      const productColor = (options[`product${i}Color`] && options[`product${i}Color`].trim()) ? options[`product${i}Color`] : (dataObj[`product${i}Color`] || '');
      const productColorHex = (options[`product${i}ColorHex`] && options[`product${i}ColorHex`].trim()) ? options[`product${i}ColorHex`] : (dataObj[`product${i}ColorHex`] || '');
      const productSize = (options[`product${i}Size`] && options[`product${i}Size`].trim()) ? options[`product${i}Size`] : (dataObj[`product${i}Size`] || '');
      const productMaterial = (options[`product${i}Material`] && options[`product${i}Material`].trim()) ? options[`product${i}Material`] : (dataObj[`product${i}Material`] || '');
      const productPriceOld = (options[`product${i}PriceOld`] && options[`product${i}PriceOld`].trim()) ? options[`product${i}PriceOld`] : (dataObj[`product${i}PriceOld`] || '');
      const productPrice = (options[`product${i}Price`] && options[`product${i}Price`].trim()) ? options[`product${i}Price`] : (dataObj[`product${i}Price`] || '');
      const productImages = options[`product${i}Images`] || dataObj[`product${i}Images`] || [];

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

    // Замінити дані для продуктів 8 та 9 (те ж саме як продукти 1-5)
    const product8Name = (options.product8Name && options.product8Name.trim()) ? options.product8Name : (dataObj.product8Name || '');
    const product8Color = (options.product8Color && options.product8Color.trim()) ? options.product8Color : (dataObj.product8Color || '');
    const product8ColorHex = (options.product8ColorHex && options.product8ColorHex.trim()) ? options.product8ColorHex : (dataObj.product8ColorHex || '');
    const product8Size = (options.product8Size && options.product8Size.trim()) ? options.product8Size : (dataObj.product8Size || '');
    const product8Material = (options.product8Material && options.product8Material.trim()) ? options.product8Material : (dataObj.product8Material || '');
    const product8PriceOld = (options.product8PriceOld && options.product8PriceOld.trim()) ? options.product8PriceOld : (dataObj.product8PriceOld || '');
    const product8Price = (options.product8Price && options.product8Price.trim()) ? options.product8Price : (dataObj.product8Price || '');

    html = html.replace('{{product8Name}}', product8Name);
    html = html.replace('{{product8Color}}', product8Color);
    html = html.replace('{{product8ColorHex}}', product8ColorHex);
    html = html.replace('{{product8Size}}', product8Size);
    html = html.replace('{{product8Material}}', product8Material);
    html = html.replace('{{product8PriceOld}}', product8PriceOld);
    html = html.replace('{{product8Price}}', product8Price);

    const product9Name = (options.product9Name && options.product9Name.trim()) ? options.product9Name : (dataObj.product9Name || '');
    const product9Color = (options.product9Color && options.product9Color.trim()) ? options.product9Color : (dataObj.product9Color || '');
    const product9ColorHex = (options.product9ColorHex && options.product9ColorHex.trim()) ? options.product9ColorHex : (dataObj.product9ColorHex || '');
    const product9Size = (options.product9Size && options.product9Size.trim()) ? options.product9Size : (dataObj.product9Size || '');
    const product9Material = (options.product9Material && options.product9Material.trim()) ? options.product9Material : (dataObj.product9Material || '');
    const product9PriceOld = (options.product9PriceOld && options.product9PriceOld.trim()) ? options.product9PriceOld : (dataObj.product9PriceOld || '');
    const product9Price = (options.product9Price && options.product9Price.trim()) ? options.product9Price : (dataObj.product9Price || '');

    html = html.replace('{{product9Name}}', product9Name);
    html = html.replace('{{product9Color}}', product9Color);
    html = html.replace('{{product9ColorHex}}', product9ColorHex);
    html = html.replace('{{product9Size}}', product9Size);
    html = html.replace('{{product9Material}}', product9Material);
    html = html.replace('{{product9PriceOld}}', product9PriceOld);
    html = html.replace('{{product9Price}}', product9Price);

    // Генерувати слайди для product8 та product9
    const product8Images = options.product8Images || dataObj.product8Images || [];
    const slides8 = generateSlides(product8Images);
    html = html.replace('{{product8Slides}}', slides8);

    const product9Images = options.product9Images || dataObj.product9Images || [];
    const slides9 = generateSlides(product9Images);
    html = html.replace('{{product9Slides}}', slides9);

    // Видалити продукт блоки якщо вимкнено (product8, product9)
    if (options.enableProduct8 !== 'on' && options.enableProduct8 !== true) {
      html = html.replace(new RegExp(`<!--product8-->\\s*[\\s\\S]*?<!--\\/product8-->\\s*`, 'g'), '');
    }
    if (options.enableProduct9 !== 'on' && options.enableProduct9 !== true) {
      html = html.replace(new RegExp(`<!--product9-->\\s*[\\s\\S]*?<!--\\/product9-->\\s*`, 'g'), '');
    }

    // Замінити Comments секцію
    const commentsLabel = (options.commentsLabel && options.commentsLabel.trim()) ? options.commentsLabel : (dataObj.comments?.label || 'Відгуки');
    const commentsTitle = (options.commentsTitle && options.commentsTitle.trim()) ? options.commentsTitle : (dataObj.comments?.title || 'Піклуємось про кожного.');
    const commentsSalesStat = (options.commentsSalesStat && options.commentsSalesStat.trim()) ? options.commentsSalesStat : (dataObj.comments?.stats?.sales || '> 3500');
    const commentsSalesText = (options.commentsSalesText && options.commentsSalesText.trim()) ? options.commentsSalesText : (dataObj.comments?.text?.[0] || 'продажів');
    const commentsSatisfiedStat = (options.commentsSatisfiedStat && options.commentsSatisfiedStat.trim()) ? options.commentsSatisfiedStat : (dataObj.comments?.stats?.satisfied || '98%');
    const commentsSatisfiedText = (options.commentsSatisfiedText && options.commentsSatisfiedText.trim()) ? options.commentsSatisfiedText : (dataObj.comments?.text?.[1] || 'задоволених клієнтів');
    const commentsRepeatStat = (options.commentsRepeatStat && options.commentsRepeatStat.trim()) ? options.commentsRepeatStat : (dataObj.comments?.stats?.repeat || '48%');
    const commentsRepeatText = (options.commentsRepeatText && options.commentsRepeatText.trim()) ? options.commentsRepeatText : (dataObj.comments?.text?.[2] || 'вже повторно зробили замовлення для себе або близьких');
    const commentsButtonText = (options.commentsButtonText && options.commentsButtonText.trim()) ? options.commentsButtonText : 'ЗАЛИШИТИ ВІДГУК';

    html = html.replace('{{commentsLabel}}', commentsLabel);
    html = html.replace('{{commentsTitle}}', commentsTitle);
    html = html.replace('{{commentsSalesStat}}', commentsSalesStat);
    html = html.replace('{{commentsSalesText}}', commentsSalesText);
    html = html.replace('{{commentsSatisfiedStat}}', commentsSatisfiedStat);
    html = html.replace('{{commentsSatisfiedText}}', commentsSatisfiedText);
    html = html.replace('{{commentsRepeatStat}}', commentsRepeatStat);
    html = html.replace('{{commentsRepeatText}}', commentsRepeatText);
    html = html.replace('{{commentsButtonText}}', commentsButtonText);

    // Видалити Comments секцію якщо вимкнено
    const enableComments = (options.enableComments === 'on' || options.enableComments === true) || (options.enableComments === undefined && dataObj.enableComments !== false);
    if (!enableComments) {
      html = html.replace(/\s*<!--\s*comments\s*-->[\s\S]*?<!--\s*\/comments\s*-->\s*/g, '');
    }

    // Замінити FAQ секцію
    const faqLabel = (options.faqLabel && options.faqLabel.trim()) ? options.faqLabel : (dataObj.faq?.label || 'Доставка і оплата');
    const faqTitle = (options.faqTitle && options.faqTitle.trim()) ? options.faqTitle : (dataObj.faq?.title || 'Швидко, зручно, надійно.');

    html = html.replace('{{faqLabel}}', faqLabel);
    html = html.replace('{{faqTitle}}', faqTitle);

    // Видалити FAQ секцію якщо вимкнено
    const enableFaq = (options.enableFaq === 'on' || options.enableFaq === true) || (options.enableFaq === undefined && dataObj.enableFaq !== false);
    if (!enableFaq) {
      html = html.replace(/\s*<!--\s*faq\s*-->[\s\S]*?<!--\s*\/faq\s*-->\s*/g, '');
    }

    // Замінити How to Buy секцію
    const howLabel = (options.howLabel && options.howLabel.trim()) ? options.howLabel : (dataObj.how_to_buy?.label || 'Як придбати футболки?');
    const howTitle = (options.howTitle && options.howTitle.trim()) ? options.howTitle : (dataObj.how_to_buy?.title || 'Лише декілька простих кроків');

    html = html.replace('{{howLabel}}', howLabel);
    html = html.replace('{{howTitle}}', howTitle);

    // Видалити How to Buy секцію якщо вимкнено
    const enableHow = (options.enableHow === 'on' || options.enableHow === true) || (options.enableHow === undefined && dataObj.enableHow !== false);
    if (!enableHow) {
      html = html.replace(/\s*<!--\s*how\s*-->[\s\S]*?<!--\s*\/how\s*-->\s*/g, '');
    }

    // Замінити Request Form поля
    const requestInfoTitle = (options.requestInfoTitle && options.requestInfoTitle.trim()) ? options.requestInfoTitle : (dataObj.request?.info_title || 'Залиште заявку');
    const requestInfoDescription = (options.requestInfoDescription && options.requestInfoDescription.trim()) ? options.requestInfoDescription : (dataObj.request?.info_description || 'Якщо бажаєте замовити або потрібна наша допомога');
    const requestButtonText = (options.requestButtonText && options.requestButtonText.trim()) ? options.requestButtonText : 'ЗАЛИШИТИ ЗАЯВКУ';
    const requestNamePlaceholder = (options.requestNamePlaceholder && options.requestNamePlaceholder.trim()) ? options.requestNamePlaceholder : 'Введіть Ваше ім`я';
    const requestPhonePlaceholder = (options.requestPhonePlaceholder && options.requestPhonePlaceholder.trim()) ? options.requestPhonePlaceholder : 'Введіть Ваш телефон';

    html = html.replace('{{requestInfoTitle}}', requestInfoTitle);
    html = html.replace('{{requestInfoDescription}}', requestInfoDescription);
    html = html.replace('{{requestButtonText}}', requestButtonText);
    html = html.replace('{{requestNamePlaceholder}}', requestNamePlaceholder);
    html = html.replace('{{requestPhonePlaceholder}}', requestPhonePlaceholder);

    // Замінити Footer copyright
    const footerCopyright = (options.footerCopyright && options.footerCopyright.trim()) ? options.footerCopyright : (dataObj.footer?.copyright || '© 2022 «KOPO»');
    html = html.replace('{{footerCopyright}}', footerCopyright);

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
    const dataPath = path.join(__dirname, 'data', 'user-config.json');
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
    const dataPath = path.join(__dirname, 'data', 'user-config.json');
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
      enableVideoThumbnail: (data.enableVideoThumbnail !== undefined) ? data.enableVideoThumbnail : true,
      videoThumbnailDesktop: data.videoThumbnailDesktop || DEFAULT_VIDEO_THUMBNAIL_DESKTOP,
      videoThumbnailMobile: data.videoThumbnailMobile || DEFAULT_VIDEO_THUMBNAIL_MOBILE,
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
      enableProduct5: data.enableProduct5 || true,
      // Product 8 & 9 data
      product8Name: data.product8Name || '',
      product8Color: data.product8Color || '',
      product8ColorHex: data.product8ColorHex || '',
      product8Size: data.product8Size || '',
      product8Material: data.product8Material || '',
      product8PriceOld: data.product8PriceOld || '',
      product8Price: data.product8Price || '',
      product8Images: data.product8Images || [],
      enableProduct8: data.enableProduct8 || false,
      product9Name: data.product9Name || '',
      product9Color: data.product9Color || '',
      product9ColorHex: data.product9ColorHex || '',
      product9Size: data.product9Size || '',
      product9Material: data.product9Material || '',
      product9PriceOld: data.product9PriceOld || '',
      product9Price: data.product9Price || '',
      product9Images: data.product9Images || [],
      enableProduct9: data.enableProduct9 || false
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
        product5Name: '', product5Color: '', product5ColorHex: '', product5Size: '', product5Material: '', product5PriceOld: '', product5Price: '', enableProduct5: true,
        product8Name: '', product8Color: '', product8ColorHex: '', product8Size: '', product8Material: '', product8PriceOld: '', product8Price: '', enableProduct8: false,
        product9Name: '', product9Color: '', product9ColorHex: '', product9Size: '', product9Material: '', product9PriceOld: '', product9Price: '', enableProduct9: false
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

    // АВТОМАТИЧНИЙ BACKUP перед збереженням
    if (fs.existsSync(configPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const backupPath = path.join(__dirname, 'data', `user-config.backup-${timestamp}.json`);
      fs.copyFileSync(configPath, backupPath);
      console.log(`📦 Створено backup: ${backupPath}`);
    }

    // Записати з явним UTF-8 кодуванням
    const jsonContent = JSON.stringify(configData, null, 2);
    fs.writeFileSync(configPath, jsonContent, { encoding: 'utf8' });
    console.log(`✅ Конфігурація збережена на сервері`);
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
      filename: `/public/img/image/${basename}.jpg`,
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

// POST /upload-video-thumbnail - Завантажити прев'ю для відео блоку
app.post('/upload-video-thumbnail', uploadVideoThumbnail.single('videoThumbnailUpload'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажено' });
    }

    const timestamp = Date.now();
    const basename = `video-thumb-${timestamp}`;
    const uploadedPath = req.file.path;

    const desktopPath = path.join(videoThumbnailDir, `${basename}.jpg`);
    await sharp(uploadedPath)
      .resize(1280, 720, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile(desktopPath);

    const mobilePath = path.join(videoThumbnailDir, `${basename}_m.webp`);
    await sharp(uploadedPath)
      .resize(640, 360, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toFile(mobilePath);

    fs.unlinkSync(uploadedPath);

    res.json({
      success: true,
      desktop: `/public/img/video/${basename}.jpg`,
      mobile: `/public/img/video/${basename}_m.webp`,
      message: "Прев'ю відео збережено"
    });
  } catch (err) {
    console.error("Помилка під час обробки прев'ю відео:", err.message);
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // ignore cleanup errors
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

// POST /upload-product1-image - Завантажити фото для продукту 1
app.post('/upload-product1-image', uploadProductImage.single('product1Image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажений' });
    }

    console.log(`\n📸 ФОТО ПРОДУКТУ 1 ЗАВАНТАЖЕНО`);
    console.log(`📁 Оригінальний файл: ${req.file.filename}`);
    console.log(`📏 Розмір: ${(req.file.size / 1024).toFixed(2)} KB`);

    // Отримати базову назву без розширення
    const timestamp = Date.now();
    const basename = `product-${timestamp}`;
    const uploadedPath = req.file.path;

    // Пересохранити для десктопу (оригінальний розмір, JPEG 90%)
    const desktopPath = path.join(productImageDir, `${basename}.jpg`);
    await sharp(uploadedPath)
      .jpeg({ quality: 90 })
      .toFile(desktopPath);
    console.log(`✅ Десктоп: ${basename}.jpg (90% quality)`);

    // Пересохранити для мобільного (640px width, WebP 80%)
    const mobilePath = path.join(productImageDir, `${basename}_m.webp`);
    await sharp(uploadedPath)
      .resize(640, null, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(mobilePath);
    console.log(`✅ Мобільний: ${basename}_m.webp (640px, 80% quality)`);

    // Видалити оригінальний завантажений файл
    fs.unlinkSync(uploadedPath);
    console.log(`✅ Оригінальний файл видалено\n`);

    res.json({
      success: true,
      filename: `/public/img/products/${basename}.jpg`,
      message: 'Фото успішно завантажено'
    });
  } catch (err) {
    console.error('❌ Помилка при завантаженні:', err.message);
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

// POST /upload-product2-image - Завантажити фото для продукту 2
app.post('/upload-product2-image', uploadProductImage.single('product2Image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажений' });
    }

    console.log(`\n📸 ФОТО ПРОДУКТУ 2 ЗАВАНТАЖЕНО`);
    console.log(`📁 Оригінальний файл: ${req.file.filename}`);
    console.log(`📏 Розмір: ${(req.file.size / 1024).toFixed(2)} KB`);

    // Отримати базову назву без розширення
    const timestamp = Date.now();
    const basename = `product-${timestamp}`;
    const uploadedPath = req.file.path;

    // Пересохранити для десктопу (оригінальний розмір, JPEG 90%)
    const desktopPath = path.join(productImageDir, `${basename}.jpg`);
    await sharp(uploadedPath)
      .jpeg({ quality: 90 })
      .toFile(desktopPath);
    console.log(`✅ Десктоп: ${basename}.jpg (90% quality)`);

    // Пересохранити для мобільного (640px width, WebP 80%)
    const mobilePath = path.join(productImageDir, `${basename}_m.webp`);
    await sharp(uploadedPath)
      .resize(640, null, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(mobilePath);
    console.log(`✅ Мобільний: ${basename}_m.webp (640px, 80% quality)`);

    // Видалити оригінальний завантажений файл
    fs.unlinkSync(uploadedPath);
    console.log(`✅ Оригінальний файл видалено\n`);

    res.json({
      success: true,
      filename: `/public/img/products/${basename}.jpg`,
      message: 'Фото успішно завантажено'
    });
  } catch (err) {
    console.error('❌ Помилка при завантаженні:', err.message);
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

// POST /upload-product3-image - Завантажити фото для продукту 3
app.post('/upload-product3-image', uploadProductImage.single('product3Image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажений' });
    }

    console.log(`\n📸 ФОТО ПРОДУКТУ 3 ЗАВАНТАЖЕНО`);
    console.log(`📁 Оригінальний файл: ${req.file.filename}`);
    console.log(`📏 Розмір: ${(req.file.size / 1024).toFixed(2)} KB`);

    // Отримати базову назву без розширення
    const timestamp = Date.now();
    const basename = `product-${timestamp}`;
    const uploadedPath = req.file.path;

    // Пересохранити для десктопу (оригінальний розмір, JPEG 90%)
    const desktopPath = path.join(productImageDir, `${basename}.jpg`);
    await sharp(uploadedPath)
      .jpeg({ quality: 90 })
      .toFile(desktopPath);
    console.log(`✅ Десктоп: ${basename}.jpg (90% quality)`);

    // Пересохранити для мобільного (640px width, WebP 80%)
    const mobilePath = path.join(productImageDir, `${basename}_m.webp`);
    await sharp(uploadedPath)
      .resize(640, null, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(mobilePath);
    console.log(`✅ Мобільний: ${basename}_m.webp (640px, 80% quality)`);

    // Видалити оригінальний завантажений файл
    fs.unlinkSync(uploadedPath);
    console.log(`✅ Оригінальний файл видалено\n`);

    res.json({
      success: true,
      filename: `/public/img/products/${basename}.jpg`,
      message: 'Фото успішно завантажено'
    });
  } catch (err) {
    console.error('❌ Помилка при завантаженні:', err.message);
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

// POST /upload-product4-image - Завантажити фото для продукту 4
app.post('/upload-product4-image', uploadProductImage.single('product4Image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажений' });
    }

    console.log(`\n📸 ФОТО ПРОДУКТУ 4 ЗАВАНТАЖЕНО`);
    console.log(`📁 Оригінальний файл: ${req.file.filename}`);
    console.log(`📏 Розмір: ${(req.file.size / 1024).toFixed(2)} KB`);

    // Отримати базову назву без розширення
    const timestamp = Date.now();
    const basename = `product-${timestamp}`;
    const uploadedPath = req.file.path;

    // Пересохранити для десктопу (оригінальний розмір, JPEG 90%)
    const desktopPath = path.join(productImageDir, `${basename}.jpg`);
    await sharp(uploadedPath)
      .jpeg({ quality: 90 })
      .toFile(desktopPath);
    console.log(`✅ Десктоп: ${basename}.jpg (90% quality)`);

    // Пересохранити для мобільного (640px width, WebP 80%)
    const mobilePath = path.join(productImageDir, `${basename}_m.webp`);
    await sharp(uploadedPath)
      .resize(640, null, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(mobilePath);
    console.log(`✅ Мобільний: ${basename}_m.webp (640px, 80% quality)`);

    // Видалити оригінальний завантажений файл
    fs.unlinkSync(uploadedPath);
    console.log(`✅ Оригінальний файл видалено\n`);

    res.json({
      success: true,
      filename: `/public/img/products/${basename}.jpg`,
      message: 'Фото успішно завантажено'
    });
  } catch (err) {
    console.error('❌ Помилка при завантаженні:', err.message);
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

// POST /upload-product5-image - Завантажити фото для продукту 5
app.post('/upload-product5-image', uploadProductImage.single('product5Image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажений' });
    }

    console.log(`\n📸 ФОТО ПРОДУКТУ 5 ЗАВАНТАЖЕНО`);
    console.log(`📁 Оригінальний файл: ${req.file.filename}`);
    console.log(`📏 Розмір: ${(req.file.size / 1024).toFixed(2)} KB`);

    // Отримати базову назву без розширення
    const timestamp = Date.now();
    const basename = `product-${timestamp}`;
    const uploadedPath = req.file.path;

    // Пересохранити для десктопу (оригінальний розмір, JPEG 90%)
    const desktopPath = path.join(productImageDir, `${basename}.jpg`);
    await sharp(uploadedPath)
      .jpeg({ quality: 90 })
      .toFile(desktopPath);
    console.log(`✅ Десктоп: ${basename}.jpg (90% quality)`);

    // Пересохранити для мобільного (640px width, WebP 80%)
    const mobilePath = path.join(productImageDir, `${basename}_m.webp`);
    await sharp(uploadedPath)
      .resize(640, null, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(mobilePath);
    console.log(`✅ Мобільний: ${basename}_m.webp (640px, 80% quality)`);

    // Видалити оригінальний завантажений файл
    fs.unlinkSync(uploadedPath);
    console.log(`✅ Оригінальний файл видалено\n`);

    res.json({
      success: true,
      filename: `/public/img/products/${basename}.jpg`,
      message: 'Фото успішно завантажено'
    });
  } catch (err) {
    console.error('❌ Помилка при завантаженні:', err.message);
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

// POST /upload-product8-image - Завантажити фото для продукту 8
app.post('/upload-product8-image', uploadProductImage.single('product8Image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажений' });
    }

    console.log(`\n📸 ФОТО ПРОДУКТУ 8 ЗАВАНТАЖЕНО`);
    console.log(`📁 Оригінальний файл: ${req.file.filename}`);
    console.log(`📏 Розмір: ${(req.file.size / 1024).toFixed(2)} KB`);

    // Отримати базову назву без розширення
    const timestamp = Date.now();
    const basename = `product-${timestamp}`;
    const uploadedPath = req.file.path;

    // Пересохранити для десктопу (оригінальний розмір, JPEG 90%)
    const desktopPath = path.join(productImageDir, `${basename}.jpg`);
    await sharp(uploadedPath)
      .jpeg({ quality: 90 })
      .toFile(desktopPath);
    console.log(`✅ Десктоп: ${basename}.jpg (90% quality)`);

    // Пересохранити для мобільного (640px width, WebP 80%)
    const mobilePath = path.join(productImageDir, `${basename}_m.webp`);
    await sharp(uploadedPath)
      .resize(640, null, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(mobilePath);
    console.log(`✅ Мобільний: ${basename}_m.webp (640px, 80% quality)`);

    // Видалити оригінальний завантажений файл
    fs.unlinkSync(uploadedPath);
    console.log(`✅ Оригінальний файл видалено\n`);

    res.json({
      success: true,
      filename: `/public/img/products/${basename}.jpg`,
      message: 'Фото успішно завантажено'
    });
  } catch (err) {
    console.error('❌ Помилка при завантаженні:', err.message);
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

// POST /upload-product9-image - Завантажити фото для продукту 9
app.post('/upload-product9-image', uploadProductImage.single('product9Image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажений' });
    }

    console.log(`\n📸 ФОТО ПРОДУКТУ 9 ЗАВАНТАЖЕНО`);
    console.log(`📁 Оригінальний файл: ${req.file.filename}`);
    console.log(`📏 Розмір: ${(req.file.size / 1024).toFixed(2)} KB`);

    // Отримати базову назву без розширення
    const timestamp = Date.now();
    const basename = `product-${timestamp}`;
    const uploadedPath = req.file.path;

    // Пересохранити для десктопу (оригінальний розмір, JPEG 90%)
    const desktopPath = path.join(productImageDir, `${basename}.jpg`);
    await sharp(uploadedPath)
      .jpeg({ quality: 90 })
      .toFile(desktopPath);
    console.log(`✅ Десктоп: ${basename}.jpg (90% quality)`);

    // Пересохранити для мобільного (640px width, WebP 80%)
    const mobilePath = path.join(productImageDir, `${basename}_m.webp`);
    await sharp(uploadedPath)
      .resize(640, null, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(mobilePath);
    console.log(`✅ Мобільний: ${basename}_m.webp (640px, 80% quality)`);

    // Видалити оригінальний завантажений файл
    fs.unlinkSync(uploadedPath);
    console.log(`✅ Оригінальний файл видалено\n`);

    res.json({
      success: true,
      filename: `/public/img/products/${basename}.jpg`,
      message: 'Фото успішно завантажено'
    });
  } catch (err) {
    console.error('❌ Помилка при завантаженні:', err.message);
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

// POST /upload-size-chart-image - Завантажити фото розмірної сітки
app.post('/upload-size-chart-image', uploadSizeChartImage.single('sizeChartImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажений' });
    }

    console.log(`\n📏 ФОТО РОЗМІРНОЇ СІТКИ ЗАВАНТАЖЕНО`);
    console.log(`📁 Оригінальний файл: ${req.file.filename}`);
    console.log(`📏 Розмір: ${(req.file.size / 1024).toFixed(2)} KB`);

    // Отримати базову назву без розширення
    const timestamp = Date.now();
    const basename = `size-chart-${timestamp}`;
    const uploadedPath = req.file.path;

    // Пересохранити для десктопу (оригінальний розмір, PNG)
    const desktopPath = path.join(sizeChartImageDir, `${basename}.png`);
    await sharp(uploadedPath)
      .png({ quality: 90 })
      .toFile(desktopPath);
    console.log(`✅ Десктоп: ${basename}.png (PNG 90% quality)`);

    // Пересохранити для мобільного (640px width, WebP 80%)
    const mobilePath = path.join(sizeChartImageDir, `${basename}_m.webp`);
    await sharp(uploadedPath)
      .resize(640, null, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(mobilePath);
    console.log(`✅ Мобільний: ${basename}_m.webp (640px, 80% quality)`);

    // Видалити оригінальний завантажений файл
    fs.unlinkSync(uploadedPath);
    console.log(`✅ Оригінальний файл видалено\n`);

    res.json({
      success: true,
      filename: `/public/img/info/${basename}.png`,
      message: 'Фото успішно завантажено'
    });
  } catch (err) {
    console.error('❌ Помилка при завантаженні:', err.message);
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
    const dataPath = path.join(__dirname, 'data', 'user-config.json');
    let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    const configPath = path.join(__dirname, 'data', 'user-config.json');
    if (fs.existsSync(configPath)) {
      try {
        const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        data = { ...data, ...userConfig };
      } catch (configErr) {
        console.error('Failed to read user config:', configErr.message);
      }
    }


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
      videoUrl: req.query.videoUrl,
      enableVideoThumbnail: req.query.enableVideoThumbnail,
      videoThumbnailDesktop: req.query.videoThumbnailDesktop,
      videoThumbnailMobile: req.query.videoThumbnailMobile,
      sizeChartImage: req.query.sizeChartImage,
      // Info list params
      infoEnableBrand: req.query.infoEnableBrand,
      infoBrandLabel: req.query.infoBrandLabel,
      infoBrandValue: req.query.infoBrandValue,
      infoEnableModel: req.query.infoEnableModel,
      infoModelLabel: req.query.infoModelLabel,
      infoModelValue: req.query.infoModelValue,
      infoEnableQuantity: req.query.infoEnableQuantity,
      infoQuantityLabel: req.query.infoQuantityLabel,
      infoQuantityValue: req.query.infoQuantityValue,
      infoEnableColors: req.query.infoEnableColors,
      infoColorsLabel: req.query.infoColorsLabel,
      infoEnableSizes: req.query.infoEnableSizes,
      infoSizesLabel: req.query.infoSizesLabel,
      infoSizesValue: req.query.infoSizesValue,
      infoEnableMaterial: req.query.infoEnableMaterial,
      infoMaterialLabel: req.query.infoMaterialLabel,
      infoMaterialValue: req.query.infoMaterialValue,
      infoEnablePackaging: req.query.infoEnablePackaging,
      infoPackagingLabel: req.query.infoPackagingLabel,
      infoPackagingValue: req.query.infoPackagingValue,
      product1Images: parseArrayParam(req.query.product1Images, data.product1Images || []),
      product2Images: parseArrayParam(req.query.product2Images, data.product2Images || []),
      product3Images: parseArrayParam(req.query.product3Images, data.product3Images || []),
      product4Images: parseArrayParam(req.query.product4Images, data.product4Images || []),
      product5Images: parseArrayParam(req.query.product5Images, data.product5Images || []),
      enableProduct1: req.query.enableProduct1,
      enableProduct2: req.query.enableProduct2,
      enableProduct3: req.query.enableProduct3,
      enableProduct4: req.query.enableProduct4,
      enableProduct5: req.query.enableProduct5,

      // Product 8 & 9 params
      product8Name: req.query.product8Name,
      product8Color: req.query.product8Color,
      product8ColorHex: req.query.product8ColorHex,
      product8Size: req.query.product8Size,
      product8Material: req.query.product8Material,
      product8PriceOld: req.query.product8PriceOld,
      product8Price: req.query.product8Price,
      enableProduct8: req.query.enableProduct8,
      product8Images: parseArrayParam(req.query.product8Images, data.product8Images || []),

      product9Name: req.query.product9Name,
      product9Color: req.query.product9Color,
      product9ColorHex: req.query.product9ColorHex,
      product9Size: req.query.product9Size,
      product9Material: req.query.product9Material,
      product9PriceOld: req.query.product9PriceOld,
      product9Price: req.query.product9Price,
      enableProduct9: req.query.enableProduct9,
      product9Images: parseArrayParam(req.query.product9Images, data.product9Images || [])
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
    const dataPath = path.join(__dirname, 'data', 'user-config.json');
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
    const dataPath = path.join(__dirname, 'data', 'user-config.json');
    let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    const configPath = path.join(__dirname, 'data', 'user-config.json');
    if (fs.existsSync(configPath)) {
      try {
        const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        data = { ...data, ...userConfig };
      } catch (configErr) {
        console.error('Failed to read user config:', configErr.message);
      }
    }


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
      videoUrl: req.query.videoUrl,
      enableVideoThumbnail: req.query.enableVideoThumbnail,
      videoThumbnailDesktop: req.query.videoThumbnailDesktop,
      videoThumbnailMobile: req.query.videoThumbnailMobile,
      sizeChartImage: req.query.sizeChartImage,
      // Info list params
      infoEnableBrand: req.query.infoEnableBrand,
      infoBrandLabel: req.query.infoBrandLabel,
      infoBrandValue: req.query.infoBrandValue,
      infoEnableModel: req.query.infoEnableModel,
      infoModelLabel: req.query.infoModelLabel,
      infoModelValue: req.query.infoModelValue,
      infoEnableQuantity: req.query.infoEnableQuantity,
      infoQuantityLabel: req.query.infoQuantityLabel,
      infoQuantityValue: req.query.infoQuantityValue,
      infoEnableColors: req.query.infoEnableColors,
      infoColorsLabel: req.query.infoColorsLabel,
      infoEnableSizes: req.query.infoEnableSizes,
      infoSizesLabel: req.query.infoSizesLabel,
      infoSizesValue: req.query.infoSizesValue,
      infoEnableMaterial: req.query.infoEnableMaterial,
      infoMaterialLabel: req.query.infoMaterialLabel,
      infoMaterialValue: req.query.infoMaterialValue,
      infoEnablePackaging: req.query.infoEnablePackaging,
      infoPackagingLabel: req.query.infoPackagingLabel,
      infoPackagingValue: req.query.infoPackagingValue,
      product1Images: parseArrayParam(req.query.product1Images, data.product1Images || []),
      product2Images: parseArrayParam(req.query.product2Images, data.product2Images || []),
      product3Images: parseArrayParam(req.query.product3Images, data.product3Images || []),
      product4Images: parseArrayParam(req.query.product4Images, data.product4Images || []),
      product5Images: parseArrayParam(req.query.product5Images, data.product5Images || []),
      enableProduct1: req.query.enableProduct1,
      enableProduct2: req.query.enableProduct2,
      enableProduct3: req.query.enableProduct3,
      enableProduct4: req.query.enableProduct4,
      enableProduct5: req.query.enableProduct5,

      // Product 8 & 9 params
      product8Name: req.query.product8Name,
      product8Color: req.query.product8Color,
      product8ColorHex: req.query.product8ColorHex,
      product8Size: req.query.product8Size,
      product8Material: req.query.product8Material,
      product8PriceOld: req.query.product8PriceOld,
      product8Price: req.query.product8Price,
      enableProduct8: req.query.enableProduct8,
      product8Images: parseArrayParam(req.query.product8Images, data.product8Images || []),

      product9Name: req.query.product9Name,
      product9Color: req.query.product9Color,
      product9ColorHex: req.query.product9ColorHex,
      product9Size: req.query.product9Size,
      product9Material: req.query.product9Material,
      product9PriceOld: req.query.product9PriceOld,
      product9Price: req.query.product9Price,
      enableProduct9: req.query.enableProduct9,
      product9Images: parseArrayParam(req.query.product9Images, data.product9Images || [])
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
    let html = generateHTML(data, options);

    // Видалити "public/" з усіх шляхів для експорту (бо в ZIP немає папки public/)
    html = html.replace(/public\//g, '');

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

    // Додати product images (products 1-5, 8-9)
    const productKeys = ['product1Images', 'product2Images', 'product3Images', 'product4Images', 'product5Images', 'product8Images', 'product9Images'];
    for (const key of productKeys) {
      const images = options[key] || data[key] || [];
      if (Array.isArray(images) && images.length > 0) {
        for (const imagePath of images) {
          // Отримати базове ім'я без розширення (product-123456.jpg -> product-123456)
          const filename = path.basename(imagePath, '.jpg');

          // Додати десктоп версію (jpg)
          const desktopPath = path.join(productImageDir, `${filename}.jpg`);
          if (fs.existsSync(desktopPath)) {
            archive.file(desktopPath, { name: `img/products/${filename}.jpg` });
            console.log(`✅ Додано десктоп product: img/products/${filename}.jpg`);
          }

          // Додати мобільну версію (webp)
          const mobilePath = path.join(productImageDir, `${filename}_m.webp`);
          if (fs.existsSync(mobilePath)) {
            archive.file(mobilePath, { name: `img/products/${filename}_m.webp` });
            console.log(`✅ Додано мобільний product: img/products/${filename}_m.webp`);
          }
        }
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
