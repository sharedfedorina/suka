// Тестовий скрипт для перевірки Netlify Function локально
require('dotenv').config(); // Завантажити .env файл

const handler = require('./netlify/functions/submit-order').handler;

// Імітуємо замовлення
const mockEvent = {
  httpMethod: 'POST',
  body: JSON.stringify({
    product_id: 'w.2.02',
    sku: 'w.2.02',
    product_name: 'Худі на флісі - Лаванда',
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
  console.log('Environment Variables:');
  console.log('  SALESDRIVE_ENDPOINT:', process.env.SALESDRIVE_ENDPOINT || '❌ НЕ НАЛАШТОВАНО');
  console.log('  SALESDRIVE_API_KEY:', process.env.SALESDRIVE_API_KEY ? '✅ Є' : '❌ НЕ НАЛАШТОВАНО');
  console.log('  SALESDRIVE_FUNNEL_ID:', process.env.SALESDRIVE_FUNNEL_ID || '❌ НЕ НАЛАШТОВАНО');
  console.log('\n📤 Відправка тестового замовлення...\n');

  try {
    const response = await handler(mockEvent);

    console.log('📊 Результат:');
    console.log('Status Code:', response.statusCode);
    console.log('Response Body:', JSON.parse(response.body));

    if (response.statusCode === 200) {
      console.log('\n✅ ТЕСТ ПРОЙДЕНО! Функція працює коректно.');
    } else {
      console.log('\n❌ ТЕСТ НЕ ПРОЙДЕНО! Перевір логи вище.');
    }
  } catch (error) {
    console.error('\n❌ ПОМИЛКА:', error.message);
    console.error(error);
  }
})();
