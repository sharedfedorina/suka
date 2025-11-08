let uploadedHeroImageFilename = '';
let imageUrlValue = '';

// Product values tracking
let product1Data = { name: '', color: '', colorHex: '', size: '', material: '', priceOld: '', price: '' };
let product2Data = { name: '', color: '', colorHex: '', size: '', material: '', priceOld: '', price: '' };
let product3Data = { name: '', color: '', colorHex: '', size: '', material: '', priceOld: '', price: '' };
let product4Data = { name: '', color: '', colorHex: '', size: '', material: '', priceOld: '', price: '' };
let product5Data = { name: '', color: '', colorHex: '', size: '', material: '', priceOld: '', price: '' };

// ========== ІНІЦІАЛІЗАЦІЯ ФОРМИ ==========

function initBenefitsForm(benefits) {
  const container = document.getElementById('benefitsContainer');
  if (!container) return;

  container.innerHTML = benefits.map((benefit, index) => `
    <div style="border: 1px solid #ddd; padding: 12px; margin-bottom: 12px; border-radius: 6px; background: #f9f9f9;">
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <input
          type="checkbox"
          id="benefit-enabled-${benefit.id}"
          class="benefit-enabled"
          data-id="${benefit.id}"
          ${benefit.enabled ? 'checked' : ''}
          style="width: 20px; height: 20px; cursor: pointer; margin-right: 10px;"
        />
        <label for="benefit-enabled-${benefit.id}" style="cursor: pointer; flex: 1; margin: 0;">Показувати перевагу ${benefit.id}</label>
      </div>
      <div style="margin-left: 30px;">
        <input
          type="text"
          class="benefit-title"
          data-id="${benefit.id}"
          placeholder="Назва переваги"
          value="${benefit.title}"
          style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #ccc; border-radius: 4px; font-weight: bold;"
        />
        <textarea
          class="benefit-description"
          data-id="${benefit.id}"
          placeholder="Опис переваги"
          style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: 'Segoe UI', Arial, sans-serif; min-height: 60px;"
        >${benefit.description}</textarea>
      </div>
    </div>
  `).join('');
}

// Ініціалізуємо форму при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
  // Спочатку завантажуємо оригінальні значення
  fetch('/api/original-form-data')
    .then(res => res.json())
    .then(data => {
      console.log('📥 Отримані оригінальні дані:', data);

      // Заповнити всі поля форми
      if (data.headerText) document.getElementById('headerText').value = data.headerText;
      if (data.heroTitle) document.getElementById('heroTitle').value = data.heroTitle;
      if (data.heroPrice) document.getElementById('heroPrice').value = data.heroPrice;
      if (data.enableTimer !== undefined) document.getElementById('enableTimer').checked = data.enableTimer;
      if (data.enableStock !== undefined) document.getElementById('enableStock').checked = data.enableStock;
      if (data.heroImage) {
        uploadedHeroImageFilename = data.heroImage;
        showImagePreview(data.heroImage);
      }
      if (data.enableImage !== undefined) document.getElementById('enableImage').checked = data.enableImage;
      if (data.imageUrl) {
        imageUrlValue = data.imageUrl;
      }

      // Завантажити дані 5 продуктів
      for (let i = 1; i <= 5; i++) {
        if (data[`enableProduct${i}`] !== undefined) document.getElementById(`enableProduct${i}`).checked = data[`enableProduct${i}`];
        if (data[`product${i}Name`]) document.getElementById(`product${i}Name`).value = data[`product${i}Name`];
        if (data[`product${i}Color`]) document.getElementById(`product${i}Color`).value = data[`product${i}Color`];
        if (data[`product${i}ColorHex`]) document.getElementById(`product${i}ColorHex`).value = data[`product${i}ColorHex`];
        if (data[`product${i}Size`]) document.getElementById(`product${i}Size`).value = data[`product${i}Size`];
        if (data[`product${i}Material`]) document.getElementById(`product${i}Material`).value = data[`product${i}Material`];
        if (data[`product${i}PriceOld`]) document.getElementById(`product${i}PriceOld`).value = data[`product${i}PriceOld`];
        if (data[`product${i}Price`]) document.getElementById(`product${i}Price`).value = data[`product${i}Price`];
      }

      // Ініціалізувати форму переваг
      if (data.benefits && Array.isArray(data.benefits) && data.benefits.length > 0) {
        initBenefitsForm(data.benefits);
      }
    })
    .catch(err => console.error('❌ Помилка при завантаженні оригіналу:', err));
});

// ========== ФУНКЦІЇ ДЛЯ ТРЬОХ КНОПОК ==========

// Функція для збереження конфігурації на сервер
async function saveFormToServer() {
  // Зібрати дані переваг
  const benefits = [];
  document.querySelectorAll('.benefit-enabled').forEach(checkbox => {
    const id = String(checkbox.dataset.id);
    const enabled = checkbox.checked;
    const titleEl = document.querySelector(`.benefit-title[data-id="${id}"]`);
    const descEl = document.querySelector(`.benefit-description[data-id="${id}"]`);

    if (titleEl && descEl) {
      benefits.push({
        id: parseInt(id),
        enabled,
        title: titleEl.value,
        description: descEl.value
      });
    }
  });

  console.log('💾 Дані для збереження:', benefits);

  const formData = {
    headerText: document.getElementById('headerText').value,
    heroTitle: document.getElementById('heroTitle').value,
    heroPrice: document.getElementById('heroPrice').value,
    enableTimer: document.getElementById('enableTimer').checked,
    enableStock: document.getElementById('enableStock').checked,
    heroImage: uploadedHeroImageFilename,
    enableImage: document.getElementById('enableImage').checked,
    imageUrl: imageUrlValue,
    benefits: benefits,
    // Product data
    product1Name: document.getElementById('product1Name').value,
    product1Color: document.getElementById('product1Color').value,
    product1ColorHex: document.getElementById('product1ColorHex').value,
    product1Size: document.getElementById('product1Size').value,
    product1Material: document.getElementById('product1Material').value,
    product1PriceOld: document.getElementById('product1PriceOld').value,
    product1Price: document.getElementById('product1Price').value,
    enableProduct1: document.getElementById('enableProduct1').checked,
    product2Name: document.getElementById('product2Name').value,
    product2Color: document.getElementById('product2Color').value,
    product2ColorHex: document.getElementById('product2ColorHex').value,
    product2Size: document.getElementById('product2Size').value,
    product2Material: document.getElementById('product2Material').value,
    product2PriceOld: document.getElementById('product2PriceOld').value,
    product2Price: document.getElementById('product2Price').value,
    enableProduct2: document.getElementById('enableProduct2').checked,
    product3Name: document.getElementById('product3Name').value,
    product3Color: document.getElementById('product3Color').value,
    product3ColorHex: document.getElementById('product3ColorHex').value,
    product3Size: document.getElementById('product3Size').value,
    product3Material: document.getElementById('product3Material').value,
    product3PriceOld: document.getElementById('product3PriceOld').value,
    product3Price: document.getElementById('product3Price').value,
    enableProduct3: document.getElementById('enableProduct3').checked,
    product4Name: document.getElementById('product4Name').value,
    product4Color: document.getElementById('product4Color').value,
    product4ColorHex: document.getElementById('product4ColorHex').value,
    product4Size: document.getElementById('product4Size').value,
    product4Material: document.getElementById('product4Material').value,
    product4PriceOld: document.getElementById('product4PriceOld').value,
    product4Price: document.getElementById('product4Price').value,
    enableProduct4: document.getElementById('enableProduct4').checked,
    product5Name: document.getElementById('product5Name').value,
    product5Color: document.getElementById('product5Color').value,
    product5ColorHex: document.getElementById('product5ColorHex').value,
    product5Size: document.getElementById('product5Size').value,
    product5Material: document.getElementById('product5Material').value,
    product5PriceOld: document.getElementById('product5PriceOld').value,
    product5Price: document.getElementById('product5Price').value,
    enableProduct5: document.getElementById('enableProduct5').checked
  };

  try {
    const response = await fetch('/api/save-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error('Помилка при збереженні');

    const result = await response.json();
    alert('✅ Дані збережені на сервері!');
    console.log('✅ Конфігурація збережена:', formData);
  } catch (error) {
    alert('❌ Помилка при збереженні: ' + error.message);
  }
}

// Функція для завантаження оригінальних значень з сервера
async function loadOriginalValues() {
  try {
    const response = await fetch('/api/original-form-data');
    if (!response.ok) throw new Error('Помилка при завантаженні');

    const formData = await response.json();
    document.getElementById('headerText').value = formData.headerText;
    document.getElementById('heroTitle').value = formData.heroTitle;
    document.getElementById('heroPrice').value = formData.heroPrice || 'від 330 грн';
    document.getElementById('enableTimer').checked = formData.enableTimer;
    document.getElementById('enableStock').checked = formData.enableStock;
    uploadedHeroImageFilename = formData.heroImage;
    showImagePreview(formData.heroImage);

    // Завантажити переваги
    if (formData.benefits) {
      initBenefitsForm(formData.benefits);
    }

    console.log('🔄 Завантажені оригінальні значення');
    alert('✅ Завантажені оригінальні дані!');
  } catch (error) {
    alert('❌ Помилка при завантаженні оригіналу: ' + error.message);
  }
}

// Функція для завантаження збережених значень з сервера
async function loadSavedValues() {
  try {
    const response = await fetch('/api/get-user-config');
    if (!response.ok) throw new Error('Помилка при завантаженні');

    const formData = await response.json();

    // Перевіримо чи є збережені дані
    if (!formData.headerText && !formData.heroTitle && !formData.heroImage) {
      alert('⚠️ Немає збережених даних');
      return;
    }

    document.getElementById('headerText').value = formData.headerText;
    document.getElementById('heroTitle').value = formData.heroTitle;
    document.getElementById('heroPrice').value = formData.heroPrice || 'від 330 грн';
    document.getElementById('enableTimer').checked = formData.enableTimer;
    document.getElementById('enableStock').checked = formData.enableStock;
    uploadedHeroImageFilename = formData.heroImage;
    showImagePreview(formData.heroImage);
    document.getElementById('enableImage').checked = formData.enableImage;
    imageUrlValue = formData.imageUrl;
    if (formData.imageUrl) {
      document.getElementById('previewImageUpload').src = formData.imageUrl;
      document.getElementById('imageUploadPreview').style.display = 'block';
    }

    // Завантажити дані 5 продуктів
    for (let i = 1; i <= 5; i++) {
      document.getElementById(`enableProduct${i}`).checked = formData[`enableProduct${i}`];
      document.getElementById(`product${i}Name`).value = formData[`product${i}Name`] || '';
      document.getElementById(`product${i}Color`).value = formData[`product${i}Color`] || '';
      document.getElementById(`product${i}ColorHex`).value = formData[`product${i}ColorHex`] || '';
      document.getElementById(`product${i}Size`).value = formData[`product${i}Size`] || '';
      document.getElementById(`product${i}Material`).value = formData[`product${i}Material`] || '';
      document.getElementById(`product${i}PriceOld`).value = formData[`product${i}PriceOld`] || '';
      document.getElementById(`product${i}Price`).value = formData[`product${i}Price`] || '';
    }

    // Завантажити переваги
    if (formData.benefits) {
      initBenefitsForm(formData.benefits);
    }

    console.log('📂 Завантажені збережені значення:', formData);
    alert('✅ Завантажені ваші останні зміни!');
  } catch (error) {
    alert('❌ Помилка при завантаженні збережених даних: ' + error.message);
  }
}

// ========== ОБРОБКА ЗАВАНТАЖЕННЯ ФОТО ==========

// Показати/приховати прев'ю блок
function showImagePreview(imagePath) {
  console.log('showImagePreview викликана з:', imagePath);
  const previewDiv = document.getElementById('imagePreview');
  const previewImg = document.getElementById('previewImg');

  if (!imagePath) {
    previewDiv.style.display = 'none';
    return;
  }

  previewDiv.style.display = 'block';
  previewImg.src = imagePath;
  previewImg.alt = 'Прев\'ю';
  console.log('Прев\'ю показано:', imagePath);
}

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
    showImagePreview(uploadedHeroImageFilename);
    console.log('✅ Фото завантажено:', uploadedHeroImageFilename);
  } catch (error) {
    alert('❌ Помилка при завантаженні фото: ' + error.message);
    document.getElementById('heroImage').value = '';
    uploadedHeroImageFilename = '';
    showImagePreview('');
  }
});

// Обробка завантаження фото для plus-logo блоку
document.getElementById('imageUpload').addEventListener('change', async function(e) {
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
    imageUrlValue = result.filename;
    console.log('✅ Фото для plus-logo завантажено:', imageUrlValue);
  } catch (error) {
    alert('❌ Помилка при завантаженні фото: ' + error.message);
    document.getElementById('imageUpload').value = '';
    imageUrlValue = '';
  }
});

function getFormParams() {
  const headerText = document.getElementById('headerText').value;
  const heroTitle = document.getElementById('heroTitle').value;
  const heroPrice = document.getElementById('heroPrice').value;
  const enableTimer = document.getElementById('enableTimer').checked ? 'on' : 'off';
  const enableStock = document.getElementById('enableStock').checked ? 'on' : 'off';
  const heroImage = uploadedHeroImageFilename;
  const enableImage = document.getElementById('enableImage').checked ? 'on' : 'off';
  const imageUrl = imageUrlValue;

  // Зібрати дані переваг
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
        title: titleEl.value,
        description: descEl.value
      });
    }
  });

  const params = new URLSearchParams({
    headerText: headerText,
    heroTitle: heroTitle,
    heroPrice: heroPrice,
    enableTimer: enableTimer,
    enableStock: enableStock,
    heroImage: heroImage,
    enableImage: enableImage,
    imageUrl: imageUrl,
    benefits: JSON.stringify(benefits),
    // Product data
    product1Name: document.getElementById('product1Name').value,
    product1Color: document.getElementById('product1Color').value,
    product1ColorHex: document.getElementById('product1ColorHex').value,
    product1Size: document.getElementById('product1Size').value,
    product1Material: document.getElementById('product1Material').value,
    product1PriceOld: document.getElementById('product1PriceOld').value,
    product1Price: document.getElementById('product1Price').value,
    enableProduct1: document.getElementById('enableProduct1').checked ? 'on' : 'off',
    product2Name: document.getElementById('product2Name').value,
    product2Color: document.getElementById('product2Color').value,
    product2ColorHex: document.getElementById('product2ColorHex').value,
    product2Size: document.getElementById('product2Size').value,
    product2Material: document.getElementById('product2Material').value,
    product2PriceOld: document.getElementById('product2PriceOld').value,
    product2Price: document.getElementById('product2Price').value,
    enableProduct2: document.getElementById('enableProduct2').checked ? 'on' : 'off',
    product3Name: document.getElementById('product3Name').value,
    product3Color: document.getElementById('product3Color').value,
    product3ColorHex: document.getElementById('product3ColorHex').value,
    product3Size: document.getElementById('product3Size').value,
    product3Material: document.getElementById('product3Material').value,
    product3PriceOld: document.getElementById('product3PriceOld').value,
    product3Price: document.getElementById('product3Price').value,
    enableProduct3: document.getElementById('enableProduct3').checked ? 'on' : 'off',
    product4Name: document.getElementById('product4Name').value,
    product4Color: document.getElementById('product4Color').value,
    product4ColorHex: document.getElementById('product4ColorHex').value,
    product4Size: document.getElementById('product4Size').value,
    product4Material: document.getElementById('product4Material').value,
    product4PriceOld: document.getElementById('product4PriceOld').value,
    product4Price: document.getElementById('product4Price').value,
    enableProduct4: document.getElementById('enableProduct4').checked ? 'on' : 'off',
    product5Name: document.getElementById('product5Name').value,
    product5Color: document.getElementById('product5Color').value,
    product5ColorHex: document.getElementById('product5ColorHex').value,
    product5Size: document.getElementById('product5Size').value,
    product5Material: document.getElementById('product5Material').value,
    product5PriceOld: document.getElementById('product5PriceOld').value,
    product5Price: document.getElementById('product5Price').value,
    enableProduct5: document.getElementById('enableProduct5').checked ? 'on' : 'off'
  });

  return params.toString();
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
