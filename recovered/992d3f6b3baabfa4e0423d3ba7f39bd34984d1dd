// Netlify Function для безпечної відправки замовлень в Salesdrive CRM
// API ключ зберігається в Environment Variables Netlify, НЕ в коді!

exports.handler = async (event, context) => {
  // Дозволяємо тільки POST запити
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Парсимо дані замовлення з body
    const orderData = JSON.parse(event.body);

    // Зчитуємо секретні ключі з Environment Variables (налаштовуються в Netlify Dashboard)
    const salesdriveEndpoint = process.env.SALESDRIVE_ENDPOINT;
    const salesdriveApiKey = process.env.SALESDRIVE_API_KEY;
    const salesdriveFunnelId = process.env.SALESDRIVE_FUNNEL_ID || '1';

    // Перевіряємо наявність конфігурації
    if (!salesdriveEndpoint || !salesdriveApiKey) {
      console.error('❌ Salesdrive not configured in environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: 'Salesdrive not configured'
        })
      };
    }

    // Формуємо payload для Salesdrive згідно з їх API форматом
    const payload = {
      getResultData: "1",
      products: [{
        id: orderData.product_id || "",
        name: orderData.product_name || "",
        costPerItem: orderData.price || "",
        amount: orderData.quantity || 1,
        sku: orderData.sku || "",
        description: ""
      }],
      fName: orderData.customer_name || "",
      lName: "",
      phone: orderData.customer_phone || "",
      email: orderData.customer_email || "",
      utmSource: orderData.utm_source || "",
      utmMedium: orderData.utm_medium || "",
      utmCampaign: orderData.utm_campaign || "",
      utmContent: orderData.utm_content || "",
      utmTerm: orderData.utm_term || "",
      utmPage: orderData.utm_page || ""
    };

    console.log('📤 Sending order to Salesdrive:', payload);

    // Відправляємо запит в Salesdrive (ТІЛЬКИ ТУТ використовується API ключ!)
    const response = await fetch(salesdriveEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': salesdriveApiKey
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Salesdrive API error:', result);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          success: false,
          error: result.message || 'Salesdrive API error'
        })
      };
    }

    console.log('✅ Order successfully sent to Salesdrive:', result);

    // Успішна відповідь
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: result
      })
    };

  } catch (error) {
    console.error('❌ Error processing order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
