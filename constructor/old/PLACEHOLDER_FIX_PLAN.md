# Placeholder Implementation Plan

## Проблема
З 210 полів в `user-config.json` тільки 96 (45.7%) мають відповідні placeholders в `template.ejs`.
114 полів (54.3%) НЕ використовуються при генерації landing page.

## Мета
Додати всі відсутні placeholders в template.ejs, щоб 100% полів з config використовувались.

---

## PHASE 1: Аналіз та категоризація відсутніх placeholders

### 1.1. Створити детальний список всіх відсутніх placeholders
**Файл:** `missing-placeholders-report.json`

**Категорії:**
1. **Meta/SEO** - page.title, page.description
2. **Hero section** - heroButtonText, enableTimer, enableStock, heroImage
3. **Video section** - videoSectionLabel, videoSectionTitle
4. **Products section** - productsSectionLabel, productsSectionTitle, productOrderButtonText, actionChooseText, actionPromoText
5. **Size chart** - sizeChartLabel, sizeChartTitle
6. **Tabs section** - tab images (desktop/mobile)
7. **Reviews section** - review1-4 (Name, Text, Image)
8. **FAQ section** - faq1-4 (Question, Answer)
9. **How to buy** - howLabel, howTitle, howStep1-4
10. **Request form** - requestTitle, requestTimerText, requestPhoneFormat, requestStockPrefix/Suffix
11. **Enable flags** - всі enable* поля (enableTimer, enableStock, enableImage, etc.)

### 1.2. Створити скрипт для генерації звіту
```bash
node generate-missing-placeholders-report.js
```
**Output:** `missing-placeholders-report.json` з категоризацією

---

## PHASE 2: Підготовка template.ejs

### 2.1. Backup поточного template
```bash
cp views/template.ejs views/template.ejs.backup-before-placeholders
```

### 2.2. Аналіз структури template
- Визначити де має бути кожен placeholder
- Створити mapping: категорія → секція в template

---

## PHASE 3: Додавання placeholders по категоріях

### 3.1. Meta/SEO (PRIORITY: HIGH)
**Місце:** `<head>` секція

**Placeholders:**
```html
<title>{{pageTitle}}</title>
<meta name="description" content="{{pageDescription}}">
```

### 3.2. Hero Section (PRIORITY: HIGH)
**Місце:** `.start` секція

**Placeholders:**
- `{{heroImage}}` - головне зображення (може бути окремим параметром)
- `{{heroButtonText}}` - текст на кнопці
- Conditional rendering для timer/stock базуючись на `{{enableTimer}}`, `{{enableStock}}`

**Приклад:**
```html
<% if (enableTimer) { %>
  <div class="timer">{{timerHTML}}</div>
<% } %>

<% if (enableStock) { %>
  <div class="stock">{{stockCount}}</div>
<% } %>

<button>{{heroButtonText}}</button>
```

### 3.3. Video Section (PRIORITY: MEDIUM)
**Місце:** `.video` секція

**Placeholders:**
```html
<span class="video-label">{{videoSectionLabel}}</span>
<h2>{{videoSectionTitle}}</h2>
```

### 3.4. Products Section (PRIORITY: HIGH)
**Місце:** `.products` секція

**Placeholders:**
```html
<span class="products-label">{{productsSectionLabel}}</span>
<h2>{{productsSectionTitle}}</h2>
<button>{{productOrderButtonText}}</button>
<p class="action-choose">{{actionChooseText}}</p>
<p class="action-promo">{{actionPromoText}}</p>
```

### 3.5. Size Chart Section (PRIORITY: MEDIUM)
**Місце:** `.info` або `.size-chart` секція

**Placeholders:**
```html
<span class="sizechart-label">{{sizeChartLabel}}</span>
<h2>{{sizeChartTitle}}</h2>
```

### 3.6. Tabs Section (PRIORITY: MEDIUM)
**Місце:** `.tabs` секція

**Placeholders:**
- `{{tab1ImageDesktop}}`, `{{tab1ImageMobile}}`
- `{{tab2ImageDesktop}}`, `{{tab2ImageMobile}}`
- `{{tab3ImageDesktop}}`, `{{tab3ImageMobile}}`

**Conditional rendering:**
```html
<% if (enableTabItem1) { %>
  <div class="tab">
    <picture>
      <source media="(max-width: 768px)" srcset="{{tab1ImageMobile}}">
      <img src="{{tab1ImageDesktop}}" alt="{{tab1Title}}">
    </picture>
    <h3>{{tab1Title}}</h3>
    <p>{{tab1Description}}</p>
  </div>
<% } %>
```

### 3.7. Reviews Section (PRIORITY: LOW)
**Місце:** `.reviews` секція

**Placeholders:**
```html
<% if (enableReviews) { %>
  <span class="reviews-label">{{reviewsLabel}}</span>
  <h2>{{reviewsTitle}}</h2>

  <% if (review1Name) { %>
    <div class="review">
      <img src="{{review1Image}}" alt="{{review1Name}}">
      <p>{{review1Name}}</p>
      <p>{{review1Text}}</p>
    </div>
  <% } %>

  <!-- Аналогічно для review2, review3, review4 -->
<% } %>
```

### 3.8. FAQ Section (PRIORITY: MEDIUM)
**Місце:** `.faq` секція

**Placeholders:**
```html
<% if (faq1Question) { %>
  <div class="faq-item">
    <h3>{{faq1Question}}</h3>
    <p>{{faq1Answer}}</p>
  </div>
<% } %>

<!-- Аналогічно для faq2, faq3, faq4 -->
```

### 3.9. How To Buy Section (PRIORITY: MEDIUM)
**Місце:** `.how` секція

**Placeholders:**
```html
<span class="how-label">{{howLabel}}</span>
<h2>{{howTitle}}</h2>

<div class="steps">
  <div class="step">1. {{howStep1}}</div>
  <div class="step">2. {{howStep2}}</div>
  <div class="step">3. {{howStep3}}</div>
  <div class="step">4. {{howStep4}}</div>
</div>
```

### 3.10. Request Form Section (PRIORITY: HIGH)
**Місце:** `.request` секція

**Placeholders:**
```html
<h2>{{requestTitle}}</h2>

<% if (enableTimer) { %>
  <p class="timer-text">{{requestTimerText}}</p>
<% } %>

<input placeholder="{{requestNamePlaceholder}}">
<input placeholder="{{requestPhonePlaceholder}}">
<p class="phone-format">{{requestPhoneFormat}}</p>

<button>{{requestButtonText}}</button>

<% if (enableStock) { %>
  <p class="stock-info">{{requestStockPrefix}} <span>{{stockCount}}</span> {{requestStockSuffix}}</p>
<% } %>
```

---

## PHASE 4: Оновлення server.js

### 4.1. Додати replacement для всіх нових placeholders

**Файл:** `server.js` (POST /generate route)

**Зміни:**
```javascript
// Meta/SEO
html = html.replace(/\{\{pageTitle\}\}/g, options.pageTitle || options.page?.title || '');
html = html.replace(/\{\{pageDescription\}\}/g, options.pageDescription || options.page?.description || '');

// Hero
html = html.replace(/\{\{heroButtonText\}\}/g, options.heroButtonText || 'ЗАМОВИТИ');
html = html.replace(/\{\{heroImage\}\}/g, options.heroImage || '');

// Video section
html = html.replace(/\{\{videoSectionLabel\}\}/g, options.videoSectionLabel || 'Відео');
html = html.replace(/\{\{videoSectionTitle\}\}/g, options.videoSectionTitle || '');

// Products section
html = html.replace(/\{\{productsSectionLabel\}\}/g, options.productsSectionLabel || '');
html = html.replace(/\{\{productsSectionTitle\}\}/g, options.productsSectionTitle || '');
html = html.replace(/\{\{productOrderButtonText\}\}/g, options.productOrderButtonText || 'ЗАМОВИТИ');
html = html.replace(/\{\{actionChooseText\}\}/g, options.actionChooseText || '');
html = html.replace(/\{\{actionPromoText\}\}/g, options.actionPromoText || '');

// Size chart
html = html.replace(/\{\{sizeChartLabel\}\}/g, options.sizeChartLabel || '');
html = html.replace(/\{\{sizeChartTitle\}\}/g, options.sizeChartTitle || '');

// Tabs images
html = html.replace(/\{\{tab1ImageDesktop\}\}/g, options.tab1ImageDesktop || '');
html = html.replace(/\{\{tab1ImageMobile\}\}/g, options.tab1ImageMobile || '');
// ... аналогічно для tab2, tab3

// Reviews
html = html.replace(/\{\{reviewsLabel\}\}/g, options.reviewsLabel || '');
html = html.replace(/\{\{reviewsTitle\}\}/g, options.reviewsTitle || '');
html = html.replace(/\{\{review1Name\}\}/g, options.review1Name || '');
// ... та інші

// FAQ
html = html.replace(/\{\{faq1Question\}\}/g, options.faq1Question || '');
html = html.replace(/\{\{faq1Answer\}\}/g, options.faq1Answer || '');
// ... аналогічно для faq2-4

// How to buy
html = html.replace(/\{\{howLabel\}\}/g, options.howLabel || '');
html = html.replace(/\{\{howTitle\}\}/g, options.howTitle || '');
html = html.replace(/\{\{howStep1\}\}/g, options.howStep1 || '');
html = html.replace(/\{\{howStep2\}\}/g, options.howStep2 || '');
html = html.replace(/\{\{howStep3\}\}/g, options.howStep3 || '');
html = html.replace(/\{\{howStep4\}\}/g, options.howStep4 || '');

// Request form
html = html.replace(/\{\{requestTitle\}\}/g, options.requestTitle || '');
html = html.replace(/\{\{requestTimerText\}\}/g, options.requestTimerText || '');
html = html.replace(/\{\{requestPhoneFormat\}\}/g, options.requestPhoneFormat || '');
html = html.replace(/\{\{requestStockPrefix\}\}/g, options.requestStockPrefix || '');
html = html.replace(/\{\{requestStockSuffix\}\}/g, options.requestStockSuffix || '');
```

### 4.2. Обробка enable-полів (conditional rendering)

**Варіант 1: EJS syntax (складніше, але чистіше)**
```javascript
// Передати enable-поля як змінні в EJS
const ejsData = {
  enableTimer: options.enableTimer || false,
  enableStock: options.enableStock || false,
  enableReviews: options.enableReviews || false,
  // ... та інші
};
```

**Варіант 2: Проста заміна (простіше, але гірше)**
```javascript
// Видаляти секції якщо enable = false
if (!options.enableReviews) {
  html = html.replace(/<div class="reviews">[\s\S]*?<\/div>/g, '');
}
```

---

## PHASE 5: Тестування

### 5.1. Створити automated test
```bash
node test-all-placeholders.js
```

**Має показати:** 210/210 PASS ✅

### 5.2. Manual testing
1. Заповнити ВСІ поля в `user-config.json`
2. Натиснути Preview
3. Перевірити що ВСІ placeholders замінились

### 5.3. Edge cases testing
- Пусті значення
- Дуже довгі тексти
- Спецсимволи (', ", <, >)
- Кирилиця

---

## PHASE 6: Рефакторинг (optional)

### 6.1. Створити helper функції для replacements
```javascript
function replaceAll(html, mapping) {
  for (const [placeholder, value] of Object.entries(mapping)) {
    const regex = new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g');
    html = html.replace(regex, value || '');
  }
  return html;
}
```

### 6.2. Використати EJS conditional rendering замість manual string replacement
```ejs
<% if (enableReviews) { %>
  <div class="reviews">
    <!-- reviews HTML -->
  </div>
<% } %>
```

---

## Timeline

| Phase | Завдання | Часу | Priority |
|-------|----------|------|----------|
| 1 | Аналіз та категоризація | 30 хв | HIGH |
| 2 | Backup та підготовка | 10 хв | HIGH |
| 3.1-3.2 | Meta + Hero (HIGH) | 1 год | HIGH |
| 3.4 | Products section | 45 хв | HIGH |
| 3.10 | Request form | 30 хв | HIGH |
| 3.3 | Video section | 20 хв | MEDIUM |
| 3.5 | Size chart | 15 хв | MEDIUM |
| 3.6 | Tabs section | 30 хв | MEDIUM |
| 3.8-3.9 | FAQ + How to buy | 40 хв | MEDIUM |
| 3.7 | Reviews section | 30 хв | LOW |
| 4 | Оновлення server.js | 1.5 год | HIGH |
| 5 | Тестування | 1 год | HIGH |
| 6 | Рефакторинг (optional) | 2 год | LOW |

**Total: ~8-10 годин роботи**

---

## Risk Assessment

### High Risk
- **Поламати існуючий функціонал** - потрібен ретельний backup та тестування
- **Пропустити якісь placeholders** - використовувати automated test

### Medium Risk
- **Неправильна позиція placeholders в template** - перевіряти на реальних даних
- **Проблеми з enable-полями** - потрібна логіка conditional rendering

### Low Risk
- **Проблеми з кирилицею** - вже працює для існуючих полів

---

## Success Criteria

✅ Всі 210 полів з user-config.json мають відповідні placeholders в template
✅ Automated test показує 210/210 PASS
✅ Preview працює з повним config
✅ Export генерує правильний HTML
✅ Всі enable-поля працюють (показують/ховають секції)
✅ Існуючий функціонал не поламався

---

## Next Steps

1. Запустити Phase 1 (аналіз)
2. Отримати approval на plan
3. Почати implementation з HIGH priority tasks
4. Робити тестування після кожної phase
