# Як працює слайдер продуктів - Інструкція для джуна

## Архітектура: ONE CODE - DIFFERENT CONFIG FILES

Всі продукти (1-5) працюють **однаково** - змінюються тільки дані з конфігу!

---

## Крок 1: Структура даних в конфігу

У файлі `constructor/data/user-config.json` для кожного продукту є масив зображень:

```json
{
  "product1Images": [
    "/public/img/products/product-1762647828725.jpg",
    "/public/img/products/product-1762647828757.jpg",
    "/public/img/products/product-1762647828784.jpg",
    "/public/img/products/product-1762647828809.jpg"
  ],
  "product2Images": [
    "/public/img/products/product-1762649141721.jpg",
    "/public/img/products/product-1762649141735.jpg"
  ],
  "product3Images": [],
  "product4Images": [],
  "product5Images": []
}
```

**Правила:**
- Масив може містити від 0 до N зображень
- Шляхи **завжди** починаються з `/public/` (для сервера)
- Порожній масив `[]` = продукт без слайдера

---

## Крок 2: Функція генерації слайдів (`server.js:186`)

```javascript
function generateSlides(images = []) {
  if (!Array.isArray(images) || images.length === 0) {
    return ''; // Порожній масив → порожній HTML
  }

  return images.map(imagePath => {
    // 1. Видалити "/" на початку для відносних шляхів
    const relativePath = imagePath.replace(/^\//, '');

    // 2. Згенерувати HTML для одного слайду
    return `          <div class="swiper-slide products-slide">
           <picture>
            <source srcset="${relativePath}" media="(min-width: 800px)">
            <img src="${relativePath}" alt="img">
           </picture>
          </div>`;
  }).join('\n'); // 3. З'єднати всі слайди в один рядок
}
```

**Що робить:**
1. Перевіряє чи масив не порожній
2. Для **кожного** зображення створює HTML блок слайду
3. Видаляє `/` на початку (`/public/...` → `public/...`)
4. Склеює всі слайди разом

---

## Крок 3: Використання в генерації HTML (`server.js:297`)

```javascript
for (let i = 1; i <= 5; i++) {
  const productImages = options[`product${i}Images`] || [];

  // Викликати функцію генерації
  const slides = generateSlides(productImages);

  // Замінити плейсхолдер в HTML
  html = html.replace(`{{product${i}Slides}}`, slides);
}
```

**Алгоритм для джуна:**
1. Цикл від 1 до 5 (5 продуктів)
2. Взяти масив `product1Images`, `product2Images`, ...
3. Викликати `generateSlides(масив)` → отримати HTML
4. Замінити `{{product1Slides}}` на згенерований HTML

---

## Крок 4: Плейсхолдер в HTML темплейті

В файлі `constructor/index.html` є плейсхолдер:

```html
<!--product1-->
<div class="swiper-wrapper">
  {{product1Slides}}  <!-- ← ТУТ вставляються згенеровані слайди -->
</div>
<!--/product1-->
```

Після генерації стає:

```html
<div class="swiper-wrapper">
  <div class="swiper-slide products-slide">
    <picture>
      <source srcset="public/img/products/product-1762647828725.jpg" media="(min-width: 800px)">
      <img src="public/img/products/product-1762647828725.jpg" alt="img">
    </picture>
  </div>
  <div class="swiper-slide products-slide">
    <picture>
      <source srcset="public/img/products/product-1762647828757.jpg" media="(min-width: 800px)">
      <img src="public/img/products/product-1762647828757.jpg" alt="img">
    </picture>
  </div>
  <!-- ... і так далі для кожного фото -->
</div>
```

---

## Крок 5: Як додати слайдер для інших продуктів (2, 3, 4, 5)

### Варіант А: Якщо плейсхолдер вже є в HTML

1. Відкрий `constructor/index.html`
2. Знайди блок продукту (наприклад `<!--product2-->`)
3. Переконайся що є `{{product2Slides}}`
4. **ВСЕ!** Код вже працює для всіх продуктів (цикл 1-5)

### Варіант Б: Якщо плейсхолдера немає

1. Відкрий `constructor/index.html`
2. Знайди блок продукту 2/3/4/5
3. Додай в потрібне місце:
```html
<!--product2-->
<div class="swiper-wrapper">
  {{product2Slides}}
</div>
<!--/product2-->
```

---

## Приклад: Що відбувається з product1

**Вхідні дані** (конфіг):
```json
"product1Images": [
  "/public/img/products/photo1.jpg",
  "/public/img/products/photo2.jpg"
]
```

**Процес:**
1. `generateSlides()` отримує масив з 2 фото
2. Для кожного фото генерує HTML блок
3. Склеює їх разом
4. Замінює `{{product1Slides}}` на результат

**Вихідний HTML:**
```html
<div class="swiper-slide products-slide">
  <picture>
    <source srcset="public/img/products/photo1.jpg" media="(min-width: 800px)">
    <img src="public/img/products/photo1.jpg" alt="img">
  </picture>
</div>
<div class="swiper-slide products-slide">
  <picture>
    <source srcset="public/img/products/photo2.jpg" media="(min-width: 800px)">
    <img src="public/img/products/photo2.jpg" alt="img">
  </picture>
</div>
```

---

## Контрольний список для джуна

✅ **Для кожного продукту перевір:**

1. [ ] В `user-config.json` є масив `productNImages` (1-5)
2. [ ] В `index.html` є плейсхолдер `{{productNSlides}}`
3. [ ] Цикл в `server.js:280-302` обробляє всі 5 продуктів
4. [ ] Функція `generateSlides()` видаляє `/` на початку шляху
5. [ ] Згенерований HTML використовує **відносні** шляхи (`public/...` не `/public/...`)

---

## Важливі моменти

⚠️ **Шляхи в конфігу vs HTML:**
- Конфіг: `/public/img/...` (абсолютний для сервера)
- HTML: `public/img/...` (відносний для браузера)
- Конвертація: `imagePath.replace(/^\//, '')`

⚠️ **Порожній масив:**
```json
"product3Images": []
```
→ `generateSlides([])` повертає `''` (порожній рядок)
→ Плейсхолдер замінюється на нічого (немає слайдів)

⚠️ **Той самий код для всіх продуктів:**
Немає окремої логіки для product1/2/3/4/5 - тільки цикл!

---

## Підсумок

**Один код - різні дані** ✅

Щоб додати слайдер для product2/3/4/5:
1. Завантаж фото (автоматично додається в `productNImages`)
2. Переконайся що в HTML є `{{productNSlides}}`
3. Готово - код вже працює!