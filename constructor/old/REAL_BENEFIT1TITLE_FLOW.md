# РЕАЛЬНИЙ FLOW: {{benefit1Title}} від user-config.json до HTML

## ЩО Я ЗНАЙШОВ

**benefits відправляється як JSON STRING, але НЕ парситься в POST /generate!**

Тут тільки ФАКТИ з реального коду, без рішень.

---

## КРОК 1: Форма (form.html)

**Файл:** `form.html` лінія 113-129

```html
<div class="form-section">
  <h3>🎁 Переваги</h3>
  <div id="benefitsContainer">
    <!-- Динамічно генерується через JS -->
  </div>
</div>
```

---

## КРОК 2: Ініціалізація форми (js/form.js)

**Файл:** `js/form.js` лінія 644-713

**Функція:** `initBenefitsForm(benefits)`

```javascript
function initBenefitsForm(benefits) {
  const container = document.getElementById('benefitsContainer');

  container.innerHTML = benefits.map((benefit, index) => `
    <div style="border: 1px solid #ddd; ...">
      <input
        type="checkbox"
        id="benefit-enabled-${benefit.id}"
        class="benefit-enabled"
        data-id="${benefit.id}"
        ${benefit.enabled ? 'checked' : ''}
      />
      <input
        type="text"
        class="benefit-title"
        data-id="${benefit.id}"
        value="${benefit.title}"          ← ЗНАЧЕННЯ З КОНФІГУ
      />
      <textarea
        class="benefit-description"
        data-id="${benefit.id}"
      >${benefit.description}</textarea>  ← ЗНАЧЕННЯ З КОНФІГУ
    </div>
  `).join('');
}
```

**Де викликається:** `js/form.js` лінія ~1468 (в loadSavedValues)

---

## КРОК 3: Збір даних при Preview (js/form.js)

**Файл:** `js/form.js` лінія 1735-1851

**Функція:** `getFormParams()`

```javascript
function getFormParams() {
  // Лінія 1772-1802: Збір даних переваг з форми
  const benefits = [];

  document.querySelectorAll('.benefit-enabled').forEach(checkbox => {
    const id = String(checkbox.dataset.id);
    const enabled = checkbox.checked ? 'on' : 'off';
    const titleEl = document.querySelector(`.benefit-title[data-id="${id}"]`);
    const descEl = document.querySelector(`.benefit-description[data-id="${id}"]`);

    if (titleEl && descEl) {
      benefits.push({
        id: parseInt(id),
        enabled,
        title: titleEl.value,        ← ВЗЯЛИ ЗНАЧЕННЯ З INPUT
        description: descEl.value     ← ВЗЯЛИ ЗНАЧЕННЯ З TEXTAREA
      });
    }
  });

  // Лінія 1806-1851: Створення URLSearchParams
  const params = new URLSearchParams({
    headerText: headerText,
    heroTitle: heroTitle,
    // ...
    benefits: JSON.stringify(benefits),  ← ⚠️ КОНВЕРТУЄМО В STRING
    // ...
  });

  return params.toString();
}
```

**Приклад:**
```
benefits=[{"id":1,"enabled":"on","title":"Безкоштовна доставка","description":"Ми пропонуємо..."}]
```

---

## КРОК 4: Відправка POST запиту (js/form.js)

**Файл:** `js/form.js` лінія 1984-2038

**Функція:** `previewSite()`

```javascript
function previewSite() {
  const paramsString = getFormParams();  // Отримали URL params
  const params = new URLSearchParams(paramsString);

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/generate';  ← ENDPOINT
  form.target = '_blank';

  // Лінія 2017-2024: Додаємо hidden inputs
  for (const [key, value] of params) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;  ← benefits тут це STRING, а не масив!
    form.appendChild(input);
  }

  form.submit();  ← ВІДПРАВИЛИ
}
```

**Що відправляється:**
```
POST /generate
Content-Type: application/x-www-form-urlencoded

benefits=%5B%7B%22id%22%3A1%2C%22enabled%22%3A%22on%22%2C%22title%22%3A%22%D0%91%D0%B5%D0%B7%D0%BA%D0%BE%D1%88%D1%82%D0%BE%D0%B2%D0%BD%D0%B0+%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0%22...
```

---

## КРОК 5: ⚠️ ЩО Є РЕАЛЬНО - Server.js POST /generate

**Файл:** `server.js` лінія 1557-1578

**Функція:** `app.post('/generate')`

**РЕАЛЬНИЙ КОД:**
```javascript
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
```

**ЩО ВІДБУВАЄТЬСЯ:**
- `req.body.benefits` - це STRING (бо прийшов через URLSearchParams)
- НЕМАЄ `JSON.parse()` для benefits
- `mergedData.benefits` - залишається STRING
- Передається в `generateHTML()` як STRING

---

## КРОК 6: Генерація HTML (server.js)

**Файл:** `server.js` лінія 251-639

**Функція:** `generateHTML(dataObj, options = {})`

**РЕАЛЬНИЙ КОД (лінія 624-631):**
```javascript
// Замінити переваги (простій текстовий заміни плейсхолдерів)
if (options.benefits && Array.isArray(options.benefits)) {
  options.benefits.forEach((benefit) => {
    const num = benefit.id;
    html = html.replace(`{{benefit${num}Title}}`, benefit.title);
    html = html.replace(`{{benefit${num}Description}}`, benefit.description);
  });
}
```

**ЩО ВІДБУВАЄТЬСЯ:**
- Перевірка: `Array.isArray(options.benefits)`
- Якщо `options.benefits` це STRING → `Array.isArray()` повертає `false`
- Код всередині `if` НЕ виконується
- Плейсхолдери залишаються незамінені

---

## КРОК 7: Template з плейсхолдерами (views/template.ejs)

**Файл:** `views/template.ejs` лінія 175

```html
<span class="plus-list_descr text-l">
  <b>{{benefit1Title}}</b> <br>{{benefit1Description}}
</span>
```

**Результат:** Плейсхолдери залишаються незамінені, бо `options.benefits` був STRING!

---

## ЩО ВІДБУВАЄТЬСЯ РЕАЛЬНО

1. `js/form.js:1851` → `benefits: JSON.stringify(benefits)` - перетворюємо в STRING
2. `server.js:1559` → `req.body` містить `benefits` як STRING
3. `server.js:1563` → Мержимо без парсингу → `mergedData.benefits` це STRING
4. `server.js:625` → `Array.isArray(options.benefits)` повертає `false` для STRING
5. Код заміни НЕ виконується
6. Плейсхолдери `{{benefit1Title}}` залишаються незамінені в HTML

---

## ПОВНИЙ ШЛЯХ ДАНИХ

```
1. data/user-config.json (лінія 48-67)
   benefits: [{ id: 1, title: "Безкоштовна доставка", ... }]
   ↓

2. js/form.js loadSavedValues() (лінія ~1468)
   Завантажує JSON → викликає initBenefitsForm()
   ↓

3. js/form.js initBenefitsForm() (лінія 644-713)
   Створює <input class="benefit-title" value="Безкоштовна доставка">
   ↓

4. КОРИСТУВАЧ НАТИСКАЄ "👁️ ПЕРЕГЛЯД"
   ↓

5. js/form.js previewSite() (лінія 1984-2038)
   Викликає getFormParams()
   ↓

6. js/form.js getFormParams() (лінія 1772-1851)
   Збирає titleEl.value → benefits.push({ title: "Безкоштовна доставка" })
   Робить JSON.stringify(benefits)
   ↓

7. js/form.js previewSite() (лінія 2010-2030)
   POST /generate з benefits як STRING в body
   ↓

8. ⚠️ server.js POST /generate (лінія 1557-1578)
   req.body.benefits - це STRING!
   НЕ парситься → передається в generateHTML як STRING
   ↓

9. ⚠️ server.js generateHTML() (лінія 625)
   Array.isArray(options.benefits) === false
   Заміни НЕ відбуваються!
   ↓

10. views/template.ejs (лінія 175)
    {{benefit1Title}} залишається незамінений
```

---

## ВИСНОВОК

**Root Cause:** `POST /generate` НЕ парсить `benefits` з JSON string в масив.

**Місце проблеми:** `server.js:1557-1578` (endpoint POST /generate)
