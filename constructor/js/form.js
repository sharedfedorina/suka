let uploadedHeroImageFilename = '';

// ========== ФУНКЦІЇ ДЛЯ ТРЬОХ КНОПОК ==========

// Функція для збереження конфігурації на сервер
async function saveFormToServer() {
  const formData = {
    headerText: document.getElementById('headerText').value,
    heroTitle: document.getElementById('heroTitle').value,
    enableTimer: document.getElementById('enableTimer').checked,
    enableStock: document.getElementById('enableStock').checked,
    heroImage: uploadedHeroImageFilename
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
    document.getElementById('enableTimer').checked = formData.enableTimer;
    document.getElementById('enableStock').checked = formData.enableStock;
    uploadedHeroImageFilename = formData.heroImage;
    showImagePreview(formData.heroImage);

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
    document.getElementById('enableTimer').checked = formData.enableTimer;
    document.getElementById('enableStock').checked = formData.enableStock;
    uploadedHeroImageFilename = formData.heroImage;
    showImagePreview(formData.heroImage);

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

function getFormParams() {
  const headerText = document.getElementById('headerText').value;
  const heroTitle = document.getElementById('heroTitle').value;
  const enableTimer = document.getElementById('enableTimer').checked ? 'on' : 'off';
  const enableStock = document.getElementById('enableStock').checked ? 'on' : 'off';
  const heroImage = uploadedHeroImageFilename;

  return new URLSearchParams({
    headerText: headerText,
    heroTitle: heroTitle,
    enableTimer: enableTimer,
    enableStock: enableStock,
    heroImage: heroImage
  }).toString();
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
