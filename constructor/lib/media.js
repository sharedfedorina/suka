const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');

/**
 * КОПІЯ РОБОЧОЇ ЛОГІКИ З server.js (04:07)
 * Створює multer uploader для hero image
 */
function createHeroImageUploader(destinationDir) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinationDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, 'custom-hero' + ext);
    }
  });

  return multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Тільки зображення дозволені'));
      }
    }
  });
}

/**
 * Обробка завантаження hero image (1200x600 desktop, 600x400 mobile WebP)
 */
async function handleHeroImageUpload(req, res, outputDir) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажений' });
    }

    console.log(`\n🖼️ ФОТО ЗАВАНТАЖЕНО`);
    console.log(`📁 Оригінальний файл: ${req.file.filename}`);
    console.log(`📏 Розмір: ${(req.file.size / 1024).toFixed(2)} KB`);

    const timestamp = Date.now();
    const basename = `hero-${timestamp}`;
    const uploadedPath = req.file.path;

    // Desktop version (1200x600 - cover)
    const desktopPath = path.join(outputDir, `${basename}.jpg`);
    await sharp(uploadedPath)
      .resize(1200, 600, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile(desktopPath);
    console.log(`✅ Десктоп: ${basename}.jpg (1200x600, 85% quality)`);

    // Mobile version (600x400 - cover)
    const mobilePath = path.join(outputDir, `${basename}_m.webp`);
    await sharp(uploadedPath)
      .resize(600, 400, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toFile(mobilePath);
    console.log(`✅ Мобільний: ${basename}_m.webp (600x400, 80% quality)`);

    fs.unlinkSync(uploadedPath);
    console.log(`✅ Оригінальний файл видалено\n`);

    res.json({
      success: true,
      filename: `/public/img/hero/${basename}_m.webp`,
      message: 'Фото успішно оптимізовано та завантажено'
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
}

/**
 * Створює multer uploader для product images
 */
function createProductImageUploader(destinationDir) {
  const productImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinationDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      const timestamp = Date.now();
      cb(null, 'product-' + timestamp + ext);
    }
  });

  return multer({
    storage: productImageStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Тільки зображення дозволені'));
      }
    }
  });
}

/**
 * Обробка завантаження product image (JPEG 90% desktop, 640px WebP 80% mobile)
 */
async function handleProductImageUpload(req, res, outputDir, productNumber) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажений' });
    }

    console.log(`\n📸 ФОТО ПРОДУКТУ ${productNumber} ЗАВАНТАЖЕНО`);
    console.log(`📁 Оригінальний файл: ${req.file.filename}`);
    console.log(`📏 Розмір: ${(req.file.size / 1024).toFixed(2)} KB`);

    const timestamp = Date.now();
    const basename = `product-${timestamp}`;
    const uploadedPath = req.file.path;

    // Desktop version (оригінальний розмір, JPEG 90%)
    const desktopPath = path.join(outputDir, `${basename}.jpg`);
    await sharp(uploadedPath)
      .jpeg({ quality: 90 })
      .toFile(desktopPath);
    console.log(`✅ Десктоп: ${basename}.jpg (90% quality)`);

    // Mobile version (640px width, WebP 80%)
    const mobilePath = path.join(outputDir, `${basename}_m.webp`);
    await sharp(uploadedPath)
      .resize(640, null, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(mobilePath);
    console.log(`✅ Мобільний: ${basename}_m.webp (640px, 80% quality)`);

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
}

module.exports = {
  createHeroImageUploader,
  handleHeroImageUpload,
  createProductImageUploader,
  handleProductImageUpload
};
