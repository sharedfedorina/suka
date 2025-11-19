# 🔄 ПОВНИЙ FLOW ГЕНЕРАЦІЇ ЛЕНДІНГУ

## 📋 Зміст
- [Режим ПЕРЕГЛЯД (Preview)](#режим-перегляд-preview)
- [Режим ЕКСПОРТ (ZIP)](#режим-експорт-zip)
- [Режим ЗБЕРЕЖЕННЯ](#режим-збереження)
- [Режим ЗАВАНТАЖЕННЯ](#режим-завантаження)
- [Детальна структура файлів](#детальна-структура-файлів)

---

# 🎬 Режим ПЕРЕГЛЯД (Preview)

## Повний ланцюжок від натискання кнопки до відображення лендінгу

```
👤 КОРИСТУВАЧ
│
├─ Відкриває браузер: http://localhost:6614
│
└─> 📄 server.js (рядок ~30)
    │   GET /
    │   Роль: Головний сервер Express.js
    │   Дія: Обробляє HTTP запити
    │
    ├─> 📄 form.html
    │   │   Роль: Головна сторінка конструктора
    │   │   Містить: Кнопки управління, контейнери для секцій
    │   │
    │   ├─> 📄 sections/basic.html
    │   │   │   Роль: Секція базових налаштувань
    │   │   │   Поля: headerText, героїчні налаштування
    │   │   │
    │   ├─> 📄 sections/hero.html
    │   │   │   Роль: Головна героїчна секція
    │   │   │   Поля: heroTitle, heroPrice, heroImage
    │   │   │
    │   ├─> 📄 sections/benefits.html
    │   │   │   Роль: Переваги продукту
    │   │   │   Поля: benefit1-4 (title, description, enabled)
    │   │   │
    │   ├─> 📄 sections/pluslogo.html
    │   │   │   Роль: Блок з логотипом/зображенням
    │   │   │   Поля: enableImage, imageUrl
    │   │   │
    │   ├─> 📄 sections/video.html
    │   │   │   Роль: Відео секція
    │   │   │   Поля: enableVideo, videoUrl, videoThumbnail
    │   │   │
    │   ├─> 📄 sections/products.html
    │   │   │   Роль: Управління продуктами
    │   │   │   Поля: product1-5, product8-9 (name, color, size, price, images)
    │   │   │
    │   ├─> 📄 sections/sizechart.html
    │   │   │   Роль: Розмірна сітка
    │   │   │   Поля: sizeChartImage, sizeChartLabel, sizeChartTitle
    │   │   │
    │   ├─> 📄 sections/tabs.html ⭐
    │   │   │   Роль: TABS секція (особливості продукту)
    │   │   │   Поля: tabsLabel, tabsTitle, tab1-3 (title, description, images)
    │   │   │
    │   ├─> 📄 sections/comments.html
    │   │   │   Роль: Коментарі/відгуки
    │   │   │   Поля: commentsLabel, commentsTitle, статистика
    │   │   │
    │   ├─> 📄 sections/reviews.html
    │   │   │   Роль: Детальні відгуки клієнтів
    │   │   │   Поля: review1-4 (name, text, image)
    │   │   │
    │   ├─> 📄 sections/faq.html ⭐
    │   │   │   Роль: FAQ секція
    │   │   │   Поля: faqLabel, faqTitle, faq1-4 (question, answer)
    │   │   │
    │   ├─> 📄 sections/howto.html ⭐
    │   │   │   Роль: Як купити
    │   │   │   Поля: howLabel, howTitle, howStep1-4
    │   │   │
    │   ├─> 📄 sections/request.html ⭐
    │   │   │   Роль: Форма замовлення
    │   │   │   Поля: requestTitle, requestInfoTitle, requestButtonText, placeholders
    │   │   │
    │   ├─> 📄 sections/footer.html
    │   │   │   Роль: Футер
    │   │   │   Поля: footerCopyright
    │   │   │
    │   ├─> 📄 sections/seo.html ⭐
    │   │   │   Роль: SEO/META теги
    │   │   │   Поля: pageTitle, pageDescription
    │   │   │
    │   └─> 📄 sections/salesdrive.html
    │       │   Роль: Інтеграція SalesDrive
    │       │   Поля: enableSalesDrive, API ключі
    │       │
    │   ВСІ ЦІ СЕКЦІЇ ЗАВАНТАЖУЮТЬСЯ ДИНАМІЧНО В form.html
    │   через fetch('/sections/{name}.html')
    │
    └─> 📄 js/form.js
        │   Роль: Клієнтська логіка конструктора
        │   Функції:
        │   - saveFormToServer() - збереження конфігу
        │   - loadSavedValues() - завантаження конфігу
        │   - previewSite() - генерація preview
        │   - getFormParams() - збір даних з форми
        │
        │
👤 КОРИСТУВАЧ ЗАПОВНЮЄ ФОРМУ
│   heroTitle: "Моя футболка"
│   faq1Question: "Доставка?"
│   tab1Title: "Якість"
│   ...та інші 200+ полів...
│
│
👤 КОРИСТУВАЧ НАТИСКАЄ "👁️ ПЕРЕГЛЯД"
│
│
└─> 📄 js/form.js → previewSite() (рядок 1984)
    │
    ├─ Крок 1: Збирає дані з форми
    │   └─> getFormParams()
    │       │   Обходить всі поля форми
    │       │   Збирає значення в URLSearchParams
    │       │   Результат: "heroTitle=Моя футболка&faq1Question=Доставка?&..."
    │
    ├─ Крок 2: Створює невидиму форму
    │   │   method: POST
    │   │   action: /generate
    │   │   target: _blank (відкрити в новому вікні)
    │
    ├─ Крок 3: Додає hidden inputs
    │   │   <input name="heroTitle" value="Моя футболка">
    │   │   <input name="faq1Question" value="Доставка?">
    │   │   ...200+ полів...
    │
    └─ Крок 4: Відправляє форму
        │   form.submit()
        │
        │
        └─> 🌐 POST /generate
            │
            ├── 📦 req.body (дані з форми)
            │   {
            │     heroTitle: "Моя футболка",
            │     faq1Question: "Доставка?",
            │     tab1Title: "Якість",
            │     ...200+ полів...
            │   }
            │
            │
            └─> 📄 server.js → POST /generate (рядок 1557)
                │
                ├─ Крок 1: Отримує дані з форми
                │   const customData = req.body;
                │
                ├─ Крок 2: Читає fallback конфіг
                │   │
                │   └─> 📄 data/user-config.json
                │       │   Роль: Збережена конфігурація користувача
                │       │   Містить: Всі 210 полів з попередніх збережень
                │       │   Використання: Fallback якщо поле не заповнене в формі
                │       │
                │       {
                │         heroTitle: "Стара футболка",
                │         faq1Question: "Оплата?",
                │         tab1Title: "Комфорт",
                │         ...210 полів...
                │       }
                │
                ├─ Крок 3: Об'єднує дані (пріоритет: форма > конфіг)
                │   const mergedData = { ...defaultData, ...customData };
                │   Результат:
                │   {
                │     heroTitle: "Моя футболка",     ← з форми
                │     faq1Question: "Доставка?",     ← з форми
                │     tab1Title: "Якість",           ← з форми
                │     someOtherField: "значення з конфігу"  ← fallback з user-config.json
                │   }
                │
                │
                └─ Крок 4: Викликає головну функцію
                    │
                    │
                    └─> 📄 server.js → generateHTML() (рядок 251)
                        │   Роль: Головна функція генерації HTML
                        │   Вхідні дані: mergedData (об'єднані дані)
                        │   Результат: Повний HTML лендінгу
                        │
                        ├─ ШАГ 1: Читає шаблон
                        │   │
                        │   └─> 📄 views/template.ejs
                        │       │   Роль: БАЗОВИЙ HTML-шаблон лендінгу
                        │       │   Містить: Повну структуру HTML з {{placeholder}}
                        │       │   Розмір: ~3000+ рядків HTML
                        │       │
                        │       │   Приклад вмісту:
                        │       │   <!DOCTYPE html>
                        │       │   <html>
                        │       │   <head>
                        │       │     <title>{{pageTitle}}</title>
                        │       │     <meta name="description" content="{{pageDescription}}">
                        │       │   </head>
                        │       │   <body>
                        │       │     <header>{{headerText}}</header>
                        │       │     <h1>{{heroTitle}}</h1>
                        │       │     <div class="price">{{heroPrice}}</div>
                        │       │
                        │       │     <!-- FAQ section -->
                        │       │     <section class="faq">
                        │       │       <span class="label">{{faqLabel}}</span>
                        │       │       <h2>{{faqTitle}}</h2>
                        │       │       <div class="faq-item">
                        │       │         <h3>{{faq1Question}}</h3>
                        │       │         <p>{{faq1Answer}}</p>
                        │       │       </div>
                        │       │       <div class="faq-item">
                        │       │         <h3>{{faq2Question}}</h3>
                        │       │         <p>{{faq2Answer}}</p>
                        │       │       </div>
                        │       │       ...
                        │       │     </section>
                        │       │
                        │       │     <!-- TABS section -->
                        │       │     <section class="tabs">
                        │       │       <span class="label">{{tabsLabel}}</span>
                        │       │       <h2>{{tabsTitle}}</h2>
                        │       │       <div class="tab">
                        │       │         <h3>{{tab1Title}}</h3>
                        │       │         <p>{{tab1Description}}</p>
                        │       │       </div>
                        │       │       ...
                        │       │     </section>
                        │       │
                        │       │     <!-- REQUEST section -->
                        │       │     <section class="request">
                        │       │       <h2>{{requestTitle}}</h2>
                        │       │       <input placeholder="{{requestNamePlaceholder}}">
                        │       │       <button>{{requestButtonText}}</button>
                        │       │     </section>
                        │       │   </body>
                        │       │   </html>
                        │       │
                        │       let html = fs.readFileSync(templatePath, 'utf8');
                        │
                        │
                        ├─ ШАГ 2: Базові заміни в server.js
                        │   │   Роль: Заміна основних полів безпосередньо в generateHTML()
                        │   │   Поля: ~100+ полів обробляються тут
                        │   │
                        │   ├─ headerText
                        │   │   const finalHeaderText = options.headerText || dataObj.headerText || '';
                        │   │   html = html.replace('{{headerText}}', finalHeaderText);
                        │   │
                        │   ├─ heroTitle
                        │   │   const finalHeroTitle = options.heroTitle || dataObj.heroTitle || '';
                        │   │   html = html.replace('{{heroTitle}}', finalHeroTitle);
                        │   │
                        │   ├─ heroPrice
                        │   │   const finalHeroPrice = options.heroPrice || dataObj.hero?.price || '';
                        │   │   html = html.replace('{{heroPrice}}', finalHeroPrice);
                        │   │
                        │   ├─ heroButtonText
                        │   ├─ heroImage
                        │   ├─ videoUrl
                        │   ├─ videoThumbnailDesktop
                        │   ├─ videoThumbnailMobile
                        │   ├─ sizeChartImage
                        │   ├─ sizeChartLabel
                        │   ├─ sizeChartTitle
                        │   ├─ product1-5 поля (name, color, size, price...)
                        │   ├─ product8-9 поля
                        │   ├─ commentsLabel, commentsTitle, commentsStats
                        │   ├─ benefits (через цикл)
                        │   └─ ...та інші ~100 полів...
                        │
                        │   Після цього HTML вже має ЧАСТКОВО замінені плейсхолдери
                        │
                        │
                        ├─ ШАГ 3: МОДУЛЬНІ ЗАМІНИ ⭐ (рядок 304-305)
                        │   │   const applyAllReplacements = require('./server/replacements');
                        │   │   html = applyAllReplacements(html, options, dataObj);
                        │   │
                        │   │
                        │   └─> 📄 server/replacements/index.js
                        │       │   Роль: КООРДИНАТОР всіх модульних замін
                        │       │   Викликає всі модулі по черзі
                        │       │
                        │       ├─> 📄 server/replacements/tabs.js
                        │       │   │   Роль: Заміна TABS секції
                        │       │   │   Обробляє: 14 полів
                        │       │   │
                        │       │   ├─ tabsLabel
                        │       │   │   const tabsLabel = options.tabsLabel || dataObj.tabsLabel || '';
                        │       │   │   html = html.replace(/\{\{tabsLabel\}\}/g, tabsLabel);
                        │       │   │
                        │       │   ├─ tabsTitle
                        │       │   │   const tabsTitle = options.tabsTitle || dataObj.tabsTitle || '';
                        │       │   │   html = html.replace(/\{\{tabsTitle\}\}/g, tabsTitle);
                        │       │   │
                        │       │   ├─ Tab 1
                        │       │   │   ├─ tab1Title
                        │       │   │   ├─ tab1Description
                        │       │   │   ├─ tab1ImageDesktop
                        │       │   │   └─ tab1ImageMobile
                        │       │   │
                        │       │   ├─ Tab 2
                        │       │   │   ├─ tab2Title
                        │       │   │   ├─ tab2Description
                        │       │   │   ├─ tab2ImageDesktop
                        │       │   │   └─ tab2ImageMobile
                        │       │   │
                        │       │   └─ Tab 3
                        │       │       ├─ tab3Title
                        │       │       ├─ tab3Description
                        │       │       ├─ tab3ImageDesktop
                        │       │       └─ tab3ImageMobile
                        │       │
                        │       │   Повертає: html з заміненими {{tabs*}} плейсхолдерами
                        │       │
                        │       │
                        │       ├─> 📄 server/replacements/faq.js
                        │       │   │   Роль: Заміна FAQ секції
                        │       │   │   Обробляє: 9 полів
                        │       │   │
                        │       │   ├─ faqLabel
                        │       │   │   const faqLabel = options.faqLabel || dataObj.faqLabel || '';
                        │       │   │   html = html.replace(/\{\{faqLabel\}\}/g, faqLabel);
                        │       │   │
                        │       │   ├─ faqTitle
                        │       │   │   const faqTitle = options.faqTitle || dataObj.faqTitle || '';
                        │       │   │   html = html.replace(/\{\{faqTitle\}\}/g, faqTitle);
                        │       │   │
                        │       │   ├─ FAQ 1
                        │       │   │   ├─ faq1Question
                        │       │   │   │   const faq1Question = options.faq1Question || dataObj.faq1Question || '';
                        │       │   │   │   html = html.replace(/\{\{faq1Question\}\}/g, faq1Question);
                        │       │   │   │
                        │       │   │   └─ faq1Answer
                        │       │   │       const faq1Answer = options.faq1Answer || dataObj.faq1Answer || '';
                        │       │   │       html = html.replace(/\{\{faq1Answer\}\}/g, faq1Answer);
                        │       │   │
                        │       │   ├─ FAQ 2 (faq2Question, faq2Answer)
                        │       │   ├─ FAQ 3 (faq3Question, faq3Answer)
                        │       │   └─ FAQ 4 (faq4Question, faq4Answer)
                        │       │
                        │       │   Повертає: html з заміненими {{faq*}} плейсхолдерами
                        │       │
                        │       │
                        │       ├─> 📄 server/replacements/howto.js
                        │       │   │   Роль: Заміна HOW TO BUY секції
                        │       │   │   Обробляє: 5 полів
                        │       │   │
                        │       │   ├─ howLabel
                        │       │   │   const howLabel = options.howLabel || dataObj.howLabel || '';
                        │       │   │   html = html.replace(/\{\{howLabel\}\}/g, howLabel);
                        │       │   │
                        │       │   ├─ howTitle
                        │       │   │   const howTitle = options.howTitle || dataObj.howTitle || '';
                        │       │   │   html = html.replace(/\{\{howTitle\}\}/g, howTitle);
                        │       │   │
                        │       │   ├─ howStep1
                        │       │   │   const howStep1 = options.howStep1 || dataObj.howStep1 || '';
                        │       │   │   html = html.replace(/\{\{howStep1\}\}/g, howStep1);
                        │       │   │
                        │       │   ├─ howStep2
                        │       │   ├─ howStep3
                        │       │   └─ howStep4
                        │       │
                        │       │   Повертає: html з заміненими {{how*}} плейсхолдерами
                        │       │
                        │       │
                        │       ├─> 📄 server/replacements/request.js
                        │       │   │   Роль: Заміна REQUEST FORM секції
                        │       │   │   Обробляє: 10 полів
                        │       │   │
                        │       │   ├─ requestTitle
                        │       │   │   const requestTitle = options.requestTitle || dataObj.requestTitle || '';
                        │       │   │   html = html.replace(/\{\{requestTitle\}\}/g, requestTitle);
                        │       │   │
                        │       │   ├─ requestTimerText
                        │       │   ├─ requestInfoTitle
                        │       │   ├─ requestInfoDescription
                        │       │   ├─ requestNamePlaceholder
                        │       │   │   const requestNamePlaceholder = options.requestNamePlaceholder || dataObj.requestNamePlaceholder || '';
                        │       │   │   html = html.replace(/\{\{requestNamePlaceholder\}\}/g, requestNamePlaceholder);
                        │       │   │
                        │       │   ├─ requestPhonePlaceholder
                        │       │   ├─ requestPhoneFormat
                        │       │   ├─ requestButtonText
                        │       │   │   const requestButtonText = options.requestButtonText || dataObj.requestButtonText || '';
                        │       │   │   html = html.replace(/\{\{requestButtonText\}\}/g, requestButtonText);
                        │       │   │
                        │       │   ├─ requestStockPrefix
                        │       │   └─ requestStockSuffix
                        │       │
                        │       │   Повертає: html з заміненими {{request*}} плейсхолдерами
                        │       │
                        │       │
                        │       └─> 📄 server/replacements/seo.js
                        │           │   Роль: Заміна SEO/META полів
                        │           │   Обробляє: 2 поля
                        │           │
                        │           ├─ pageTitle
                        │           │   const pageTitle = options.pageTitle || dataObj.pageTitle || '';
                        │           │   html = html.replace(/\{\{pageTitle\}\}/g, pageTitle);
                        │           │
                        │           └─ pageDescription
                        │               const pageDescription = options.pageDescription || dataObj.pageDescription || '';
                        │               html = html.replace(/\{\{pageDescription\}\}/g, pageDescription);
                        │
                        │           Повертає: html з заміненими {{page*}} плейсхолдерами
                        │
                        │       Після проходження через ВСІ модулі:
                        │       html тепер має ПОВНІСТЮ замінені плейсхолдери з 5 модулів
                        │       (TABS, FAQ, HOWTO, REQUEST, SEO = 40 полів)
                        │
                        │
                        ├─ ШАГ 4: Видалення вимкнених секцій
                        │   │   Роль: Видалити HTML блоки якщо секція вимкнена
                        │   │
                        │   ├─ Таймер
                        │   │   if (enableTimer !== 'on') {
                        │   │     html = html.replace(/<!--timer-->[\s\S]*?<!--\/timer-->/g, '');
                        │   │   }
                        │   │
                        │   ├─ Стоки
                        │   │   if (enableStock !== 'on') {
                        │   │     html = html.replace(/<!--stock-->[\s\S]*?<!--\/stock-->/g, '');
                        │   │   }
                        │   │
                        │   ├─ Image блок
                        │   ├─ Video блок
                        │   ├─ Продукти (1-5, 8-9)
                        │   ├─ Comments
                        │   ├─ FAQ
                        │   ├─ How to Buy
                        │   └─ Request
                        │
                        │
                        └─ РЕЗУЛЬТАТ: Повний готовий HTML
                            │   Розмір: ~2500+ рядків
                            │   Всі {{placeholder}} замінені на реальні значення
                            │   Вимкнені секції видалені
                            │
                            return html;


📄 server.js → POST /generate (рядок 1557)
│   Отримує готовий HTML від generateHTML()
│
├─ Встановлює headers
│   res.setHeader('Content-Type', 'text/html; charset=utf-8');
│
└─ Відправляє HTML браузеру
    res.send(html);


🌐 БРАУЗЕР
│   Отримує готовий HTML
│   Відкриває в новому вікні (_blank)
│
└─> 👁️ КОРИСТУВАЧ БАЧИТЬ ЛЕНДІНГ
    │   Всі плейсхолдери замінені
    │   Вимкнені секції відсутні
    │   Лендінг готовий до перегляду
    │
    └─> Також завантажується:
        │
        ├─> 📄 public/js/main.js
        │   │   Роль: JavaScript логіка лендінгу
        │   │   Функції:
        │   │   - Слайдери продуктів (Swiper)
        │   │   - Модальні вікна
        │   │   - Валідація форм
        │   │   - Таймер акції
        │   │
        ├─> 📄 public/css/style.css
        │   │   Роль: Стилі лендінгу
        │   │
        └─> 📁 public/img/
            │   Роль: Всі зображення
            │   - hero/
            │   - products/
            │   - tabs/
            │   - faq/
            │   - etc.
```

---

# 📦 Режим ЕКСПОРТ (ZIP)

## Генерація ZIP-архіву лендінгу

```
👤 КОРИСТУВАЧ НАТИСКАЄ "📦 ГЕНЕРУВАТИ ZIP"
│
│
└─> 📄 js/form.js → form.submit()
    │   Відправляє GET запит на /export
    │
    │
    └─> 📄 server.js → GET /export (рядок 1581)
        │   Роль: Створення ZIP-архіву
        │
        ├─ Крок 1: Читає конфіг
        │   │
        │   └─> 📄 data/user-config.json
        │       │   Беремо збережену конфігурацію
        │
        ├─ Крок 2: Генерує HTML
        │   │   const html = generateHTML(data);
        │   │   (Той самий процес що і для preview)
        │   │
        │   └─> Отримуємо готовий HTML з заміненими плейсхолдерами
        │
        ├─ Крок 3: Створює ZIP архів
        │   │   Використовує бібліотеку archiver
        │   │
        │   ├─> Додає згенерований HTML як index.html
        │   │   archive.append(html, { name: 'index.html' });
        │   │
        │   ├─> Копіює всі статичні файли
        │   │   │
        │   │   ├─> 📁 public/css/ → css/
        │   │   │   │   Всі CSS файли
        │   │   │   └─> style.css
        │   │   │
        │   │   ├─> 📁 public/js/ → js/
        │   │   │   │   Всі JavaScript файли
        │   │   │   ├─> main.js
        │   │   │   └─> swiper.min.js
        │   │   │
        │   │   └─> 📁 public/img/ → img/
        │   │       │   Всі зображення
        │   │       ├─> hero/
        │   │       ├─> products/
        │   │       ├─> tabs/
        │   │       ├─> faq/
        │   │       └─> ...
        │   │
        │   └─ Результат: landing.zip
        │       │
        │       ├─ index.html (згенерований з template.ejs)
        │       ├─ css/
        │       ├─ js/
        │       └─ img/
        │
        │
        └─> Відправляє ZIP файл користувачу
            res.download('landing.zip');


👤 КОРИСТУВАЧ
│   Завантажує landing.zip
│   Розпаковує
│   Відкриває index.html
│
└─> Лендінг готовий до публікації!
```

---

# 💾 Режим ЗБЕРЕЖЕННЯ

## Збереження конфігурації на сервер

```
👤 КОРИСТУВАЧ НАТИСКАЄ "💾 ЗБЕРЕГТИ"
│
│
└─> 📄 js/form.js → saveFormToServer() (рядок 729)
    │   Роль: Зібрати всі дані з форми і зберегти
    │
    ├─ Крок 1: Збирає дані з форми
    │   │   Обходить всі поля всіх секцій
    │   │
    │   ├─ Basic секція
    │   │   headerText, heroTitle, heroPrice, enableTimer, enableStock
    │   │
    │   ├─ Hero секція
    │   │   heroImage, heroButtonText
    │   │
    │   ├─ Benefits секція
    │   │   benefits: [{ id, enabled, title, description }, ...]
    │   │
    │   ├─ Products секція
    │   │   product1-5Name, Color, Size, Price, Images
    │   │   product8-9Name, Color, Size, Price, Images
    │   │
    │   ├─ TABS секція
    │   │   enableTabs, tabsLabel, tabsTitle
    │   │   tab1-3Title, Description, ImageDesktop, ImageMobile
    │   │
    │   ├─ Comments секція
    │   │   commentsLabel, commentsTitle, статистика
    │   │
    │   ├─ FAQ секція
    │   │   faqLabel, faqTitle
    │   │   faq1-4Question, Answer
    │   │
    │   ├─ HOW TO секція
    │   │   howLabel, howTitle
    │   │   howStep1-4
    │   │
    │   ├─ REQUEST секція
    │   │   requestTitle, requestInfoTitle, requestButtonText
    │   │   requestNamePlaceholder, requestPhonePlaceholder
    │   │
    │   └─ SEO секція
    │       pageTitle, pageDescription
    │
    │   Результат: formData (об'єкт з 210+ полями)
    │
    │
    ├─ Крок 2: Відправляє на сервер
    │   │   POST /api/save-config
    │   │   Body: JSON.stringify(formData)
    │   │
    │   │
    │   └─> 📄 server.js → POST /api/save-config
    │       │   Роль: Зберегти конфіг у файл
    │       │
    │       ├─ Отримує formData з req.body
    │       │
    │       ├─ Створює бекап старого конфігу
    │       │   │
    │       │   └─> 📄 data/user-config.backup-TIMESTAMP.json
    │       │       │   Зберігає попередню версію
    │       │
    │       └─ Записує новий конфіг
    │           │
    │           └─> 📄 data/user-config.json
    │               │   ПЕРЕЗАПИСУЄ файл новими даними
    │               │   Тепер містить свіжі дані з форми
    │
    │
    └─> ✅ Дані збережені!
        alert('✅ Дані збережені на сервері!');
```

---

# 📂 Режим ЗАВАНТАЖЕННЯ

## Завантаження збереженої конфігурації

```
👤 КОРИСТУВАЧ НАТИСКАЄ "📂 ЗАВАНТАЖИТИ ОСТАННІ ЗМІНИ"
│
│
└─> 📄 js/form.js → loadSavedValues() (рядок 1094)
    │   Роль: Завантажити збережений конфіг і заповнити форму
    │
    ├─ Крок 1: Запит на сервер
    │   │   GET /api/get-user-config
    │   │
    │   │
    │   └─> 📄 server.js → GET /api/get-user-config
    │       │   Роль: Віддати збережений конфіг
    │       │
    │       └─> Читає файл
    │           │
    │           └─> 📄 data/user-config.json
    │               │   Містить всі збережені дані
    │               │
    │               res.json(data);
    │
    │
    ├─ Крок 2: Отримує дані
    │   const formData = await response.json();
    │
    │
    └─ Крок 3: Заповнює форму
        │   Обходить всі поля і встановлює значення
        │
        ├─ Basic поля
        │   safeSetValue('headerText', formData.headerText);
        │   safeSetValue('heroTitle', formData.heroTitle);
        │
        ├─ Products
        │   safeSetValue('product1Name', formData.product1Name);
        │   product1Images = formData.product1Images;
        │   renderProduct1Images();
        │
        ├─ TABS
        │   safeSetValue('tabsLabel', formData.tabsLabel);
        │   safeSetValue('tab1Title', formData.tab1Title);
        │
        ├─ FAQ
        │   safeSetValue('faqLabel', formData.faqLabel);
        │   safeSetValue('faq1Question', formData.faq1Question);
        │
        ├─ HOW TO
        │   safeSetValue('howLabel', formData.howLabel);
        │   safeSetValue('howStep1', formData.howStep1);
        │
        ├─ REQUEST
        │   safeSetValue('requestTitle', formData.requestTitle);
        │   safeSetValue('requestButtonText', formData.requestButtonText);
        │
        └─ SEO
            safeSetValue('pageTitle', formData.pageTitle);
            safeSetValue('pageDescription', formData.pageDescription);


✅ ФОРМА ЗАПОВНЕНА ЗБЕРЕЖЕНИМИ ДАНИМИ
alert('✅ Завантажені ваші останні зміни!');
```

---

# 📊 Детальна структура файлів

## Всі файли проекту та їх роль

```
constructor/
│
├─ 🔧 ГОЛОВНІ ФАЙЛИ
│  │
│  ├─ server.js ⭐⭐⭐
│  │  Роль: Express.js сервер, головний файл
│  │  Розмір: ~1600 рядків
│  │  Відповідає за:
│  │  - Обробку всіх HTTP запитів
│  │  - Генерацію HTML (функція generateHTML)
│  │  - Створення ZIP архівів
│  │  - Збереження/завантаження конфігу
│  │  - Завантаження зображень/відео
│  │
│  ├─ form.html ⭐⭐
│  │  Роль: Головна сторінка конструктора
│  │  Містить: Кнопки управління, контейнери для секцій
│  │  Динамічно завантажує: sections/*.html
│  │
│  └─ index.html
│     Роль: Статичний лендінг (НЕ для preview!)
│     Використання: Тільки для ZIP експорту
│
│
├─ 📁 js/
│  │
│  ├─ form.js ⭐⭐
│  │  Роль: Клієнтська логіка конструктора
│  │  Розмір: ~2000 рядків
│  │  Функції:
│  │  - previewSite() - генерація preview
│  │  - saveFormToServer() - збереження
│  │  - loadSavedValues() - завантаження
│  │  - getFormParams() - збір даних
│  │  - handleProduct*ImageUpload() - завантаження фото
│  │
│  └─ main.js ⭐
│     Роль: JavaScript логіка ЛЕНДІНГУ (не конструктора!)
│     Використовується: В готовому лендінгу
│     Функції:
│     - Слайдери продуктів (Swiper)
│     - Модальні вікна
│     - Валідація форм
│     - Таймер акції
│
│
├─ 📁 views/
│  │
│  └─ template.ejs ⭐⭐⭐
│     Роль: БАЗОВИЙ HTML-шаблон з {{placeholder}}
│     Розмір: ~3000 рядків
│     Містить: Повну структуру лендінгу
│     Використовується: Для генерації preview і ZIP
│
│     Приклад структури:
│     <!DOCTYPE html>
│     <html>
│     <head>
│       <title>{{pageTitle}}</title>
│       <meta name="description" content="{{pageDescription}}">
│     </head>
│     <body>
│       <!-- Header -->
│       <header>{{headerText}}</header>
│
│       <!-- Hero section -->
│       <section class="hero">
│         <h1>{{heroTitle}}</h1>
│         <div class="price">{{heroPrice}}</div>
│         <button>{{heroButtonText}}</button>
│       </section>
│
│       <!-- Products section -->
│       <section class="products">
│         <!--product1-->
│         <div class="product">
│           <h3>{{product1Name}}</h3>
│           <p>{{product1Color}}</p>
│           <div class="price">{{product1Price}}</div>
│         </div>
│         <!--/product1-->
│       </section>
│
│       <!-- TABS section -->
│       <section class="tabs">
│         <span class="label">{{tabsLabel}}</span>
│         <h2>{{tabsTitle}}</h2>
│         <div class="tab">
│           <h3>{{tab1Title}}</h3>
│           <p>{{tab1Description}}</p>
│           <img src="{{tab1ImageDesktop}}">
│         </div>
│       </section>
│
│       <!-- FAQ section -->
│       <section class="faq">
│         <span class="label">{{faqLabel}}</span>
│         <h2>{{faqTitle}}</h2>
│         <div class="faq-item">
│           <h3>{{faq1Question}}</h3>
│           <p>{{faq1Answer}}</p>
│         </div>
│       </section>
│
│       <!-- HOW TO section -->
│       <section class="how">
│         <span class="label">{{howLabel}}</span>
│         <h2>{{howTitle}}</h2>
│         <div class="step">{{howStep1}}</div>
│       </section>
│
│       <!-- REQUEST section -->
│       <section class="request">
│         <h2>{{requestTitle}}</h2>
│         <input placeholder="{{requestNamePlaceholder}}">
│         <button>{{requestButtonText}}</button>
│       </section>
│     </body>
│     </html>
│
│
├─ 📁 server/replacements/ ⭐⭐⭐
│  │  Роль: МОДУЛЬНА СИСТЕМА ЗАМІН
│  │
│  ├─ index.js
│  │  Роль: Координатор, викликає всі модулі
│  │
│  │  module.exports = function applyAllReplacements(html, options, dataObj) {
│  │    html = applyTabsReplacements(html, options, dataObj);
│  │    html = applyFaqReplacements(html, options, dataObj);
│  │    html = applyHowToReplacements(html, options, dataObj);
│  │    html = applyRequestReplacements(html, options, dataObj);
│  │    html = applySeoReplacements(html, options, dataObj);
│  │    return html;
│  │  };
│  │
│  ├─ tabs.js ⭐
│  │  Роль: Заміна TABS секції
│  │  Обробляє: 14 полів
│  │
│  │  - tabsLabel
│  │  - tabsTitle
│  │  - tab1Title, tab1Description, tab1ImageDesktop, tab1ImageMobile
│  │  - tab2Title, tab2Description, tab2ImageDesktop, tab2ImageMobile
│  │  - tab3Title, tab3Description, tab3ImageDesktop, tab3ImageMobile
│  │
│  │  Fallback pattern:
│  │  const field = options.field || dataObj.field || '';
│  │  html = html.replace(/\{\{field\}\}/g, field);
│  │
│  ├─ faq.js ⭐
│  │  Роль: Заміна FAQ секції
│  │  Обробляє: 9 полів
│  │
│  │  - faqLabel
│  │  - faqTitle
│  │  - faq1Question, faq1Answer
│  │  - faq2Question, faq2Answer
│  │  - faq3Question, faq3Answer
│  │  - faq4Question, faq4Answer
│  │
│  ├─ howto.js ⭐
│  │  Роль: Заміна HOW TO BUY секції
│  │  Обробляє: 5 полів
│  │
│  │  - howLabel
│  │  - howTitle
│  │  - howStep1
│  │  - howStep2
│  │  - howStep3
│  │  - howStep4
│  │
│  ├─ request.js ⭐
│  │  Роль: Заміна REQUEST FORM секції
│  │  Обробляє: 10 полів
│  │
│  │  - requestTitle
│  │  - requestTimerText
│  │  - requestInfoTitle
│  │  - requestInfoDescription
│  │  - requestNamePlaceholder
│  │  - requestPhonePlaceholder
│  │  - requestPhoneFormat
│  │  - requestButtonText
│  │  - requestStockPrefix
│  │  - requestStockSuffix
│  │
│  └─ seo.js ⭐
│     Роль: Заміна SEO/META полів
│     Обробляє: 2 поля
│
│     - pageTitle
│     - pageDescription
│
│
├─ 📁 sections/
│  │  Роль: HTML-фрагменти секцій форми
│  │  Завантажуються: Динамічно в form.html
│  │
│  ├─ basic.html - Базові налаштування
│  ├─ hero.html - Героїчна секція
│  ├─ benefits.html - Переваги
│  ├─ pluslogo.html - Логотип/зображення
│  ├─ video.html - Відео
│  ├─ products.html - Продукти
│  ├─ sizechart.html - Розмірна сітка
│  ├─ tabs.html ⭐ - TABS секція
│  ├─ comments.html - Коментарі
│  ├─ reviews.html - Відгуки
│  ├─ faq.html ⭐ - FAQ
│  ├─ howto.html ⭐ - Як купити
│  ├─ request.html ⭐ - Форма замовлення
│  ├─ footer.html - Футер
│  ├─ seo.html ⭐ - SEO
│  └─ salesdrive.html - Інтеграція SalesDrive
│
│
├─ 📁 data/
│  │
│  ├─ user-config.json ⭐⭐⭐
│  │  Роль: ЗБЕРЕЖЕНА КОНФІГУРАЦІЯ
│  │  Містить: Всі 210 полів
│  │  Використання: Fallback при генерації
│  │  Оновлюється: При натисканні "💾 Зберегти"
│  │
│  │  {
│  │    "headerText": "...",
│  │    "heroTitle": "...",
│  │    "faq1Question": "...",
│  │    "tab1Title": "...",
│  │    ...210 полів...
│  │  }
│  │
│  └─ user-config.backup-*.json
│     Роль: Бекапи конфігурації
│     Створюються: При кожному збереженні
│
│
└─ 📁 public/
   │  Роль: Статичні файли лендінгу
   │
   ├─ 📁 css/
   │  └─ style.css - Стилі лендінгу
   │
   ├─ 📁 js/
   │  ├─ main.js - JavaScript лендінгу
   │  └─ swiper.min.js - Бібліотека слайдера
   │
   └─ 📁 img/
      ├─ hero/ - Зображення героїчної секції
      ├─ products/ - Фото продуктів
      ├─ tabs/ - Зображення для TABS
      ├─ faq/ - Зображення для FAQ
      └─ ... - Інші зображення
```

---

# 🎯 Підсумок: Потік даних

## Від форми до готового лендінгу

```
1. 👤 КОРИСТУВАЧ
   └─> Заповнює форму (form.html + sections/*.html)
       └─> 210+ полів

2. 📄 data/user-config.json
   └─> Зберігає дані як fallback
       └─> Використовується якщо поле не заповнене

3. 🎬 Натискання "ПЕРЕГЛЯД"
   └─> js/form.js → previewSite()
       └─> POST /generate з даними форми

4. 🔧 server.js → generateHTML()
   │
   ├─> Читає views/template.ejs (шаблон з {{placeholder}})
   │
   ├─> Заміна в server.js (~100 полів)
   │   └─> heroTitle, heroPrice, product1-5, etc.
   │
   ├─> Модульні заміни (40 полів)
   │   └─> server/replacements/
   │       ├─> tabs.js (14 полів)
   │       ├─> faq.js (9 полів)
   │       ├─> howto.js (5 полів)
   │       ├─> request.js (10 полів)
   │       └─> seo.js (2 поля)
   │
   └─> Видалення вимкнених секцій

5. ✅ ГОТОВИЙ HTML
   └─> Всі {{placeholder}} замінені
       └─> Віддається браузеру

6. 👁️ КОРИСТУВАЧ БАЧИТЬ ЛЕНДІНГ
   └─> З public/js/main.js (логіка)
   └─> З public/css/style.css (стилі)
   └─> З public/img/* (зображення)
```

---

# 📌 Важливі моменти

## ❗ НЕ ПЛУТАТИ

### index.html vs template.ejs

```
❌ index.html
   Роль: Статичний файл
   Використання: ТІЛЬКИ для ZIP експорту
   НЕ використовується: Для preview режиму

✅ template.ejs
   Роль: Шаблон з {{placeholder}}
   Використання: Для генерації preview і ZIP
   Обробляється: generateHTML() в server.js
```

### form.html vs template.ejs

```
form.html
   Роль: Інтерфейс конструктора
   Містить: Форми для редагування
   Для: Користувача (заповнення даних)

template.ejs
   Роль: Шаблон лендінгу
   Містить: HTML структура з {{placeholder}}
   Для: Генерації готового лендінгу
```

### sections/*.html vs template.ejs

```
sections/*.html
   Роль: Фрагменти ФОРМИ
   Завантажуються: В form.html
   Для: Редагування даних

template.ejs
   Роль: Шаблон ЛЕНДІНГУ
   Використовується: Для генерації HTML
   Для: Відображення результату
```

## 🔑 Ключові концепції

### Fallback pattern

```javascript
const field = options.field || dataObj.field || '';
//            ↑ з форми      ↑ з config    ↑ пусто
```

**Пріоритет:**
1. Дані з форми (options) - найвищий
2. Дані з user-config.json (dataObj) - fallback
3. Пуста строка ('') - останній fallback

### Модульність

```
Кожна секція = окремий файл

server/replacements/tabs.js → TABS секція
server/replacements/faq.js → FAQ секція
server/replacements/howto.js → HOW TO секція
server/replacements/request.js → REQUEST секція
server/replacements/seo.js → SEO секція

Координатор: server/replacements/index.js
```

### Глобальна заміна

```javascript
// ❌ Не глобальна - замінить тільки першу
html = html.replace('{{field}}', value);

// ✅ Глобальна - замінить ВСІ
html = html.replace(/\{\{field\}\}/g, value);
```

---

# 📊 Статистика

## Покриття плейсхолдерів

```
Всього полів у конфігу: 210

Покрито плейсхолдерами: 137 (65.2%)
├─ В server.js: ~100 полів
└─ В server/replacements/: 40 полів
   ├─ tabs.js: 14
   ├─ faq.js: 9
   ├─ howto.js: 5
   ├─ request.js: 10
   └─ seo.js: 2

Не покрито: 73 (34.8%)
├─ Технічні прапори: enable*, visible*
├─ Масиви зображень: обробляються generateSlides()
└─ Невикористані поля
```

---

**Створено:** 2025-11-17
**Версія:** 1.0
**Проект:** Landing Page Constructor
