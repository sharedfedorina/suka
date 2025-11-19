# Локальне тестування Netlify Function

## Спосіб 1: Використати npx (без встановлення CLI)

```bash
cd constructor
npx netlify-cli dev
```

Netlify CLI запустить локальний сервер на http://localhost:8888/
- Лендінг буде доступний на http://localhost:8888/
- Netlify Function буде доступна на http://localhost:8888/api/submit-order

## Спосіб 2: Тестування функції напряму через Node.js

Створити тестовий скрипт `test-function.js`:

```javascript
// test-function.js - локальний тест Netlify Function
const handler = require('./netlify/functions/submit-order').handler;

// Імітуємо замовлення
const mockEvent = {
  httpMethod: 'POST',
  body: JSON.stringify({
    product_id: 'w.2.02',
    sku: 'w.2.02',
    product_name: 'Худі на флісі',
    price: 610,
    quantity: 1,
    customer_name: 'Тест Користувач',
    customer_phone: '+380501234567',
    customer_email: 'test@example.com',
    utm_source: 'test',
    utm_medium: 'local',
    utm_campaign: 'testing'
  })
};

(async () => {
  console.log('🧪 Тестування Netlify Function локально...\n');

  const response = await handler(mockEvent);

  console.log('Status:', response.statusCode);
  console.log('Response:', JSON.parse(response.body));
})();
```

Запустити:

```bash
cd constructor
node test-function.js
```

## Спосіб 3: Тестування через curl

Якщо `netlify dev` працює:

```bash
curl -X POST http://localhost:8888/api/submit-order \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "w.2.02",
    "sku": "w.2.02",
    "product_name": "Худі на флісі",
    "price": 610,
    "quantity": 1,
    "customer_name": "Тест",
    "customer_phone": "+380501234567"
  }'
```

## Перевірка .env файлу

Переконайся, що `.env` файл містить правильні ключі:

```env
SALESDRIVE_ENDPOINT=https://example.salesdrive.me/handler/
SALESDRIVE_API_KEY=Ycxui0h7tqIgGn3EJi1AcBgUaTpnXSgpJ4U-...
SALESDRIVE_FUNNEL_ID=funnel_789
```

## Що має працювати:

1. Netlify Function читає ключі з `.env`
2. Відправляє замовлення в Salesdrive CRM
3. Повертає успішну відповідь `{success: true}`

## Якщо виникають помилки:

- Перевір логи у консолі
- Перевір правильність API ключа
- Перевір доступність Salesdrive endpoint
