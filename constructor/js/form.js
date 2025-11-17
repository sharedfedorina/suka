// Helper functions для безпечного встановлення та отримання значень
function safeSetValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function safeSetChecked(id, checked) {
  const el = document.getElementById(id);
  if (el) el.checked = checked;
}

function safeGetValue(id, defaultValue = '') {
  const el = document.getElementById(id);
  return el ? el.value : defaultValue;
}

function safeGetChecked(id, defaultValue = false) {
  const el = document.getElementById(id);
  return el ? el.checked : defaultValue;
}

let uploadedHeroImageFilename = '';

let imageUrlValue = '';

let videoUrlValue = '';

const DEFAULT_VIDEO_THUMBNAIL_DESKTOP = 'img/promo/promo-1.jpg';
const DEFAULT_VIDEO_THUMBNAIL_MOBILE = 'img/promo/promo-1_m.webp';

let videoThumbnailDesktopValue = DEFAULT_VIDEO_THUMBNAIL_DESKTOP;
let videoThumbnailMobileValue = DEFAULT_VIDEO_THUMBNAIL_MOBILE;

let sizeChartImageValue = 'img/info/info-1.webp'; // Default size chart image

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

let product8Images = [];

let product9Images = [];



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

  let arr;
  if (productNum === 1) arr = product1Images;
  else if (productNum === 2) arr = product2Images;
  else if (productNum === 3) arr = product3Images;
  else if (productNum === 4) arr = product4Images;
  else if (productNum === 5) arr = product5Images;
  else if (productNum === 8) arr = product8Images;
  else if (productNum === 9) arr = product9Images;

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

  if (productNum === 1) {
    product1Images.splice(index, 1);
  } else if (productNum === 2) {
    product2Images.splice(index, 1);
  } else if (productNum === 3) {
    product3Images.splice(index, 1);
  } else if (productNum === 4) {
    product4Images.splice(index, 1);
  } else if (productNum === 5) {
    product5Images.splice(index, 1);
  } else if (productNum === 8) {
    product8Images.splice(index, 1);
  } else if (productNum === 9) {
    product9Images.splice(index, 1);
  }

  renderProductImages(productNum);

  console.log(`❌ Фото видалено з продукту ${productNum} на індексі ${index}`);

}



function renderProductImages(productNum) {

  const container = document.getElementById(`product${productNum}ImagesList`);
  if (!container) return;

  let arr;
  if (productNum === 1) arr = product1Images;
  else if (productNum === 2) arr = product2Images;
  else if (productNum === 3) arr = product3Images;
  else if (productNum === 4) arr = product4Images;
  else if (productNum === 5) arr = product5Images;
  else if (productNum === 8) arr = product8Images;
  else if (productNum === 9) arr = product9Images;

  if (!arr || arr.length === 0) {
    container.innerHTML = '<div style="color: #999; font-size: 13px; text-align: center; padding: 20px 0;">Фото не добавлено</div>';
    return;
  }

  container.innerHTML = arr.map((imageData, index) => {
    const fileName = imageData.includes('/') ? imageData.split('/').pop() : 'Нове фото';
    return `
      <div style="display: flex; gap: 10px; align-items: center; padding: 10px; background: #ecf0f1; margin-bottom: 8px; border-radius: 4px;">
        <img src="${imageData}" alt="preview" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 12px; color: #333; word-break: break-all;">${fileName}</div>
        </div>
        <button
          type="button"
          onclick="removeProductImage(${productNum}, ${index})"
          style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px; flex-shrink: 0;">
          Видалити
        </button>
      </div>
    `;
  }).join('');

}

// ========== ФУНКЦІЇ ДЛЯ ФОТО PRODUCT 1 З FILE PICKER ==========

async function handleProduct1ImageUpload() {
  const fileInput = document.getElementById('product1ImageInput');
  const files = fileInput.files;

  if (files.length === 0) {
    alert('Будь ласка, виберіть файли');
    return;
  }

  // Добавляємо файли з обираних фото Product 1
  for (let file of files) {
    const formData = new FormData();
    formData.append('product1Image', file);

    try {
      const response = await fetch('/upload-product1-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        if (!product1Images.includes(data.filename)) {
          product1Images.push(data.filename);
          renderProduct1Images();
          console.log(`✅ Фото додано до Product 1: ${data.filename}`);
        }
      } else {
        alert(`Помилка: ${data.error}`);
      }
    } catch (err) {
      alert(`Помилка при завантаженні: ${err.message}`);
      console.error(err);
    }
  }

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
    // Завжди показуємо preview (для data URL та для серверних шляхів)
    const fileName = imageData.includes('/') ? imageData.split('/').pop() : 'Нове фото';
    return `
      <div style="display: flex; gap: 10px; align-items: center; padding: 10px; background: #ecf0f1; margin-bottom: 8px; border-radius: 4px;">
        <img src="${imageData}" alt="preview" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 12px; color: #333; word-break: break-all;">${fileName}</div>
        </div>
        <button
          type="button"
          onclick="removeProduct1Image(${index})"
          style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px; flex-shrink: 0;">
          Видалити
        </button>
      </div>
    `;
  }).join('');
}

// ========== ФУНКЦІЇ ДЛЯ ФОТО PRODUCT 2 З FILE PICKER ==========

async function handleProduct2ImageUpload() {
  const fileInput = document.getElementById('product2ImageInput');
  const files = fileInput.files;

  if (files.length === 0) {
    alert('Будь ласка, виберіть файли');
    return;
  }

  for (let file of files) {
    const formData = new FormData();
    formData.append('product2Image', file);

    try {
      const response = await fetch('/upload-product2-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        if (!product2Images.includes(data.filename)) {
          product2Images.push(data.filename);
          renderProductImages(2);
          console.log(`✅ Фото додано до Product 2: ${data.filename}`);
        }
      } else {
        alert(`Помилка: ${data.error}`);
      }
    } catch (err) {
      alert(`Помилка при завантаженні: ${err.message}`);
      console.error(err);
    }
  }

  fileInput.value = '';
}

// ========== ФУНКЦІЇ ДЛЯ ФОТО PRODUCT 3 З FILE PICKER ==========

async function handleProduct3ImageUpload() {
  const fileInput = document.getElementById('product3ImageInput');
  const files = fileInput.files;

  if (files.length === 0) {
    alert('Будь ласка, виберіть файли');
    return;
  }

  for (let file of files) {
    const formData = new FormData();
    formData.append('product3Image', file);

    try {
      const response = await fetch('/upload-product3-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        if (!product3Images.includes(data.filename)) {
          product3Images.push(data.filename);
          renderProductImages(3);
          console.log(`✅ Фото додано до Product 3: ${data.filename}`);
        }
      } else {
        alert(`Помилка: ${data.error}`);
      }
    } catch (err) {
      alert(`Помилка при завантаженні: ${err.message}`);
      console.error(err);
    }
  }

  fileInput.value = '';
}

// ========== ФУНКЦІЇ ДЛЯ ФОТО PRODUCT 4 З FILE PICKER ==========

async function handleProduct4ImageUpload() {
  const fileInput = document.getElementById('product4ImageInput');
  const files = fileInput.files;

  if (files.length === 0) {
    alert('Будь ласка, виберіть файли');
    return;
  }

  for (let file of files) {
    const formData = new FormData();
    formData.append('product4Image', file);

    try {
      const response = await fetch('/upload-product4-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        if (!product4Images.includes(data.filename)) {
          product4Images.push(data.filename);
          renderProductImages(4);
          console.log(`✅ Фото додано до Product 4: ${data.filename}`);
        }
      } else {
        alert(`Помилка: ${data.error}`);
      }
    } catch (err) {
      alert(`Помилка при завантаженні: ${err.message}`);
      console.error(err);
    }
  }

  fileInput.value = '';
}

// ========== ФУНКЦІЇ ДЛЯ ФОТО PRODUCT 5 З FILE PICKER ==========

async function handleProduct5ImageUpload() {
  const fileInput = document.getElementById('product5ImageInput');
  const files = fileInput.files;

  if (files.length === 0) {
    alert('Будь ласка, виберіть файли');
    return;
  }

  for (let file of files) {
    const formData = new FormData();
    formData.append('product5Image', file);

    try {
      const response = await fetch('/upload-product5-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        if (!product5Images.includes(data.filename)) {
          product5Images.push(data.filename);
          renderProductImages(5);
          console.log(`✅ Фото додано до Product 5: ${data.filename}`);
        }
      } else {
        alert(`Помилка: ${data.error}`);
      }
    } catch (err) {
      alert(`Помилка при завантаженні: ${err.message}`);
      console.error(err);
    }
  }

  fileInput.value = '';
}

// ========== ФУНКЦІЇ ДЛЯ ФОТО PRODUCT 8 З FILE PICKER ==========

async function handleProduct8ImageUpload() {
  const fileInput = document.getElementById('product8ImageInput');
  const files = fileInput.files;

  if (files.length === 0) {
    alert('Будь ласка, виберіть файли');
    return;
  }

  for (let file of files) {
    const formData = new FormData();
    formData.append('product8Image', file);

    try {
      const response = await fetch('/upload-product8-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        if (!product8Images.includes(data.filename)) {
          product8Images.push(data.filename);
          renderProductImages(8);
          console.log(`✅ Фото додано до Product 8: ${data.filename}`);
        }
      } else {
        alert(`Помилка: ${data.error}`);
      }
    } catch (err) {
      alert(`Помилка при завантаженні: ${err.message}`);
      console.error(err);
    }
  }

  fileInput.value = '';
}

// ========== ФУНКЦІЇ ДЛЯ ФОТО PRODUCT 9 З FILE PICKER ==========

async function handleProduct9ImageUpload() {
  const fileInput = document.getElementById('product9ImageInput');
  const files = fileInput.files;

  if (files.length === 0) {
    alert('Будь ласка, виберіть файли');
    return;
  }

  for (let file of files) {
    const formData = new FormData();
    formData.append('product9Image', file);

    try {
      const response = await fetch('/upload-product9-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        if (!product9Images.includes(data.filename)) {
          product9Images.push(data.filename);
          renderProductImages(9);
          console.log(`✅ Фото додано до Product 9: ${data.filename}`);
        }
      } else {
        alert(`Помилка: ${data.error}`);
      }
    } catch (err) {
      alert(`Помилка при завантаженні: ${err.message}`);
      console.error(err);
    }
  }

  fileInput.value = '';
}

// ========== ЗАВАНТАЖЕННЯ ФОТО РОЗМІРНОЇ СІТКИ ==========

async function handleSizeChartImageUpload() {
  const fileInput = document.getElementById('sizeChartImageInput');
  const file = fileInput.files[0];

  if (!file) {
    alert('Будь ласка, виберіть файл');
    return;
  }

  const formData = new FormData();
  formData.append('sizeChartImage', file);

  try {
    const response = await fetch('/upload-size-chart-image', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      sizeChartImageValue = data.filename;

      // Показати preview
      const previewContainer = document.getElementById('sizeChartImagePreview');
      const previewImg = document.getElementById('previewSizeChartImage');
      const statusText = document.getElementById('sizeChartUploadStatus');

      previewImg.src = data.filename;
      previewContainer.style.display = 'block';
      statusText.textContent = '✅ Фото успішно завантажено';
      statusText.style.color = '#27ae60';

      console.log(`✅ Розмірна сітка завантажена: ${data.filename}`);
    } else {
      alert(`Помилка: ${data.error}`);
    }
  } catch (err) {
    alert(`Помилка при завантаженні: ${err.message}`);
    console.error(err);
  }

  fileInput.value = '';
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

    headerText: safeGetValue('headerText'),

    heroTitle: safeGetValue('heroTitle'),

    heroPrice: safeGetValue('heroPrice'),

    heroButtonText: safeGetValue('heroButtonText'),

    enableTimer: safeGetChecked('enableTimer'),

    enableStock: safeGetChecked('enableStock'),

    heroImage: uploadedHeroImageFilename,

    enableImage: safeGetChecked('enableImage'),

    imageUrl: imageUrlValue,

    enableVideo: safeGetChecked('enableVideo'),

    videoUrl: videoUrlValue,

    enableVideoThumbnail: safeGetChecked('enableVideoThumbnail'),

    videoThumbnailDesktop: videoThumbnailDesktopValue,

    videoThumbnailMobile: videoThumbnailMobileValue,

    videoSectionLabel: safeGetValue('videoSectionLabel'),

    videoSectionTitle: safeGetValue('videoSectionTitle'),

    sizeChartImage: sizeChartImageValue,

    sizeChartLabel: safeGetValue('sizeChartLabel'),

    sizeChartTitle: safeGetValue('sizeChartTitle'),

    // Info list (product characteristics) - DON'T save if elements don't exist in form
    // These fields are not in any section HTML, so they would overwrite saved values with empty strings
    // infoEnableBrand: safeGetChecked('infoEnableBrand'),
    // infoBrandLabel: safeGetValue('infoBrandLabel'),
    // infoBrandValue: safeGetValue('infoBrandValue'),
    // infoEnableModel: safeGetChecked('infoEnableModel'),
    // infoModelLabel: safeGetValue('infoModelLabel'),
    // infoModelValue: safeGetValue('infoModelValue'),
    // infoEnableQuantity: safeGetChecked('infoEnableQuantity'),
    // infoQuantityLabel: safeGetValue('infoQuantityLabel'),
    // infoQuantityValue: safeGetValue('infoQuantityValue'),
    // infoEnableColors: safeGetChecked('infoEnableColors'),
    // infoColorsLabel: safeGetValue('infoColorsLabel'),
    // infoEnableSizes: safeGetChecked('infoEnableSizes'),
    // infoSizesLabel: safeGetValue('infoSizesLabel'),
    // infoSizesValue: safeGetValue('infoSizesValue'),
    // infoEnableMaterial: safeGetChecked('infoEnableMaterial'),
    // infoMaterialLabel: safeGetValue('infoMaterialLabel'),
    // infoMaterialValue: safeGetValue('infoMaterialValue'),
    // infoEnablePackaging: safeGetChecked('infoEnablePackaging'),
    // infoPackagingLabel: safeGetValue('infoPackagingLabel'),
    // infoPackagingValue: safeGetValue('infoPackagingValue'),

    benefits: benefits,

    // Products section settings
    productsSectionLabel: safeGetValue('productsSectionLabel'),
    productsSectionTitle: safeGetValue('productsSectionTitle'),
    productOrderButtonText: safeGetValue('productOrderButtonText'),
    actionChooseText: safeGetValue('actionChooseText'),
    actionPromoText: safeGetValue('actionPromoText'),

    // Product data

    product1Name: safeGetValue('product1Name'),

    product1Color: safeGetValue('product1Color'),

    product1ColorHex: safeGetValue('product1ColorHex'),

    product1Size: getSelectedSizesAsString(1),

    product1Material: safeGetValue('product1Material'),

    product1PriceOld: safeGetValue('product1PriceOld'),

    product1Price: safeGetValue('product1Price'),

    enableProduct1: safeGetChecked('enableProduct1'),

    product2Name: safeGetValue('product2Name'),

    product2Color: safeGetValue('product2Color'),

    product2ColorHex: safeGetValue('product2ColorHex'),

    product2Size: getSelectedSizesAsString(2),

    product2Material: safeGetValue('product2Material'),

    product2PriceOld: safeGetValue('product2PriceOld'),

    product2Price: safeGetValue('product2Price'),

    enableProduct2: safeGetChecked('enableProduct2'),

    product3Name: safeGetValue('product3Name'),

    product3Color: safeGetValue('product3Color'),

    product3ColorHex: safeGetValue('product3ColorHex'),

    product3Size: getSelectedSizesAsString(3),

    product3Material: safeGetValue('product3Material'),

    product3PriceOld: safeGetValue('product3PriceOld'),

    product3Price: safeGetValue('product3Price'),

    enableProduct3: safeGetChecked('enableProduct3'),

    product4Name: safeGetValue('product4Name'),

    product4Color: safeGetValue('product4Color'),

    product4ColorHex: safeGetValue('product4ColorHex'),

    product4Size: getSelectedSizesAsString(4),

    product4Material: safeGetValue('product4Material'),

    product4PriceOld: safeGetValue('product4PriceOld'),

    product4Price: safeGetValue('product4Price'),

    enableProduct4: safeGetChecked('enableProduct4'),

    product5Name: safeGetValue('product5Name'),

    product5Color: safeGetValue('product5Color'),

    product5ColorHex: safeGetValue('product5ColorHex'),

    product5Size: getSelectedSizesAsString(5),

    product5Material: safeGetValue('product5Material'),

    product5PriceOld: safeGetValue('product5PriceOld'),

    product5Price: safeGetValue('product5Price'),

    enableProduct5: safeGetChecked('enableProduct5'),

    // Product images

    product1Images: product1Images,

    product2Images: product2Images,

    product3Images: product3Images,

    product4Images: product4Images,

    product5Images: product5Images,

    // Marketing products (bundles)
    product8Name: safeGetValue('product8Name'),
    product8Color: safeGetValue('product8Color'),
    product8ColorHex: safeGetValue('product8ColorHex'),
    product8Size: getSelectedSizesAsString(8),
    product8Material: safeGetValue('product8Material'),
    product8PriceOld: safeGetValue('product8PriceOld'),
    product8Price: safeGetValue('product8Price'),
    enableProduct8: safeGetChecked('enableProduct8'),
    product8Images: product8Images,

    product9Name: safeGetValue('product9Name'),
    product9Color: safeGetValue('product9Color'),
    product9ColorHex: safeGetValue('product9ColorHex'),
    product9Size: getSelectedSizesAsString(9),
    product9Material: safeGetValue('product9Material'),
    product9PriceOld: safeGetValue('product9PriceOld'),
    product9Price: safeGetValue('product9Price'),
    enableProduct9: safeGetChecked('enableProduct9'),
    product9Images: product9Images,

    // TABS section
    enableTabs: safeGetChecked('enableTabs'),
    tabsLabel: safeGetValue('tabsLabel'),
    tabsTitle: safeGetValue('tabsTitle'),
    enableTabItem1: safeGetChecked('enableTabItem1'),
    tab1Title: safeGetValue('tab1Title'),
    tab1Description: safeGetValue('tab1Description'),
    tab1ImageDesktop: safeGetValue('tab1ImageDesktop'),
    tab1ImageMobile: safeGetValue('tab1ImageMobile'),
    enableTabItem2: safeGetChecked('enableTabItem2'),
    tab2Title: safeGetValue('tab2Title'),
    tab2Description: safeGetValue('tab2Description'),
    tab2ImageDesktop: safeGetValue('tab2ImageDesktop'),
    tab2ImageMobile: safeGetValue('tab2ImageMobile'),
    enableTabItem3: safeGetChecked('enableTabItem3'),
    tab3Title: safeGetValue('tab3Title'),
    tab3Description: safeGetValue('tab3Description'),
    tab3ImageDesktop: safeGetValue('tab3ImageDesktop'),
    tab3ImageMobile: safeGetValue('tab3ImageMobile'),

    // SalesDrive integration
    enableSalesDrive: safeGetChecked('enableSalesDrive'),
    salesDriveApiKey: safeGetValue('salesDriveApiKey'),
    salesDriveStreamId: safeGetValue('salesDriveStreamId'),
    salesDriveOfferId: safeGetValue('salesDriveOfferId'),
    salesDriveWebmasterId: safeGetValue('salesDriveWebmasterId'),

    // Section visibility checkboxes
    enableComments: safeGetChecked('enableComments'),
    enableReviews: safeGetChecked('enableReviews'),
    enableFaq: safeGetChecked('enableFaq'),
    enableHow: safeGetChecked('enableHow'),
    enableRequest: safeGetChecked('enableRequest'),

    // Comments section fields
    commentsLabel: safeGetValue('commentsLabel'),
    commentsTitle: safeGetValue('commentsTitle'),
    commentsSalesStat: safeGetValue('commentsSalesStat'),
    commentsSalesText: safeGetValue('commentsSalesText'),
    commentsSatisfiedStat: safeGetValue('commentsSatisfiedStat'),
    commentsSatisfiedText: safeGetValue('commentsSatisfiedText'),
    commentsRepeatStat: safeGetValue('commentsRepeatStat'),
    commentsRepeatText: safeGetValue('commentsRepeatText'),
    commentsButtonText: safeGetValue('commentsButtonText'),

    // Reviews section fields
    reviewsLabel: safeGetValue('reviewsLabel'),
    reviewsTitle: safeGetValue('reviewsTitle'),
    review1Name: safeGetValue('review1Name'),
    review1Text: safeGetValue('review1Text'),
    review1Image: safeGetValue('review1Image'),
    review2Name: safeGetValue('review2Name'),
    review2Text: safeGetValue('review2Text'),
    review2Image: safeGetValue('review2Image'),
    review3Name: safeGetValue('review3Name'),
    review3Text: safeGetValue('review3Text'),
    review3Image: safeGetValue('review3Image'),
    review4Name: safeGetValue('review4Name'),
    review4Text: safeGetValue('review4Text'),
    review4Image: safeGetValue('review4Image'),

    // FAQ section fields
    faqLabel: safeGetValue('faqLabel'),
    faqTitle: safeGetValue('faqTitle'),
    faq1Question: safeGetValue('faq1Question'),
    faq1Answer: safeGetValue('faq1Answer'),
    faq2Question: safeGetValue('faq2Question'),
    faq2Answer: safeGetValue('faq2Answer'),
    faq3Question: safeGetValue('faq3Question'),
    faq3Answer: safeGetValue('faq3Answer'),
    faq4Question: safeGetValue('faq4Question'),
    faq4Answer: safeGetValue('faq4Answer'),

    // How to buy section fields
    howLabel: safeGetValue('howLabel'),
    howTitle: safeGetValue('howTitle'),
    howStep1: safeGetValue('howStep1'),
    howStep2: safeGetValue('howStep2'),
    howStep3: safeGetValue('howStep3'),
    howStep4: safeGetValue('howStep4'),

    // Request form section fields
    requestTitle: safeGetValue('requestTitle'),
    requestTimerText: safeGetValue('requestTimerText'),
    requestInfoTitle: safeGetValue('requestInfoTitle'),
    requestInfoDescription: safeGetValue('requestInfoDescription'),
    requestNamePlaceholder: safeGetValue('requestNamePlaceholder'),
    requestPhonePlaceholder: safeGetValue('requestPhonePlaceholder'),
    requestPhoneFormat: safeGetValue('requestPhoneFormat'),
    requestButtonText: safeGetValue('requestButtonText'),
    requestStockPrefix: safeGetValue('requestStockPrefix'),
    requestStockSuffix: safeGetValue('requestStockSuffix')

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



    safeSetValue('headerText', formData.headerText);

    safeSetValue('heroTitle', formData.heroTitle);

    safeSetValue('heroPrice', formData.heroPrice || '');

    safeSetValue('heroButtonText', formData.heroButtonText || '');

    safeSetChecked('enableTimer', formData.enableTimer);

    safeSetChecked('enableStock', formData.enableStock);

    uploadedHeroImageFilename = formData.heroImage;

    // Show hero image preview
    if (formData.heroImage) {
      const previewImg = document.getElementById('heroImagePreviewImg');
      const previewEmpty = document.getElementById('heroImagePreviewEmpty');
      if (previewImg && previewEmpty) {
        previewImg.src = formData.heroImage;
        previewImg.style.display = 'block';
        previewEmpty.style.display = 'none';
      }
    }

    safeSetChecked('enableImage', formData.enableImage);

    imageUrlValue = formData.imageUrl;

    // Show plus-logo image preview
    if (formData.imageUrl) {
      const previewImg = document.getElementById('imageUrlPreviewImg');
      const previewEmpty = document.getElementById('imageUrlPreviewEmpty');
      if (previewImg && previewEmpty) {
        previewImg.src = formData.imageUrl;
        previewImg.style.display = 'block';
        previewEmpty.style.display = 'none';
      }
    }

    const imageUploadPreview = document.getElementById('imageUploadPreview');
    if (imageUploadPreview) {
      imageUploadPreview.style.display = formData.imageUrl ? 'block' : 'none';
    }

    safeSetChecked('enableVideo', formData.enableVideo);

    videoUrlValue = formData.videoUrl || '';
    showVideoPreview(videoUrlValue);

    const videoThumbToggle = (typeof formData.enableVideoThumbnail === 'boolean') ? formData.enableVideoThumbnail : true;
    safeSetChecked('enableVideoThumbnail', videoThumbToggle);

    videoThumbnailDesktopValue = formData.videoThumbnailDesktop || '';
    videoThumbnailMobileValue = formData.videoThumbnailMobile || '';
    showVideoThumbnailPreview(videoThumbnailDesktopValue || videoThumbnailMobileValue);

    safeSetValue('videoSectionLabel', formData.videoSectionLabel || 'Відеоогляд');
    safeSetValue('videoSectionTitle', formData.videoSectionTitle || 'Краще один раз побачити');

    // Завантажити фото розмірної сітки
    sizeChartImageValue = formData.sizeChartImage || '';
    safeSetValue('sizeChartLabel', formData.sizeChartLabel || 'Розмірна сітка');
    safeSetValue('sizeChartTitle', formData.sizeChartTitle || 'Вагаєтесь з розміром?<br> ');
    if (formData.sizeChartImage) {
      const previewContainer = document.getElementById('sizeChartImagePreview');
      const previewImg = document.getElementById('previewSizeChartImage');
      const statusText = document.getElementById('sizeChartUploadStatus');

      if (previewImg) {
        previewImg.src = formData.sizeChartImage;
      }
      if (previewContainer) {
        previewContainer.style.display = 'block';
      }
      if (statusText) {
        statusText.textContent = '✅ Завантажено з конфігурації';
        statusText.style.color = '#27ae60';
      }
    }

    // Завантажити дані інформаційного блоку
    safeSetChecked('infoEnableBrand', formData.infoEnableBrand || false);
    safeSetValue('infoBrandLabel', formData.infoBrandLabel || '');
    safeSetValue('infoBrandValue', formData.infoBrandValue || '');

    safeSetChecked('infoEnableModel', formData.infoEnableModel || false);
    safeSetValue('infoModelLabel', formData.infoModelLabel || '');
    safeSetValue('infoModelValue', formData.infoModelValue || '');

    safeSetChecked('infoEnableQuantity', formData.infoEnableQuantity || false);
    safeSetValue('infoQuantityLabel', formData.infoQuantityLabel || '');
    safeSetValue('infoQuantityValue', formData.infoQuantityValue || '');

    safeSetChecked('infoEnableColors', formData.infoEnableColors || false);
    safeSetValue('infoColorsLabel', formData.infoColorsLabel || '');

    safeSetChecked('infoEnableSizes', formData.infoEnableSizes || false);
    safeSetValue('infoSizesLabel', formData.infoSizesLabel || '');
    safeSetValue('infoSizesValue', formData.infoSizesValue || '');

    safeSetChecked('infoEnableMaterial', formData.infoEnableMaterial || false);
    safeSetValue('infoMaterialLabel', formData.infoMaterialLabel || '');
    safeSetValue('infoMaterialValue', formData.infoMaterialValue || '');

    safeSetChecked('infoEnablePackaging', formData.infoEnablePackaging || false);
    safeSetValue('infoPackagingLabel', formData.infoPackagingLabel || '');
    safeSetValue('infoPackagingValue', formData.infoPackagingValue || '');

    // Products section settings
    safeSetValue('productsSectionLabel', formData.productsSectionLabel || 'Замовляйте зараз зі знижкою');
    safeSetValue('productsSectionTitle', formData.productsSectionTitle || 'Обирайте колір або <br> Свій набір футболок');
    safeSetValue('productOrderButtonText', formData.productOrderButtonText || 'ЗАМОВИТИ');
    safeSetValue('actionChooseText', formData.actionChooseText || 'Обирайте колір або набір');
    safeSetValue('actionPromoText', formData.actionPromoText || 'Діють акційні ціни!');

    // Завантажити дані 5 продуктів

    for (let i = 1; i <= 5; i++) {

      safeSetChecked(`enableProduct${i}`, formData[`enableProduct${i}`]);

      safeSetValue(`product${i}Name`, formData[`product${i}Name`] || '');

      safeSetValue(`product${i}Color`, formData[`product${i}Color`] || '');

      const colorHex = formData[`product${i}ColorHex`] || '';
      safeSetValue(`product${i}ColorHex`, colorHex);
      // Only set ColorHexDisplay for products 1,2 that have the color picker UI
      if (usesColorPickerUI(i)) {
        const displayEl = document.getElementById(`product${i}ColorHexDisplay`);
        if (displayEl) {
          displayEl.value = colorHex;
        }
      }

      const sizes = formData[`product${i}Size`] || '';
      setSelectedSizes(i, sizes);

      safeSetValue(`product${i}Material`, formData[`product${i}Material`] || '');

      safeSetValue(`product${i}PriceOld`, formData[`product${i}PriceOld`] || '');

      safeSetValue(`product${i}Price`, formData[`product${i}Price`] || '');



      // Завантажити фото продукту

      console.log(`🔍 Product ${i} Images з конфігу:`, formData[`product${i}Images`]);

      if (formData[`product${i}Images`] && Array.isArray(formData[`product${i}Images`])) {

        console.log(`📸 Завантаження фото для Product ${i}, кількість: ${formData[`product${i}Images`].length}`);

        if (i === 1) {
          product1Images = formData[`product1Images`];
          console.log(`🔄 Викликається renderProduct1Images, масив:`, product1Images);
          renderProduct1Images();
        } else if (i === 2) {
          product2Images = formData[`product2Images`];
          renderProductImages(i);
        } else if (i === 3) {
          product3Images = formData[`product3Images`];
          renderProductImages(i);
        } else if (i === 4) {
          product4Images = formData[`product4Images`];
          renderProductImages(i);
        } else if (i === 5) {
          product5Images = formData[`product5Images`];
          renderProductImages(i);
        }

      } else {
        console.log(`⚠️ Product ${i}: фото відсутні або некоректний формат`);
      }

    }

    // Завантажити дані для маркетингових продуктів (product8, product9)
    safeSetChecked('enableProduct8', formData.enableProduct8);
    safeSetValue('product8Name', formData.product8Name || '');
    safeSetValue('product8Color', formData.product8Color || '');

    const colorHex8 = formData.product8ColorHex || '';
    safeSetValue('product8ColorHex', colorHex8);
    const displayEl8 = document.getElementById('product8ColorHexDisplay');
    if (displayEl8) {
      displayEl8.value = colorHex8;
    }

    const sizes8 = formData.product8Size || '';
    setSelectedSizes(8, sizes8);
    safeSetValue('product8Material', formData.product8Material || '');
    safeSetValue('product8PriceOld', formData.product8PriceOld || '');
    safeSetValue('product8Price', formData.product8Price || '');

    if (formData.product8Images && Array.isArray(formData.product8Images)) {
      product8Images = formData.product8Images;
      renderProductImages(8);
    }

    safeSetChecked('enableProduct9', formData.enableProduct9);
    safeSetValue('product9Name', formData.product9Name || '');
    safeSetValue('product9Color', formData.product9Color || '');

    const colorHex9 = formData.product9ColorHex || '';
    safeSetValue('product9ColorHex', colorHex9);
    const displayEl9 = document.getElementById('product9ColorHexDisplay');
    if (displayEl9) {
      displayEl9.value = colorHex9;
    }

    const sizes9 = formData.product9Size || '';
    setSelectedSizes(9, sizes9);
    safeSetValue('product9Material', formData.product9Material || '');
    safeSetValue('product9PriceOld', formData.product9PriceOld || '');
    safeSetValue('product9Price', formData.product9Price || '');

    if (formData.product9Images && Array.isArray(formData.product9Images)) {
      product9Images = formData.product9Images;
      renderProductImages(9);
    }

    // Завантажити переваги

    if (formData.benefits) {

      initBenefitsForm(formData.benefits);

    }

    // Завантажити дані TABS секції
    safeSetChecked('enableTabs', formData.enableTabs);
    safeSetValue('tabsLabel', formData.tabsLabel || '');
    safeSetValue('tabsTitle', formData.tabsTitle || '');

    // Tab 1
    safeSetChecked('enableTabItem1', formData.enableTabItem1);
    safeSetValue('tab1Title', formData.tab1Title || '');
    safeSetValue('tab1Description', formData.tab1Description || '');
    safeSetValue('tab1ImageDesktop', formData.tab1ImageDesktop || '');
    safeSetValue('tab1ImageMobile', formData.tab1ImageMobile || '');

    // Tab 2
    safeSetChecked('enableTabItem2', formData.enableTabItem2);
    safeSetValue('tab2Title', formData.tab2Title || '');
    safeSetValue('tab2Description', formData.tab2Description || '');
    safeSetValue('tab2ImageDesktop', formData.tab2ImageDesktop || '');
    safeSetValue('tab2ImageMobile', formData.tab2ImageMobile || '');

    // Tab 3
    safeSetChecked('enableTabItem3', formData.enableTabItem3);
    safeSetValue('tab3Title', formData.tab3Title || '');
    safeSetValue('tab3Description', formData.tab3Description || '');
    safeSetValue('tab3ImageDesktop', formData.tab3ImageDesktop || '');
    safeSetValue('tab3ImageMobile', formData.tab3ImageMobile || '');

    // SalesDrive integration
    safeSetChecked('enableSalesDrive', formData.enableSalesDrive || false);
    safeSetValue('salesDriveApiKey', formData.salesDriveApiKey || '');
    safeSetValue('salesDriveStreamId', formData.salesDriveStreamId || '');
    safeSetValue('salesDriveOfferId', formData.salesDriveOfferId || '');
    safeSetValue('salesDriveWebmasterId', formData.salesDriveWebmasterId || '');

    // Section visibility checkboxes
    safeSetChecked('enableComments', formData.enableComments !== undefined ? formData.enableComments : true);
    safeSetChecked('enableReviews', formData.enableReviews !== undefined ? formData.enableReviews : false);
    safeSetChecked('enableFaq', formData.enableFaq !== undefined ? formData.enableFaq : true);
    safeSetChecked('enableHow', formData.enableHow !== undefined ? formData.enableHow : true);
    safeSetChecked('enableRequest', formData.enableRequest !== undefined ? formData.enableRequest : true);

    // Comments section fields
    safeSetValue('commentsLabel', formData.commentsLabel || 'Відгуки');
    safeSetValue('commentsTitle', formData.commentsTitle || 'Піклуємось про кожного.');
    safeSetValue('commentsSalesStat', formData.commentsSalesStat || '> 3500');
    safeSetValue('commentsSalesText', formData.commentsSalesText || 'продажів');
    safeSetValue('commentsSatisfiedStat', formData.commentsSatisfiedStat || '98%');
    safeSetValue('commentsSatisfiedText', formData.commentsSatisfiedText || 'задоволених клієнтів');
    safeSetValue('commentsRepeatStat', formData.commentsRepeatStat || '48%');
    safeSetValue('commentsRepeatText', formData.commentsRepeatText || 'вже повторно зробили замовлення для себе або близьких');
    safeSetValue('commentsButtonText', formData.commentsButtonText || 'ЗАМОВИТИ');

    // Reviews section fields
    safeSetValue('reviewsLabel', formData.reviewsLabel || 'Відгуки клієнтів');
    safeSetValue('reviewsTitle', formData.reviewsTitle || 'Що кажуть наші клієнти');
    safeSetValue('review1Name', formData.review1Name || '');
    safeSetValue('review1Text', formData.review1Text || '');
    safeSetValue('review1Image', formData.review1Image || '');
    safeSetValue('review2Name', formData.review2Name || '');
    safeSetValue('review2Text', formData.review2Text || '');
    safeSetValue('review2Image', formData.review2Image || '');
    safeSetValue('review3Name', formData.review3Name || '');
    safeSetValue('review3Text', formData.review3Text || '');
    safeSetValue('review3Image', formData.review3Image || '');
    safeSetValue('review4Name', formData.review4Name || '');
    safeSetValue('review4Text', formData.review4Text || '');
    safeSetValue('review4Image', formData.review4Image || '');

    // FAQ section fields
    safeSetValue('faqLabel', formData.faqLabel || 'Доставка і оплата');
    safeSetValue('faqTitle', formData.faqTitle || 'Швидко, зручно, надійно.');
    safeSetValue('faq1Question', formData.faq1Question || 'Доставка');
    safeSetValue('faq1Answer', formData.faq1Answer || '');
    safeSetValue('faq2Question', formData.faq2Question || 'Оплата');
    safeSetValue('faq2Answer', formData.faq2Answer || '');
    safeSetValue('faq3Question', formData.faq3Question || 'Надійність');
    safeSetValue('faq3Answer', formData.faq3Answer || '');
    safeSetValue('faq4Question', formData.faq4Question || 'Наші партнери');
    safeSetValue('faq4Answer', formData.faq4Answer || '');

    // How to buy section fields
    safeSetValue('howLabel', formData.howLabel || 'Як придбати футболки?');
    safeSetValue('howTitle', formData.howTitle || 'Лише декілька простих кроків');
    safeSetValue('howStep1', formData.howStep1 || 'Залиште заявку на обрані Вами футболки');
    safeSetValue('howStep2', formData.howStep2 || 'Ми Вам швидко зателефонуємо');
    safeSetValue('howStep3', formData.howStep3 || 'Доставимо за 1-2 дні');
    safeSetValue('howStep4', formData.howStep4 || 'Сплачуйте при отриманні');

    // Request form section fields
    safeSetValue('requestTitle', formData.requestTitle || 'Жіночі футболки оверсайз');
    safeSetValue('requestTimerText', formData.requestTimerText || 'До кінця акції залишилося');
    safeSetValue('requestInfoTitle', formData.requestInfoTitle || 'Залиште заявку');
    safeSetValue('requestInfoDescription', formData.requestInfoDescription || 'Якщо бажаєте замовити або потрібна наша допомога');
    safeSetValue('requestNamePlaceholder', formData.requestNamePlaceholder || 'Введіть Ваше ім`я');
    safeSetValue('requestPhonePlaceholder', formData.requestPhonePlaceholder || 'Введіть Ваш номер телефона');
    safeSetValue('requestPhoneFormat', formData.requestPhoneFormat || 'Формат телефона: <b>380999999999</b>');
    safeSetValue('requestButtonText', formData.requestButtonText || 'ЗАМОВИТИ');
    safeSetValue('requestStockPrefix', formData.requestStockPrefix || 'Залишилось');
    safeSetValue('requestStockSuffix', formData.requestStockSuffix || 'футболок по акції');

    console.log('📂 Завантажені збережені значення:', formData);

    // Активувати кнопку "Зберегти" після успішного завантаження
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.title = 'Зберегти зміни в конфігурацію';
    }

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

  if (!previewDiv || !previewImg) return;

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
  const previewImg = document.getElementById('videoThumbnailPreviewImg');
  const previewEmpty = document.getElementById('videoThumbnailPreviewEmpty');

  if (!previewImg || !previewEmpty) return;

  if (!imagePath) {
    previewImg.style.display = 'none';
    previewEmpty.style.display = 'block';
    if (previewImg.getAttribute('src')) {
      previewImg.removeAttribute('src');
    }
    return;
  }

  previewImg.src = imagePath;
  previewImg.alt = "Прев'ю відео";
  previewImg.style.display = 'block';
  previewEmpty.style.display = 'none';
}




// Обробка завантаження фото

const heroImageEl = document.getElementById('heroImage');
if (heroImageEl) {
  heroImageEl.addEventListener('change', async function(e) {

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
}



// Обробка завантаження фото для plus-logo блоку

const imageUploadEl = document.getElementById('imageUpload');
if (imageUploadEl) {
  imageUploadEl.addEventListener('change', async function(e) {

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
}

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
    sizeChartImage: sizeChartImageValue,

    // Info list (product characteristics)
    infoEnableBrand: document.getElementById('infoEnableBrand').checked ? 'on' : 'off',
    infoBrandLabel: document.getElementById('infoBrandLabel').value,
    infoBrandValue: document.getElementById('infoBrandValue').value,
    infoEnableModel: document.getElementById('infoEnableModel').checked ? 'on' : 'off',
    infoModelLabel: document.getElementById('infoModelLabel').value,
    infoModelValue: document.getElementById('infoModelValue').value,
    infoEnableQuantity: document.getElementById('infoEnableQuantity').checked ? 'on' : 'off',
    infoQuantityLabel: document.getElementById('infoQuantityLabel').value,
    infoQuantityValue: document.getElementById('infoQuantityValue').value,
    infoEnableColors: document.getElementById('infoEnableColors').checked ? 'on' : 'off',
    infoColorsLabel: document.getElementById('infoColorsLabel').value,
    infoEnableSizes: document.getElementById('infoEnableSizes').checked ? 'on' : 'off',
    infoSizesLabel: document.getElementById('infoSizesLabel').value,
    infoSizesValue: document.getElementById('infoSizesValue').value,
    infoEnableMaterial: document.getElementById('infoEnableMaterial').checked ? 'on' : 'off',
    infoMaterialLabel: document.getElementById('infoMaterialLabel').value,
    infoMaterialValue: document.getElementById('infoMaterialValue').value,
    infoEnablePackaging: document.getElementById('infoEnablePackaging').checked ? 'on' : 'off',
    infoPackagingLabel: document.getElementById('infoPackagingLabel').value,
    infoPackagingValue: document.getElementById('infoPackagingValue').value,

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

    product5Images: JSON.stringify(product5Images),

    // Marketing products (bundles)
    product8Name: document.getElementById('product8Name').value,
    product8Color: document.getElementById('product8Color').value,
    product8ColorHex: document.getElementById('product8ColorHex').value,
    product8Size: getSelectedSizesAsString(8),
    product8Material: document.getElementById('product8Material').value,
    product8PriceOld: document.getElementById('product8PriceOld').value,
    product8Price: document.getElementById('product8Price').value,
    enableProduct8: document.getElementById('enableProduct8').checked ? 'on' : 'off',
    product8Images: JSON.stringify(product8Images),

    product9Name: document.getElementById('product9Name').value,
    product9Color: document.getElementById('product9Color').value,
    product9ColorHex: document.getElementById('product9ColorHex').value,
    product9Size: getSelectedSizesAsString(9),
    product9Material: document.getElementById('product9Material').value,
    product9PriceOld: document.getElementById('product9PriceOld').value,
    product9Price: document.getElementById('product9Price').value,
    enableProduct9: document.getElementById('enableProduct9').checked ? 'on' : 'off',
    product9Images: JSON.stringify(product9Images)

  });



  return params.toString();

}



function previewSite() {
  // Use POST instead of GET to avoid URL length limits
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/generate';
  form.target = '_blank';
  form.style.display = 'none';

  // Get all form data as URLSearchParams
  const params = new URLSearchParams(getFormParams());

  // Add each parameter as hidden input
  for (const [key, value] of params) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}



const constructorFormEl = document.getElementById('constructorForm');
if (constructorFormEl) {
  constructorFormEl.addEventListener('submit', function(e) {

    e.preventDefault();

    const params = getFormParams();

    window.location.href = '/export?' + params;

  });
}

