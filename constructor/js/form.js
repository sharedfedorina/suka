let uploadedHeroImageFilename = '';

let imageUrlValue = '';

let videoUrlValue = '';

const DEFAULT_VIDEO_THUMBNAIL_DESKTOP = 'img/promo/promo-1.jpg';
const DEFAULT_VIDEO_THUMBNAIL_MOBILE = 'img/promo/promo-1_m.webp';

let videoThumbnailDesktopValue = DEFAULT_VIDEO_THUMBNAIL_DESKTOP;
let videoThumbnailMobileValue = DEFAULT_VIDEO_THUMBNAIL_MOBILE;

// Product values tracking

let product1Data = { name: '', color: '', colorHex: '', size: '', material: '', priceOld: '', price: '' };

let product2Data = { name: '', color: '', colorHex: '', size: '', material: '', priceOld: '', price: '' };

let product3Data = { name: '', color: '', colorHex: '', size: '', material: '', priceOld: '', price: '' };

let product4Data = { name: '', color: '', colorHex: '', size: '', material: '', priceOld: '', price: '' };

let product5Data = { name: '', color: '', colorHex: '', size: '', material: '', priceOld: '', price: '' };



// Product images tracking

let product1Images = [];

let product2Images = [];

let product3Images = [];

let product4Images = [];

let product5Images = [];



// ========== ФУНКЦІЇ ДЛЯ COLLAPSIBLE ПРОДУКТІВ ==========

function toggleProductCollapsible(productNum) {
  const content = document.getElementById(`productContent${productNum}`);
  const chevron = document.getElementById(`chevron${productNum}`);

  if (content.style.display === 'none' || content.style.display === '') {
    content.style.display = 'block';
    chevron.style.transform = 'rotate(180deg)';
  } else {
    content.style.display = 'none';
    chevron.style.transform = 'rotate(0deg)';
  }
}

// ========== ФУНКЦІЇ ДЛЯ КОЛЬОРОВОГО ВИБОРУ ==========

function syncColorPickerDisplay(productNum) {
  const colorInput = document.getElementById(`product${productNum}ColorHex`);
  const displayInput = document.getElementById(`product${productNum}ColorHexDisplay`);

  if (colorInput && displayInput) {
    displayInput.value = colorInput.value;
    console.log(`🎨 Колір продукту ${productNum} синхронізовано: ${colorInput.value}`);
  }
}

// ========== ФУНКЦІЇ ДЛЯ РОЗМІРІВ ==========

// Helper function to determine if product uses color picker (1,2) or text input (3,4,5)
function usesColorPickerUI(productNum) {
  return productNum === 1 || productNum === 2;
}

function getSelectedSizes(productNum) {
  const checkboxes = document.querySelectorAll(`.product${productNum}-size:checked`);
  const sizes = Array.from(checkboxes).map(cb => cb.value);
  return sizes;
}

function getSelectedSizesAsString(productNum) {
  // For products 3,4,5 that use text input instead of checkboxes
  if (!usesColorPickerUI(productNum)) {
    const textInput = document.getElementById(`product${productNum}Size`);
    if (textInput) {
      return textInput.value;
    }
    return '';
  }

  // For products 1,2 that use checkboxes
  const sizes = getSelectedSizes(productNum);
  return sizes.join(', ');
}

function setSelectedSizes(productNum, sizesString) {
  // For products 3,4,5 that use text input instead of checkboxes
  if (!usesColorPickerUI(productNum)) {
    const textInput = document.getElementById(`product${productNum}Size`);
    if (textInput) {
      textInput.value = sizesString || '';
    }
    return;
  }

  // For products 1,2 that use checkboxes
  // Clear all checkboxes first
  document.querySelectorAll(`.product${productNum}-size`).forEach(cb => {
    cb.checked = false;
  });

  // Parse the string and check relevant boxes
  if (sizesString && sizesString.trim()) {
    const sizes = sizesString.split(',').map(s => s.trim());
    sizes.forEach(size => {
      const checkbox = document.querySelector(`.product${productNum}-size[value="${size}"]`);
      if (checkbox) {
        checkbox.checked = true;
      }
    });
    console.log(`📏 Розміри продукту ${productNum} завантажені: ${sizesString}`);
  }
}

// ========== ФУНКЦІЇ ДЛЯ УПРАВЛІННЯ ФОТО ПРОДУКТІВ ==========



function addProductImage(productNum) {

  const inputId = `product${productNum}NewImage`;

  const inputEl = document.getElementById(inputId);

  const imagePath = inputEl.value.trim();



  if (!imagePath) {

    alert('Будь ласка, введіть шлях до фото');

    return;

  }



  const arrayName = `product${productNum}Images`;

  const arr = window[arrayName];



  if (!arr.includes(imagePath)) {

    arr.push(imagePath);

    renderProductImages(productNum);

    inputEl.value = '';

    console.log(`✅ Фото додано до продукту ${productNum}:`, imagePath);

  } else {

    alert('Це фото вже додано');

  }

}



function removeProductImage(productNum, index) {

  const arrayName = `product${productNum}Images`;

  const arr = window[arrayName];

  arr.splice(index, 1);

  renderProductImages(productNum);

  console.log(`❌ Фото видалено з продукту ${productNum} на індексі ${index}`);

}



function renderProductImages(productNum) {

  const arrayName = `product${productNum}Images`;

  const arr = window[arrayName];

  const containerId = `product${productNum}ImagesList`;

  const container = document.getElementById(containerId);



  if (!container) return;



  if (arr.length === 0) {

    container.innerHTML = '<div style="color: #7f8c8d; font-style: italic;">Немає фото</div>';

    return;

  }



  container.innerHTML = arr.map((imagePath, index) => `

    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #ecf0f1; margin-bottom: 6px; border-radius: 4px;">

      <span style="font-size: 13px; word-break: break-all; flex: 1;">${imagePath}</span>

      <button

        type="button"

        onclick="removeProductImage(${productNum}, ${index})"

        style="padding: 4px 10px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px; margin-left: 8px; flex-shrink: 0;">

        Видалити

      </button>

    </div>

  `).join('');

}

// ========== ФУНКЦІЇ ДЛЯ ФОТО PRODUCT 1 З FILE PICKER ==========

function handleProduct1ImageUpload() {
  const fileInput = document.getElementById('product1ImageInput');
  const files = fileInput.files;

  if (files.length === 0) {
    alert('Будь ласка, виберіть файли');
    return;
  }

  // Добавляємо файли з обираних фото Product 1
  Array.from(files).forEach(file => {
    // Використовуємо ім'я файлу як identifier для фото
    const fileName = `Product 1 - ${file.name} (${new Date().toLocaleTimeString()})`;

    // Читаємо файл як Data URL для preview
    const reader = new FileReader();
    reader.onload = (e) => {
      // Зберігаємо Data URL як шлях фото
      const dataUrl = e.target.result;

      if (!product1Images.includes(dataUrl)) {
        product1Images.push(dataUrl);
        renderProduct1Images();
        console.log(`✅ Фото додано до Product 1`);
      }
    };
    reader.readAsDataURL(file);
  });

  // Очищаємо file input
  fileInput.value = '';
}

function removeProduct1Image(index) {
  product1Images.splice(index, 1);
  renderProduct1Images();
  console.log(`❌ Фото видалено з Product 1 на індексі ${index}`);
}

function renderProduct1Images() {
  const container = document.getElementById('product1ImagesList');

  if (!container) return;

  if (product1Images.length === 0) {
    container.innerHTML = '<div style="color: #999; font-size: 13px; text-align: center; padding: 20px 0;">Фото не добавлено</div>';
    return;
  }

  container.innerHTML = product1Images.map((imageData, index) => {
    // Если це Data URL від file picker, показуємо preview
    if (imageData.startsWith('data:')) {
      return `
        <div style="display: flex; gap: 10px; align-items: center; padding: 10px; background: #ecf0f1; margin-bottom: 8px; border-radius: 4px;">
          <img src="${imageData}" alt="preview" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 12px; color: #333; word-break: break-all;">Новое фото</div>
          </div>
          <button
            type="button"
            onclick="removeProduct1Image(${index})"
            style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px; flex-shrink: 0;">
            Видалити
          </button>
        </div>
      `;
    } else {
      // Це шлях з конфіга, показуємо як текст
      return `
        <div style="display: flex; gap: 10px; align-items: center; padding: 10px; background: #ecf0f1; margin-bottom: 8px; border-radius: 4px;">
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 12px; color: #333; word-break: break-all;">${imageData}</div>
          </div>
          <button
            type="button"
            onclick="removeProduct1Image(${index})"
            style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px; flex-shrink: 0;">
            Видалити
          </button>
        </div>
      `;
    }
  }).join('');
}

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

      if (data.enableVideo !== undefined) document.getElementById('enableVideo').checked = data.enableVideo;

      videoUrlValue = data.videoUrl || '';
      showVideoPreview(videoUrlValue);

      const videoThumbDefault = (typeof data.enableVideoThumbnail === 'boolean') ? data.enableVideoThumbnail : true;
      document.getElementById('enableVideoThumbnail').checked = videoThumbDefault;

      videoThumbnailDesktopValue = data.videoThumbnailDesktop || DEFAULT_VIDEO_THUMBNAIL_DESKTOP;
      videoThumbnailMobileValue = data.videoThumbnailMobile || DEFAULT_VIDEO_THUMBNAIL_MOBILE;
      showVideoThumbnailPreview(videoThumbnailDesktopValue || videoThumbnailMobileValue);



      // Завантажити дані 5 продуктів

      for (let i = 1; i <= 5; i++) {

        if (data[`enableProduct${i}`] !== undefined) document.getElementById(`enableProduct${i}`).checked = data[`enableProduct${i}`];

        if (data[`product${i}Name`]) document.getElementById(`product${i}Name`).value = data[`product${i}Name`];

        if (data[`product${i}Color`]) document.getElementById(`product${i}Color`).value = data[`product${i}Color`];

        if (data[`product${i}ColorHex`]) {
          document.getElementById(`product${i}ColorHex`).value = data[`product${i}ColorHex`];
          // Only set ColorHexDisplay for products 1,2 that have the color picker UI
          if (usesColorPickerUI(i)) {
            const displayEl = document.getElementById(`product${i}ColorHexDisplay`);
            if (displayEl) {
              displayEl.value = data[`product${i}ColorHex`];
            }
          }
        }

        if (data[`product${i}Size`]) setSelectedSizes(i, data[`product${i}Size`]);

        if (data[`product${i}Material`]) document.getElementById(`product${i}Material`).value = data[`product${i}Material`];

        if (data[`product${i}PriceOld`]) document.getElementById(`product${i}PriceOld`).value = data[`product${i}PriceOld`];

        if (data[`product${i}Price`]) document.getElementById(`product${i}Price`).value = data[`product${i}Price`];



        // Завантажити фото продукту

        if (data[`product${i}Images`] && Array.isArray(data[`product${i}Images`])) {

          window[`product${i}Images`] = data[`product${i}Images`];

          if (i === 1) {
            renderProduct1Images();
          } else {
            renderProductImages(i);
          }

        }

      }



      // Ініціалізувати форму переваг

      if (data.benefits && Array.isArray(data.benefits) && data.benefits.length > 0) {

        initBenefitsForm(data.benefits);

      }

      // Встановити слухачі для синхронізації кольорових вибірок
      for (let i = 1; i <= 5; i++) {
        const colorInput = document.getElementById(`product${i}ColorHex`);
        if (colorInput) {
          colorInput.addEventListener('input', function() {
            syncColorPickerDisplay(i);
          });
        }
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

    enableVideo: document.getElementById('enableVideo').checked,

    videoUrl: videoUrlValue,

    enableVideoThumbnail: document.getElementById('enableVideoThumbnail').checked,

    videoThumbnailDesktop: videoThumbnailDesktopValue,

    videoThumbnailMobile: videoThumbnailMobileValue,

    benefits: benefits,

    // Product data

    product1Name: document.getElementById('product1Name').value,

    product1Color: document.getElementById('product1Color').value,

    product1ColorHex: document.getElementById('product1ColorHex').value,

    product1Size: getSelectedSizesAsString(1),

    product1Material: document.getElementById('product1Material').value,

    product1PriceOld: document.getElementById('product1PriceOld').value,

    product1Price: document.getElementById('product1Price').value,

    enableProduct1: document.getElementById('enableProduct1').checked,

    product2Name: document.getElementById('product2Name').value,

    product2Color: document.getElementById('product2Color').value,

    product2ColorHex: document.getElementById('product2ColorHex').value,

    product2Size: getSelectedSizesAsString(2),

    product2Material: document.getElementById('product2Material').value,

    product2PriceOld: document.getElementById('product2PriceOld').value,

    product2Price: document.getElementById('product2Price').value,

    enableProduct2: document.getElementById('enableProduct2').checked,

    product3Name: document.getElementById('product3Name').value,

    product3Color: document.getElementById('product3Color').value,

    product3ColorHex: document.getElementById('product3ColorHex').value,

    product3Size: getSelectedSizesAsString(3),

    product3Material: document.getElementById('product3Material').value,

    product3PriceOld: document.getElementById('product3PriceOld').value,

    product3Price: document.getElementById('product3Price').value,

    enableProduct3: document.getElementById('enableProduct3').checked,

    product4Name: document.getElementById('product4Name').value,

    product4Color: document.getElementById('product4Color').value,

    product4ColorHex: document.getElementById('product4ColorHex').value,

    product4Size: getSelectedSizesAsString(4),

    product4Material: document.getElementById('product4Material').value,

    product4PriceOld: document.getElementById('product4PriceOld').value,

    product4Price: document.getElementById('product4Price').value,

    enableProduct4: document.getElementById('enableProduct4').checked,

    product5Name: document.getElementById('product5Name').value,

    product5Color: document.getElementById('product5Color').value,

    product5ColorHex: document.getElementById('product5ColorHex').value,

    product5Size: getSelectedSizesAsString(5),

    product5Material: document.getElementById('product5Material').value,

    product5PriceOld: document.getElementById('product5PriceOld').value,

    product5Price: document.getElementById('product5Price').value,

    enableProduct5: document.getElementById('enableProduct5').checked,

    // Product images

    product1Images: product1Images,

    product2Images: product2Images,

    product3Images: product3Images,

    product4Images: product4Images,

    product5Images: product5Images

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

    document.getElementById('enableImage').checked = formData.enableImage;

    imageUrlValue = formData.imageUrl;

    if (formData.imageUrl) {

      document.getElementById('previewImageUpload').src = formData.imageUrl;

    }

    document.getElementById('imageUploadPreview').style.display = formData.imageUrl ? 'block' : 'none';

    document.getElementById('enableVideo').checked = formData.enableVideo;

    videoUrlValue = formData.videoUrl || '';
    showVideoPreview(videoUrlValue);

    const videoThumbToggle = (typeof formData.enableVideoThumbnail === 'boolean') ? formData.enableVideoThumbnail : true;
    document.getElementById('enableVideoThumbnail').checked = videoThumbToggle;

    videoThumbnailDesktopValue = formData.videoThumbnailDesktop || DEFAULT_VIDEO_THUMBNAIL_DESKTOP;
    videoThumbnailMobileValue = formData.videoThumbnailMobile || DEFAULT_VIDEO_THUMBNAIL_MOBILE;
    showVideoThumbnailPreview(videoThumbnailDesktopValue || videoThumbnailMobileValue);

    // Завантажити дані 5 продуктів

    for (let i = 1; i <= 5; i++) {

      if (formData[`enableProduct${i}`] !== undefined) document.getElementById(`enableProduct${i}`).checked = formData[`enableProduct${i}`];

      if (formData[`product${i}Name`]) document.getElementById(`product${i}Name`).value = formData[`product${i}Name`];

      if (formData[`product${i}Color`]) document.getElementById(`product${i}Color`).value = formData[`product${i}Color`];

      if (formData[`product${i}ColorHex`]) {
        document.getElementById(`product${i}ColorHex`).value = formData[`product${i}ColorHex`];
        // Only set ColorHexDisplay for products 1,2 that have the color picker UI
        if (usesColorPickerUI(i)) {
          const displayEl = document.getElementById(`product${i}ColorHexDisplay`);
          if (displayEl) {
            displayEl.value = formData[`product${i}ColorHex`];
          }
        }
      }

      if (formData[`product${i}Size`]) setSelectedSizes(i, formData[`product${i}Size`]);

      if (formData[`product${i}Material`]) document.getElementById(`product${i}Material`).value = formData[`product${i}Material`];

      if (formData[`product${i}PriceOld`]) document.getElementById(`product${i}PriceOld`).value = formData[`product${i}PriceOld`];

      if (formData[`product${i}Price`]) document.getElementById(`product${i}Price`).value = formData[`product${i}Price`];



      // Завантажити фото продукту

      if (formData[`product${i}Images`] && Array.isArray(formData[`product${i}Images`])) {

        window[`product${i}Images`] = formData[`product${i}Images`];

        if (i === 1) {
          renderProduct1Images();
        } else {
          renderProductImages(i);
        }

      }

    }



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

    }

    document.getElementById('imageUploadPreview').style.display = formData.imageUrl ? 'block' : 'none';

    document.getElementById('enableVideo').checked = formData.enableVideo;

    videoUrlValue = formData.videoUrl || '';
    showVideoPreview(videoUrlValue);

    const videoThumbToggle = (typeof formData.enableVideoThumbnail === 'boolean') ? formData.enableVideoThumbnail : true;
    document.getElementById('enableVideoThumbnail').checked = videoThumbToggle;

    videoThumbnailDesktopValue = formData.videoThumbnailDesktop || DEFAULT_VIDEO_THUMBNAIL_DESKTOP;
    videoThumbnailMobileValue = formData.videoThumbnailMobile || DEFAULT_VIDEO_THUMBNAIL_MOBILE;
    showVideoThumbnailPreview(videoThumbnailDesktopValue || videoThumbnailMobileValue);




    // Завантажити дані 5 продуктів

    for (let i = 1; i <= 5; i++) {

      document.getElementById(`enableProduct${i}`).checked = formData[`enableProduct${i}`];

      document.getElementById(`product${i}Name`).value = formData[`product${i}Name`] || '';

      document.getElementById(`product${i}Color`).value = formData[`product${i}Color`] || '';

      const colorHex = formData[`product${i}ColorHex`] || '';
      document.getElementById(`product${i}ColorHex`).value = colorHex;
      // Only set ColorHexDisplay for products 1,2 that have the color picker UI
      if (usesColorPickerUI(i)) {
        const displayEl = document.getElementById(`product${i}ColorHexDisplay`);
        if (displayEl) {
          displayEl.value = colorHex;
        }
      }

      const sizes = formData[`product${i}Size`] || '';
      setSelectedSizes(i, sizes);

      document.getElementById(`product${i}Material`).value = formData[`product${i}Material`] || '';

      document.getElementById(`product${i}PriceOld`).value = formData[`product${i}PriceOld`] || '';

      document.getElementById(`product${i}Price`).value = formData[`product${i}Price`] || '';



      // Завантажити фото продукту

      if (formData[`product${i}Images`] && Array.isArray(formData[`product${i}Images`])) {

        window[`product${i}Images`] = formData[`product${i}Images`];

        if (i === 1) {
          renderProduct1Images();
        } else {
          renderProductImages(i);
        }

      }

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

function showVideoPreview(videoPath) {
  const previewDiv = document.getElementById('videoUploadPreview');
  const videoEl = document.getElementById('previewVideoUpload');
  const statusEl = document.getElementById('videoUploadStatus');

  if (!previewDiv || !videoEl || !statusEl) return;

  if (!videoPath) {
    previewDiv.style.display = 'none';
    if (videoEl.getAttribute('src')) {
      videoEl.removeAttribute('src');
    }
    videoEl.load();
    statusEl.textContent = '';
    return;
  }

  previewDiv.style.display = 'block';
  videoEl.src = videoPath;
  videoEl.load();
  statusEl.textContent = videoPath;
}

function showVideoThumbnailPreview(imagePath) {
  const previewDiv = document.getElementById('videoThumbnailPreview');
  const imageEl = document.getElementById('previewVideoThumbnail');
  const statusEl = document.getElementById('videoThumbnailStatus');

  if (!previewDiv || !imageEl || !statusEl) return;

  if (!imagePath) {
    previewDiv.style.display = 'none';
    if (imageEl.getAttribute('src')) {
      imageEl.removeAttribute('src');
    }
    statusEl.textContent = '';
    return;
  }

  previewDiv.style.display = 'block';
  imageEl.src = imagePath;
  imageEl.alt = "Прев'ю відео";
  statusEl.textContent = imagePath;
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

const videoUploadInput = document.getElementById('videoUpload');
if (videoUploadInput) {
  videoUploadInput.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('videoUpload', file);

    try {
      const response = await fetch('/upload-video', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Не вдалося завантажити відео');

      const result = await response.json();
      videoUrlValue = result.filename;
      showVideoPreview(videoUrlValue);
      console.log('Відео завантажено:', videoUrlValue);
    } catch (error) {
      alert('Не вдалося завантажити відео: ' + error.message);
      e.target.value = '';
      videoUrlValue = '';
      showVideoPreview('');
    }
  });
}



const videoThumbnailUploadInput = document.getElementById('videoThumbnailUpload');
if (videoThumbnailUploadInput) {
  videoThumbnailUploadInput.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('videoThumbnailUpload', file);

    try {
      const response = await fetch('/upload-video-thumbnail', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Не вдалося завантажити прев\'ю');

      const result = await response.json();
      videoThumbnailDesktopValue = result.desktop || '';
      videoThumbnailMobileValue = result.mobile || result.desktop || '';
      document.getElementById('enableVideoThumbnail').checked = true;
      showVideoThumbnailPreview(videoThumbnailDesktopValue || videoThumbnailMobileValue);
      console.log('Прев\'ю відео завантажено:', videoThumbnailDesktopValue || videoThumbnailMobileValue);
    } catch (error) {
      alert('Не вдалося завантажити прев\'ю: ' + error.message);
      e.target.value = '';
      videoThumbnailDesktopValue = '';
      videoThumbnailMobileValue = '';
      showVideoThumbnailPreview('');
    }
  });
}




function getFormParams() {

  const headerText = document.getElementById('headerText').value;

  const heroTitle = document.getElementById('heroTitle').value;

  const heroPrice = document.getElementById('heroPrice').value;

  const enableTimer = document.getElementById('enableTimer').checked ? 'on' : 'off';

  const enableStock = document.getElementById('enableStock').checked ? 'on' : 'off';

  const heroImage = uploadedHeroImageFilename;

  const enableImage = document.getElementById('enableImage').checked ? 'on' : 'off';

  const imageUrl = imageUrlValue;
  const enableVideo = document.getElementById('enableVideo').checked ? 'on' : 'off';
  const videoUrl = videoUrlValue;
  const enableVideoThumbnail = document.getElementById('enableVideoThumbnail').checked ? 'on' : 'off';
  const videoThumbnailDesktop = videoThumbnailDesktopValue;
  const videoThumbnailMobile = videoThumbnailMobileValue;




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
    enableVideo: enableVideo,
    videoUrl: videoUrl,
    enableVideoThumbnail: enableVideoThumbnail,
    videoThumbnailDesktop: videoThumbnailDesktop,
    videoThumbnailMobile: videoThumbnailMobile,


    benefits: JSON.stringify(benefits),

    // Product data

    product1Name: document.getElementById('product1Name').value,

    product1Color: document.getElementById('product1Color').value,

    product1ColorHex: document.getElementById('product1ColorHex').value,

    product1Size: getSelectedSizesAsString(1),

    product1Material: document.getElementById('product1Material').value,

    product1PriceOld: document.getElementById('product1PriceOld').value,

    product1Price: document.getElementById('product1Price').value,

    enableProduct1: document.getElementById('enableProduct1').checked ? 'on' : 'off',

    product2Name: document.getElementById('product2Name').value,

    product2Color: document.getElementById('product2Color').value,

    product2ColorHex: document.getElementById('product2ColorHex').value,

    product2Size: getSelectedSizesAsString(2),

    product2Material: document.getElementById('product2Material').value,

    product2PriceOld: document.getElementById('product2PriceOld').value,

    product2Price: document.getElementById('product2Price').value,

    enableProduct2: document.getElementById('enableProduct2').checked ? 'on' : 'off',

    product3Name: document.getElementById('product3Name').value,

    product3Color: document.getElementById('product3Color').value,

    product3ColorHex: document.getElementById('product3ColorHex').value,

    product3Size: getSelectedSizesAsString(3),

    product3Material: document.getElementById('product3Material').value,

    product3PriceOld: document.getElementById('product3PriceOld').value,

    product3Price: document.getElementById('product3Price').value,

    enableProduct3: document.getElementById('enableProduct3').checked ? 'on' : 'off',

    product4Name: document.getElementById('product4Name').value,

    product4Color: document.getElementById('product4Color').value,

    product4ColorHex: document.getElementById('product4ColorHex').value,

    product4Size: getSelectedSizesAsString(4),

    product4Material: document.getElementById('product4Material').value,

    product4PriceOld: document.getElementById('product4PriceOld').value,

    product4Price: document.getElementById('product4Price').value,

    enableProduct4: document.getElementById('enableProduct4').checked ? 'on' : 'off',

    product5Name: document.getElementById('product5Name').value,

    product5Color: document.getElementById('product5Color').value,

    product5ColorHex: document.getElementById('product5ColorHex').value,

    product5Size: getSelectedSizesAsString(5),

    product5Material: document.getElementById('product5Material').value,

    product5PriceOld: document.getElementById('product5PriceOld').value,

    product5Price: document.getElementById('product5Price').value,

    enableProduct5: document.getElementById('enableProduct5').checked ? 'on' : 'off',

    // Product images

    product1Images: JSON.stringify(product1Images),

    product2Images: JSON.stringify(product2Images),

    product3Images: JSON.stringify(product3Images),

    product4Images: JSON.stringify(product4Images),

    product5Images: JSON.stringify(product5Images)

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

