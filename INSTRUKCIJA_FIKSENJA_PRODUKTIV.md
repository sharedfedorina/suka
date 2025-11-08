# ІНСТРУКЦІЯ: ЯК ФІКСИТИ ПРОДУКТИ 1-5

## ПРОБЛЕМА
Продукти 2, 3, 4, 5 мають зламану верстку. Потрібно зробити всі продукти однаковими як Product 1.

## РІШЕННЯ

### КРОК 1: form.html - Зробити Product 3, 4, 5 як Product 1

**Product 1 має ЦІ поля (текстові inputs):**
```html
<label for="product1ColorHex">Hex:</label>
<input type="text" id="product1ColorHex" placeholder="#19161a" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 8px;" />

<label for="product1Size">Розміри:</label>
<input type="text" id="product1Size" placeholder="S, M, L..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 8px;" />
```

**Product 3 має старий код з color picker + checkboxes - ВИДАЛИТИ ЦЕ:**
```html
<label for="product3ColorHex">Hex (вибір кольору):</label>
<div style="display: flex; gap: 10px; margin-bottom: 8px; align-items: center;">
  <input type="color" id="product3ColorHex" value="#e2bcc9" style="width: 60px; height: 40px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;" />
  <input type="text" id="product3ColorHexDisplay" value="#e2bcc9" placeholder="#e2bcc9" style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
</div>

<label>Розміри (вибір розмірів):</label>
<div id="product3SizesCheckboxes" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 8px; padding: 10px; background: #f9f9f9; border-radius: 4px;">
  <!-- 12 checkboxes -->
</div>
```

**ЗАМІНИТИ на (копія з Product 1, але product3 замість product1):**
```html
<label for="product3ColorHex">Hex:</label>
<input type="text" id="product3ColorHex" placeholder="#e2bcc9" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 8px;" />

<label for="product3Size">Розміри:</label>
<input type="text" id="product3Size" placeholder="S, M, L..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 8px;" />
```

**Те ж саме для Product 4 та Product 5**

---

### КРОК 2: index.html - Виправити data-id атрибути

**Лінія ~340:** Product 1 - OK `data-id="product1"`

**Лінія ~396:** Product 2 - ЗМІНИТИ на `data-id="product2"` (не product3!)

**Лінія ~450:** Product 3 - OK `data-id="product3"`

**Лінія ~504:** Product 4 - OK `data-id="product4"`

**Лінія ~559:** Product 5 - OK `data-id="product5"`

**ВИДАЛИТИ зайві `</div>`:**
- На лінії 400 є зайвий `</div>` після Product 2 - це ламає макет
- Перевірити щоб div-и були закриті правильно

---

### КРОК 3: Перевірити server.js

**Функція `generateHTML()` повинна замінювати:**
```javascript
html = html.replace(/{{product3Color}}/g, formData.product3Color);
html = html.replace(/{{product3ColorHex}}/g, formData.product3ColorHex);
html = html.replace(/{{product3Size}}/g, formData.product3Size);
html = html.replace(/{{product3Material}}/g, formData.product3Material);
html = html.replace(/{{product3PriceOld}}/g, formData.product3PriceOld);
html = html.replace(/{{product3Price}}/g, formData.product3Price);
html = html.replace(/{{product3Slides}}/g, productSlidesHTML[2]); // product3 = індекс 2
```

Те ж саме для всіх інших продуктів.

---

## ВАЖНО!

1. **Product 1 залишити AS IS** - він нормально працює!
2. **Копіювати ТІЛЬКИ текстові inputs** для Color та Size (без color picker, без checkboxes)
3. **Замінювати product номери** в ID атрибутах, placeholder текстах, но не в placeholder значеннях
4. **Видалити всі зайві `</div>`** які ламають структуру
5. **Перевірити що {{productNSlides}} замінюються** на реальні HTML слайдів

---

## ЛОГІКА

Архітектура:
- **form.html** - конструктор форми (збирає дані користувача)
- **form.js** - обробляє дані з форми
- **server.js** - генерує HTML лендінгу, замінюючи {{placeholders}} на реальні значення
- **index.html** - шаблон лендінгу з {{placeholders}}

**Цикл:**
1. Користувач заповнює форму в form.html
2. form.js збирає дані в JavaScript об'єкт
3. Дані відправляються на server.js
4. server.js замінює {{placeholders}} в index.html на реальні значення з форми
5. Результат - готовий HTML лендінг

**Все 5 продуктів обробляються ОДНАКОВО** - тільки числа змінюються (product1, product2, product3, product4, product5).

---

## GIT ОТКАТ

Щоб відкотити все:
```bash
git reset --hard HEAD~1
```

Це видалить останній коміт і повернеться до попередньої версії.
