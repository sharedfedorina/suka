const express = require('express');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const multer = require('multer');

const app = express();
const PORT = 6614;

app.use(express.json());

// Налаштування multer для завантаження фото
const heroImageDir = path.join(__dirname, 'public', 'img', 'hero');
if (!fs.existsSync(heroImageDir)) {
  fs.mkdirSync(heroImageDir, { recursive: true });
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

    // Замінити хедер текст (якщо передано)
    if (options.headerText) {
      html = html.replace(
        /РОЗПРОДАЖ футболок!/g,
        options.headerText
      );
    } else {
      html = html.replace(
        /РОЗПРОДАЖ футболок!/g,
        dataObj.header.announcement
      );
    }

    // Замінити заголовок (назва товару) (якщо передано)
    if (options.heroTitle) {
      // Замінити в title сторінки
      html = html.replace(
        new RegExp(dataObj.hero.title, 'g'),
        options.heroTitle
      );
      // Замінити в h1
      html = html.replace(
        /<h1[^>]*>Жіночі футболки оверсайз<\/h1>/g,
        `<h1 class="start-title title-xl">${options.heroTitle}</h1>`
      );
      // Замінити в request-title
      html = html.replace(
        /<h1 class="request-title title-xl">Жіночі футболки оверсайз<\/h1>/g,
        `<h1 class="request-title title-xl">${options.heroTitle}</h1>`
      );
    }

    // Видалити таймер якщо вимкнено
    if (options.enableTimer !== 'on' && options.enableTimer !== true) {
      // Видалити весь блок start-timer
      html = html.replace(/<div class="start-timer timer">[\s\S]*?<\/div>/g, '');
      // Видалити весь блок request-timer
      html = html.replace(/<div class="request-timer timer">[\s\S]*?<\/div>/g, '');
      // Видалити весь блок popup-timer
      html = html.replace(/<div class="popup-timer timer">[\s\S]*?<\/div>/g, '');
    }

    // Видалити блок "Залишилось X футболок" якщо вимкнено
    if (options.enableStock !== 'on' && options.enableStock !== true) {
      // Видалити span з "request-numbers" класом (внизу заявки)
      html = html.replace(/<span class="request-numbers">[\s\S]*?<\/span>/g, '');
      // Видалити span з "start-numbers" класом (у героїчної секції)
      html = html.replace(/<span class="start-numbers">[\s\S]*?<\/span>/g, '');
      // Видалити span з "popup-numbers" класом (у спливаючому вікні)
      html = html.replace(/<span class="popup-numbers">[\s\S]*?<\/span>/g, '');
    }

    // Замінити hero фото якщо користувач завантажив нове
    if (options.heroImage) {
      // Замінити путь до фото в srcset та src
      html = html.replace(
        /img\/start\/start-1\.png/g,
        `img/hero/${options.heroImage}`
      );
      html = html.replace(
        /img\/start\/start-1_m\.webp/g,
        `img/hero/${options.heroImage}`
      );
    }

    console.log(`✅ HTML успішно згенерований (${html.length} байт)`);
    return html;
  } catch (err) {
    console.error('❌ Помилка при генеруванні HTML:', err.message);
    throw err;
  }
}

// GET / - Головна сторінка з формою редагування
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Конструктор - Генерування Лендінгу</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 700px;
          width: 100%;
        }
        h1 {
          color: #333;
          margin-bottom: 10px;
          font-size: 2em;
          text-align: center;
        }
        .subtitle {
          color: #666;
          text-align: center;
          margin-bottom: 30px;
          font-size: 0.95em;
        }
        .form-group {
          margin-bottom: 25px;
        }
        label {
          display: block;
          color: #333;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 0.95em;
        }
        input[type="text"],
        textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-family: 'Segoe UI', Arial, sans-serif;
          font-size: 1em;
          transition: border-color 0.3s;
        }
        input[type="text"]:focus,
        textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        textarea {
          resize: vertical;
          min-height: 60px;
        }
        .checkbox-group {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 2px solid #e0e0e0;
        }
        .checkbox-group label {
          display: flex;
          align-items: center;
          margin: 0;
          cursor: pointer;
          font-weight: 500;
        }
        input[type="checkbox"] {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          cursor: pointer;
          accent-color: #667eea;
        }
        .buttons {
          display: flex;
          gap: 15px;
          margin-top: 35px;
        }
        .button {
          flex: 1;
          padding: 14px 20px;
          font-size: 1em;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          text-decoration: none;
        }
        .button-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        .button-secondary {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }
        .button-secondary:hover {
          background: #f0f0f0;
          transform: translateY(-2px);
        }
        .info {
          margin-top: 25px;
          padding-top: 25px;
          border-top: 1px solid #eee;
          color: #999;
          font-size: 0.85em;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎨 Конструктор Лендінгів</h1>
        <p class="subtitle">Налаштуй текст и функції твого сайту</p>

        <form id="constructorForm">
          <div class="form-group">
            <label for="headerText">Текст у хедері (анонс)</label>
            <input
              type="text"
              id="headerText"
              name="headerText"
              value="РОЗПРОДАЖ футболок!"
              placeholder="Напр.: РОЗПРОДАЖ футболок!"
            />
          </div>

          <div class="form-group">
            <label for="heroTitle">Заголовок сайту (назва товару)</label>
            <input
              type="text"
              id="heroTitle"
              name="heroTitle"
              value="Жіночі футболки оверсайз"
              placeholder="Напр.: Жіночі футболки оверсайз"
            />
          </div>

          <div class="form-group">
            <label for="heroImage">🖼️ Завантажити фото для hero блоку:</label>
            <input
              type="file"
              id="heroImage"
              name="heroImage"
              accept="image/*"
              style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; width: 100%; cursor: pointer;"
            />
            <small style="color: #666; display: block; margin-top: 5px;">JPG, PNG або WebP (максимум 5MB)</small>
          </div>

          <div class="form-group">
            <div class="checkbox-group">
              <label for="enableTimer">
                <input
                  type="checkbox"
                  id="enableTimer"
                  name="enableTimer"
                  checked
                />
                ⏱️ Включити таймер відліку акції
              </label>
            </div>
          </div>

          <div class="form-group">
            <div class="checkbox-group">
              <label for="enableStock">
                <input
                  type="checkbox"
                  id="enableStock"
                  name="enableStock"
                  checked
                />
                📦 Показувати "Залишилось 19 футболок по акції"
              </label>
            </div>
          </div>

          <div class="buttons">
            <button type="button" class="button button-secondary" onclick="previewSite()">
              👁️ ПЕРЕГЛЯД
            </button>
            <button type="submit" class="button button-primary">
              📦 ГЕНЕРУВАТИ ZIP
            </button>
          </div>

          <div class="info">
            <p>ZIP містить усі файли: HTML, CSS, JS, зображення, шрифти</p>
            <p>Можеш одразу залити на хостинг!</p>
          </div>
        </form>

        <script>
          let uploadedHeroImageFilename = '';

          // Обробка завантаження фото
          document.getElementById('heroImage').addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('heroImage', file);

            try {
              const response = await fetch('/upload-hero-image', {
                method: 'POST',
                body: formData
              });

              if (!response.ok) throw new Error('Помилка при завантаженні');

              const result = await response.json();
              uploadedHeroImageFilename = result.filename;
              console.log('✅ Фото завантажено:', uploadedHeroImageFilename);
            } catch (error) {
              alert('❌ Помилка при завантаженні фото: ' + error.message);
              document.getElementById('heroImage').value = '';
              uploadedHeroImageFilename = '';
            }
          });

          function getFormParams() {
            const headerText = document.getElementById('headerText').value;
            const heroTitle = document.getElementById('heroTitle').value;
            const enableTimer = document.getElementById('enableTimer').checked ? 'on' : 'off';
            const enableStock = document.getElementById('enableStock').checked ? 'on' : 'off';
            const heroImage = uploadedHeroImageFilename;

            return new URLSearchParams({
              headerText: headerText,
              heroTitle: heroTitle,
              enableTimer: enableTimer,
              enableStock: enableStock,
              heroImage: heroImage
            }).toString();
          }

          function previewSite() {
            const params = getFormParams();
            window.open('/generate?' + params, '_blank');
          }

          document.getElementById('constructorForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const params = getFormParams();
            window.location.href = '/export?' + params;
          });
        </script>
      </div>
    </body>
    </html>
  `);
});

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

// POST /upload-hero-image - Завантажити нове фото для hero блоку
app.post('/upload-hero-image', upload.single('heroImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажений' });
    }

    const filename = req.file.filename;
    console.log(`\n🖼️ ФОТО ЗАВАНТАЖЕНО`);
    console.log(`📁 Файл: ${filename}`);
    console.log(`📏 Розмір: ${(req.file.size / 1024).toFixed(2)} KB\n`);

    res.json({
      success: true,
      filename: filename,
      message: 'Фото успішно завантажено'
    });
  } catch (err) {
    console.error('❌ Помилка при завантаженні:', err.message);
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
      enableTimer: req.query.enableTimer,
      enableStock: req.query.enableStock,
      heroImage: req.query.heroImage
    };

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
      enableTimer: req.query.enableTimer,
      enableStock: req.query.enableStock,
      heroImage: req.query.heroImage
    };

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
      const heroImagePath = path.join(heroImageDir, options.heroImage);
      if (fs.existsSync(heroImagePath)) {
        archive.file(heroImagePath, { name: `img/hero/${options.heroImage}` });
        console.log(`✅ Додано завантажене фото: img/hero/${options.heroImage}`);
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
