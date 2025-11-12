# 🔌 Технічна інструкція: Імплементація Salesdrive CRM + Meta Pixel

**Для розробників/агентів** | **Version:** 1.0 | **Date:** 2025-11-12

---

## 📋 Що потрібно реалізувати

Ця інструкція описує як імплементувати інтеграції Salesdrive CRM та Meta Pixel у веб-проект (лендінг, інтернет-магазин, тощо).

**Референс проект:** Landing Constructor (поточний проект)

---

## 🎯 КРОК 1: Додати поля в форму для налаштувань

### 1.1 Salesdrive CRM поля

У формі адміністратора/конструктора додайте такі поля:

```javascript
// Приклад React state або form data
const [formData, setFormData] = useState({
  // ... інші поля

  // Salesdrive CRM
  salesdriveApiKey: '',        // Bearer token для API
  salesdriveEndpoint: '',      // URL endpoint (https://api.salesdrive.me/v1/orders)
  salesdriveFunnelId: '',      // ID воронки продажів

  // Для замовлень
  productId: '',               // ID товару в системі
  sku: '',                     // SKU товару
  website: ''                  // Домен сайту
});
```

### 1.2 Meta Pixel поля

```javascript
const [formData, setFormData] = useState({
  // ... інші поля

  // Meta Pixel
  metaPixelId: '',             // 16-значний ID пікселя
  metaAccessToken: '',         // (опціонально) для Server Events API
  metaTestEventCode: ''        // (опціонально) для тестування
});
```

### 1.3 Приклад UI (React/HTML)

```jsx
{/* Salesdrive CRM секція */}
<section>
  <h3>🔗 CRM інтеграція (Salesdrive)</h3>

  <label>
    API Key:
    <input
      type="text"
      value={formData.salesdriveApiKey}
      onChange={(e) => setFormData({...formData, salesdriveApiKey: e.target.value})}
      placeholder="sd_live_abc123..."
    />
  </label>

  <label>
    API Endpoint:
    <input
      type="url"
      value={formData.salesdriveEndpoint}
      onChange={(e) => setFormData({...formData, salesdriveEndpoint: e.target.value})}
      placeholder="https://api.salesdrive.me/v1/orders"
    />
  </label>

  <label>
    Funnel ID:
    <input
      type="text"
      value={formData.salesdriveFunnelId}
      onChange={(e) => setFormData({...formData, salesdriveFunnelId: e.target.value})}
      placeholder="42"
    />
  </label>
</section>

{/* Meta Pixel секція */}
<section>
  <h3>📊 Meta Pixel (Facebook Analytics)</h3>

  <label>
    Pixel ID:
    <input
      type="text"
      value={formData.metaPixelId}
      onChange={(e) => setFormData({...formData, metaPixelId: e.target.value})}
      placeholder="1234567890123456"
      maxLength="16"
    />
  </label>

  <label>
    Test Event Code (опціонально):
    <input
      type="text"
      value={formData.metaTestEventCode}
      onChange={(e) => setFormData({...formData, metaTestEventCode: e.target.value})}
      placeholder="TEST12345"
    />
  </label>
</section>
```

---

## 🎯 КРОК 2: Meta Pixel - Додати код в HTML

### 2.1 Базовий код пікселя

У `<head>` секції HTML (або в шаблоні) додайте:

```html
<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', '{{metaPixelId}}'); // Замінити на реальний ID
  fbq('track', 'PageView');
</script>

<noscript>
  <img height="1" width="1" style="display:none"
       src="https://www.facebook.com/tr?id={{metaPixelId}}&ev=PageView&noscript=1" />
</noscript>
<!-- End Meta Pixel Code -->
```

### 2.2 Якщо генеруєте HTML програмно

```javascript
// Приклад: генератор HTML (Node.js / JavaScript)
function generateHTML(data) {
  const { metaPixelId } = data;

  const metaPixelScript = metaPixelId ? `
    <!-- Meta Pixel -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${metaPixelId}');
      fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1" /></noscript>
  ` : '';

  return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>Landing Page</title>
  ${metaPixelScript}
</head>
<body>
  <!-- Контент -->
</body>
</html>`;
}
```

---

## 🎯 КРОК 3: Meta Pixel Events - JavaScript

### 3.1 Створити файл `tracking.js`

```javascript
// tracking.js - Meta Pixel Events Handler

// ВАЖЛИВО: fbq вже ініціалізовано в HTML <head>

// ========== EVENT 1: PageView (вже є в <head>) ==========
// fbq('track', 'PageView');

// ========== EVENT 2: ViewContent - перегляд товарів ==========
function trackViewContent(products) {
  if (!window.fbq) return;

  fbq('track', 'ViewContent', {
    content_ids: products.map(p => p.id),           // ['PRODUCT-001', 'PRODUCT-002']
    content_name: 'Product Catalog',                // Назва групи
    content_type: 'product_group',                  // Тип контенту
    value: Math.min(...products.map(p => p.price)), // Мінімальна ціна
    currency: 'UAH'                                 // Валюта
  });
}

// Викликати при завантаженні сторінки з товарами
document.addEventListener('DOMContentLoaded', function() {
  const products = [
    { id: 'PRODUCT-001', name: 'Товар 1', price: 890 },
    { id: 'PRODUCT-002', name: 'Товар 2', price: 1200 }
  ];

  trackViewContent(products);
});

// ========== EVENT 3: InitiateCheckout - клік на "Замовити" ==========
function trackInitiateCheckout(product) {
  if (!window.fbq) return;

  fbq('track', 'InitiateCheckout', {
    content_name: product.name,      // Назва товару
    content_ids: [product.id],       // ID товару
    value: product.price,            // Ціна
    currency: 'UAH'
  });
}

// Додати до кнопки "Замовити"
document.querySelectorAll('.btn-order').forEach(btn => {
  btn.addEventListener('click', function() {
    const productData = {
      id: this.dataset.productId || 'PRODUCT-001',
      name: this.dataset.productName || 'Товар',
      price: parseFloat(this.dataset.price) || 0
    };

    trackInitiateCheckout(productData);
  });
});

// ========== EVENT 4: Purchase - успішне замовлення ==========
function trackPurchase(orderData) {
  if (!window.fbq) return;

  fbq('track', 'Purchase', {
    value: orderData.total,           // Загальна сума
    currency: 'UAH',
    content_name: orderData.productName,
    content_ids: [orderData.productId],
    num_items: orderData.quantity     // Кількість товарів
  });
}

// Викликати ПІСЛЯ успішної відправки в CRM
// trackPurchase({ total: 890, productName: 'Товар', productId: 'PRODUCT-001', quantity: 1 });

// ========== EVENT 5: Subscribe - підписка на розсилку ==========
function trackSubscribe() {
  if (!window.fbq) return;

  fbq('track', 'Subscribe', {
    content_name: 'Newsletter',
    currency: 'UAH'
  });
}

// Додати до форми підписки
document.querySelector('form.newsletter')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;

  if (email) {
    trackSubscribe();
    // ... відправка email на сервер
  }
});

// ========== EVENT 6: Lead - заповнення форми ==========
function trackLead(leadData) {
  if (!window.fbq) return;

  fbq('track', 'Lead', {
    content_name: leadData.formName || 'Contact Form',
    content_category: 'lead_generation',
    currency: 'UAH'
  });
}

// Експортувати функції (якщо використовуєте модулі)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    trackViewContent,
    trackInitiateCheckout,
    trackPurchase,
    trackSubscribe,
    trackLead
  };
}
```

### 3.2 Підключити в HTML

```html
<body>
  <!-- Контент -->

  <!-- Meta Pixel Events -->
  <script src="js/tracking.js"></script>
</body>
```

---

## 🎯 КРОК 4: Salesdrive CRM - Відправка замовлень

### 4.1 Створити файл `crm.js`

```javascript
// crm.js - Salesdrive CRM Integration

// Конфігурація (отримати з форми налаштувань)
const CRM_CONFIG = {
  apiKey: '{{salesdriveApiKey}}',           // Bearer token
  endpoint: '{{salesdriveEndpoint}}',       // https://api.salesdrive.me/v1/orders
  funnelId: '{{salesdriveFunnelId}}',       // ID воронки
  enabled: '{{salesdriveEndpoint}}' !== ''  // Чи налаштовано CRM
};

// Функція відправки замовлення в Salesdrive
async function sendToSalesdrive(orderData) {
  // Перевірка чи налаштовано CRM
  if (!CRM_CONFIG.enabled || !CRM_CONFIG.apiKey) {
    console.warn('Salesdrive CRM не налаштовано. Зберігаємо локально.');
    saveOrderToLocalStorage(orderData);
    return { success: false, local: true };
  }

  // Підготовка payload
  const payload = {
    funnel_id: CRM_CONFIG.funnelId,
    customer: {
      phone: orderData.phone || '+380',
      first_name: orderData.firstName || 'Customer',
      last_name: orderData.lastName || '',
      email: orderData.email || 'contact@example.com'
    },
    products: [{
      id: orderData.productId,
      sku: orderData.sku || '',
      name: orderData.productName,
      price: orderData.price,
      quantity: orderData.quantity || 1
    }],
    // UTM параметри (автоматично з URL)
    utm_source: getURLParam('utm_source') || 'direct',
    utm_medium: getURLParam('utm_medium') || 'organic',
    utm_campaign: getURLParam('utm_campaign') || 'landing',
    utm_content: getURLParam('utm_content') || '',
    utm_term: getURLParam('utm_term') || '',
    // Додаткові дані
    notes: orderData.notes || '',
    custom_fields: orderData.customFields || {}
  };

  try {
    // Відправка POST запиту
    const response = await fetch(CRM_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CRM_CONFIG.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Замовлення відправлено в Salesdrive:', data);

    // ВАЖЛИВО: Тільки тепер трекаємо Purchase в Meta Pixel
    if (window.fbq && typeof trackPurchase === 'function') {
      trackPurchase({
        total: orderData.price * (orderData.quantity || 1),
        productName: orderData.productName,
        productId: orderData.productId,
        quantity: orderData.quantity || 1
      });
    }

    return { success: true, data };

  } catch (error) {
    console.error('❌ Помилка відправки в Salesdrive:', error);

    // Fallback: зберегти локально
    saveOrderToLocalStorage({
      ...orderData,
      error: error.message,
      timestamp: new Date().toISOString()
    });

    return { success: false, error: error.message };
  }
}

// Допоміжна функція: отримати UTM параметр з URL
function getURLParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || '';
}

// Fallback: зберегти замовлення локально (якщо API недоступний)
function saveOrderToLocalStorage(orderData) {
  const orders = JSON.parse(localStorage.getItem('orders_failed') || '[]');
  orders.push({
    ...orderData,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('orders_failed', JSON.stringify(orders));
  console.log('💾 Замовлення збережено локально (fallback)');
}

// Експорт
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { sendToSalesdrive };
}
```

### 4.2 Обробка форми замовлення

```javascript
// order-form.js - Обробник форми замовлення

document.querySelector('form#order-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();

  // Збір даних з форми
  const formData = new FormData(this);
  const orderData = {
    productId: formData.get('product_id') || 'PRODUCT-001',
    sku: formData.get('sku') || 'SKU-001',
    productName: formData.get('product_name') || 'Товар',
    price: parseFloat(formData.get('price')) || 0,
    quantity: parseInt(formData.get('quantity')) || 1,

    // Дані клієнта
    firstName: formData.get('first_name') || '',
    lastName: formData.get('last_name') || '',
    phone: formData.get('phone') || '',
    email: formData.get('email') || '',

    // Додатково
    notes: formData.get('notes') || '',
    customFields: {
      delivery_method: formData.get('delivery') || 'nova_poshta',
      payment_method: formData.get('payment') || 'cash_on_delivery'
    }
  };

  // 1. Трекаємо InitiateCheckout
  if (typeof trackInitiateCheckout === 'function') {
    trackInitiateCheckout({
      id: orderData.productId,
      name: orderData.productName,
      price: orderData.price
    });
  }

  // 2. Відправити в Salesdrive CRM
  const result = await sendToSalesdrive(orderData);

  // 3. Показати результат користувачу
  if (result.success) {
    alert('✅ Дякуємо за замовлення! Ми зв\'яжемось з вами найближчим часом.');
    this.reset(); // Очистити форму
  } else {
    alert('⚠️ Виникла помилка. Ваше замовлення збережено, ми обробимо його вручну.');
  }
});
```

### 4.3 HTML форма замовлення (приклад)

```html
<form id="order-form">
  <input type="hidden" name="product_id" value="PRODUCT-001">
  <input type="hidden" name="sku" value="SKU-001">
  <input type="hidden" name="product_name" value="Світшот Чорний">
  <input type="hidden" name="price" value="890">

  <label>
    Ім'я:
    <input type="text" name="first_name" required>
  </label>

  <label>
    Телефон:
    <input type="tel" name="phone" required placeholder="+380">
  </label>

  <label>
    Email:
    <input type="email" name="email">
  </label>

  <label>
    Кількість:
    <input type="number" name="quantity" value="1" min="1">
  </label>

  <label>
    Спосіб доставки:
    <select name="delivery">
      <option value="nova_poshta">Нова Пошта</option>
      <option value="ukrposhta">Укрпошта</option>
      <option value="courier">Кур'єр</option>
    </select>
  </label>

  <button type="submit">Замовити</button>
</form>
```

---

## 🎯 КРОК 5: Структура файлів проекту

Після імплементації структура має бути така:

```
project/
├── index.html                 # Meta Pixel код в <head>
├── css/
│   └── style.css
├── js/
│   ├── tracking.js           # Meta Pixel Events
│   ├── crm.js                # Salesdrive CRM
│   └── order-form.js         # Обробка форми
└── README.md
```

### Підключення скриптів в HTML

```html
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>Landing Page</title>
  <link rel="stylesheet" href="css/style.css">

  <!-- Meta Pixel -->
  <script>
    !function(f,b,e,v,n,t,s){...}(window, document,'script',...);
    fbq('init', '1234567890123456'); // Замінити на реальний ID
    fbq('track', 'PageView');
  </script>
</head>
<body>
  <!-- Контент -->

  <!-- Scripts -->
  <script src="js/tracking.js"></script>
  <script src="js/crm.js"></script>
  <script src="js/order-form.js"></script>
</body>
</html>
```

---

## 🎯 КРОК 6: Налаштування змінних

### 6.1 Якщо використовуєте шаблонізатор

Замініть плейсхолдери на реальні значення:

```javascript
// Приклад: Node.js template engine (EJS, Handlebars, Pug)
const config = {
  metaPixelId: formData.metaPixelId || '',
  salesdriveApiKey: formData.salesdriveApiKey || '',
  salesdriveEndpoint: formData.salesdriveEndpoint || '',
  salesdriveFunnelId: formData.salesdriveFunnelId || ''
};

// Генерація HTML
const html = template(config);
```

### 6.2 Якщо статичний сайт

Просто замініть плейсхолдери на реальні значення:

```javascript
// В tracking.js та crm.js
const CRM_CONFIG = {
  apiKey: 'sd_live_abc123def456ghi789',           // ← Вставити реальний ключ
  endpoint: 'https://api.salesdrive.me/v1/orders',
  funnelId: '42'
};
```

```html
<!-- В index.html -->
<script>
  fbq('init', '1234567890123456'); <!-- ← Вставити реальний Pixel ID -->
</script>
```

---

## 🎯 КРОК 7: Тестування

### 7.1 Перевірка Meta Pixel

```bash
# 1. Встановити Facebook Pixel Helper (Chrome Extension)
# https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc

# 2. Відкрити сайт
# 3. Клікнути на іконку розширення
# 4. Перевірити чи є:
#    ✅ PageView event
#    ✅ ViewContent event
#    ✅ InitiateCheckout event (після кліку на "Замовити")
```

### 7.2 Перевірка Salesdrive

```javascript
// У браузері DevTools → Console
console.log(CRM_CONFIG);
// Має показати: { apiKey: "sd_...", endpoint: "https://...", ... }

// Перевірити чи функція існує
typeof sendToSalesdrive
// Має повернути: "function"

// DevTools → Network → Фільтр "Fetch/XHR"
// Натиснути "Замовити" і перевірити запит до api.salesdrive.me
```

### 7.3 Test Events (Meta)

```bash
# 1. Зайти в Facebook Events Manager
# 2. Вибрати піксель → Test Events
# 3. Додати Test Event Code у форму налаштувань
# 4. Відкрити сайт
# 5. Побачити всі події в реальному часі
```

---

## 📚 ПРИКЛАД: Повний workflow

### Сценарій: Користувач купує товар

```
1. Користувач відкриває лендінг
   → fbq('track', 'PageView') ✅

2. Скрипт tracking.js виконується
   → trackViewContent([...products])
   → fbq('track', 'ViewContent', {...}) ✅

3. Користувач заповнює форму і натискає "Замовити"
   → trackInitiateCheckout({...})
   → fbq('track', 'InitiateCheckout', {...}) ✅

4. order-form.js обробляє форму
   → sendToSalesdrive({...})
   → POST запит до https://api.salesdrive.me/v1/orders

5a. Якщо Salesdrive відповів успішно (200 OK)
    → trackPurchase({...})
    → fbq('track', 'Purchase', {...}) ✅
    → alert('Дякуємо за замовлення!')

5b. Якщо Salesdrive недоступний (помилка)
    → saveOrderToLocalStorage({...})
    → alert('Помилка, але замовлення збережено')
    → Purchase event НЕ спрацьовує ❌
```

---

## ✅ Чеклист для агента/розробника

### Перед початком роботи

- [ ] Отримати від клієнта:
  - [ ] Salesdrive API Key
  - [ ] Salesdrive API Endpoint
  - [ ] Salesdrive Funnel ID
  - [ ] Meta Pixel ID
- [ ] Визначити де зберігати ці дані (форма, .env, config файл)

### Імплементація

- [ ] **КРОК 1:** Додати поля в форму налаштувань
- [ ] **КРОК 2:** Додати Meta Pixel код в HTML `<head>`
- [ ] **КРОК 3:** Створити `tracking.js` з Meta Events
- [ ] **КРОК 4:** Створити `crm.js` з Salesdrive інтеграцією
- [ ] **КРОК 5:** Додати обробник форми замовлення
- [ ] **КРОК 6:** Замінити плейсхолдери на реальні значення

### Тестування

- [ ] Перевірити Meta Pixel через Facebook Pixel Helper
- [ ] Перевірити Salesdrive через DevTools Network
- [ ] Зробити тестове замовлення
- [ ] Перевірити чи замовлення з'явилось в Salesdrive Dashboard
- [ ] Перевірити чи Purchase event спрацював в Meta Events Manager
- [ ] Перевірити fallback режим (відключити Salesdrive і перевірити localStorage)

---

## 📝 Важливі примітки

### ⚠️ CORS помилки

Якщо браузер блокує запити до Salesdrive:
```
Access to fetch at 'https://api.salesdrive.me/...' has been blocked by CORS policy
```

**Рішення:**
1. Зверніться до Salesdrive Support для додавання вашого домену в whitelist
2. Або використовуйте проксі-сервер (backend API)

### ⚠️ Purchase event спрацьовує ЛИШЕ після успішного CRM

```javascript
// ❌ НЕПРАВИЛЬНО
fbq('track', 'Purchase', {...});
await sendToSalesdrive({...});

// ✅ ПРАВИЛЬНО
const result = await sendToSalesdrive({...});
if (result.success) {
  fbq('track', 'Purchase', {...});
}
```

### ⚠️ UTM параметри

Salesdrive автоматично отримує UTM мітки з URL:
```
https://example.com?utm_source=instagram&utm_campaign=winter_sale
```

Переконайтеся що функція `getURLParam()` працює правильно.

### ⚠️ Безпека API ключів

- НЕ коммітьте API ключі в Git
- Використовуйте `.env` файли або змінні середовища
- Або зберігайте в базі даних на backend

---

## 🔗 Корисні посилання

- [Salesdrive API Documentation](https://docs.salesdrive.me)
- [Meta Pixel Developer Guide](https://developers.facebook.com/docs/meta-pixel)
- [Facebook Events Manager](https://business.facebook.com/events_manager2)
- [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)

---

**Кінець інструкції** | Якщо є питання - дивись референс код у `landing-constructor/src/templates/`
