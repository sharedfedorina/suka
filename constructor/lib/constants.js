const path = require('path');

// ============================================================================
// ШЛЯХИ
// ============================================================================

const PATHS = {
  // Конфіг
  CONFIG: path.join(__dirname, '..', 'data', 'user-config.json'),
  BACKUPS: path.join(__dirname, '..', 'data', 'backups'),

  // Секції HTML (форма конструктора)
  SECTIONS: path.join(__dirname, '..', 'sections'),

  // Модулі HTML (templates для генерації лендінгу)
  MODULES: path.join(__dirname, '..', 'modules'),

  // Публічні файли
  PUBLIC: path.join(__dirname, '..', 'public'),
  PUBLIC_IMG: path.join(__dirname, '..', 'public', 'img'),
  PUBLIC_IMG_HERO: path.join(__dirname, '..', 'public', 'img', 'hero'),
  PUBLIC_IMG_PRODUCTS: path.join(__dirname, '..', 'public', 'img', 'products'),
  PUBLIC_IMG_TABS: path.join(__dirname, '..', 'public', 'img', 'tabs'),
  PUBLIC_IMG_INFO: path.join(__dirname, '..', 'public', 'img', 'info'),
  PUBLIC_IMG_VIDEO: path.join(__dirname, '..', 'public', 'img', 'video'),
  PUBLIC_IMG_REVIEWS: path.join(__dirname, '..', 'public', 'img', 'reviews'),

  // Вихідні файли
  OUTPUT_INDEX: path.join(__dirname, '..', 'index.html'),
  FORM_HTML: path.join(__dirname, '..', 'form.html')
};

// ============================================================================
// СПИСОК СЕКЦІЙ (порядок важливий!)
// ============================================================================

const SECTIONS = [
  'seo',
  'basic',
  'hero',
  'pluslogo',
  'benefits',
  'video',
  'products',
  'sizechart',
  'tabs',
  'salesdrive',
  'comments',
  'reviews',
  'faq',
  'howto',
  'request',
  'footer'
];

// ============================================================================
// НАЛАШТУВАННЯ МЕДІА
// ============================================================================

const MEDIA_CONFIG = {
  // Ліміти розміру файлів
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB

  // Hero image
  HERO: {
    DESKTOP: { width: 1200, height: 600, format: 'jpg', quality: 85 },
    MOBILE: { width: 600, height: 400, format: 'webp', quality: 80 }
  },

  // Product images
  PRODUCT: {
    DESKTOP: { format: 'jpg', quality: 90 }, // оригінальний розмір
    MOBILE: { width: 640, format: 'webp', quality: 80 } // пропорційно
  },

  // Tabs images
  TABS: {
    DESKTOP: { format: 'jpg', quality: 90 },
    MOBILE: { width: 640, format: 'webp', quality: 80 }
  },

  // Info/Size chart
  INFO: {
    DESKTOP: { format: 'png', quality: 90 },
    MOBILE: { width: 640, format: 'webp', quality: 80 }
  },

  // Video thumbnails
  VIDEO_THUMB: {
    DESKTOP: { format: 'jpg', quality: 85 },
    MOBILE: { width: 640, format: 'webp', quality: 80 }
  },

  // Reviews
  REVIEW: {
    DESKTOP: { format: 'jpg', quality: 85 },
    MOBILE: { width: 640, format: 'webp', quality: 80 }
  }
};

// ============================================================================
// НАЛАШТУВАННЯ СЕРВЕРА
// ============================================================================

const SERVER_CONFIG = {
  PORT: 6614,
  HOST: 'localhost'
};

module.exports = {
  PATHS,
  SECTIONS,
  MEDIA_CONFIG,
  SERVER_CONFIG
};
