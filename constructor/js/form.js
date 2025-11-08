let uploadedHeroImageFilename = '';
let imageUrlValue = '';

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
    benefits: benefits
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
  formData.append('imageUpload', file);

  try {
    const response = await fetch('/upload-image', {
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
    benefits: JSON.stringify(benefits)
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
