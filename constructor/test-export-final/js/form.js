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
  // Капіталізуємо перший символ для tabs -> Tabs
  const suffix = typeof productNum === 'string' ? productNum.charAt(0).toUpperCase() + productNum.slice(1) : productNum;
  const content = document.getElementById(`productContent${suffix}`);
  const chevron = document.getElementById(`chevron${suffix}`);

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

document.addEventListener('DOMContentLoaded', function() {

  // Спочатку завантажуємо оригінальні значення

  fetch('/api/get-user-config')

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

      // Завантажити дані інформаційного блоку (Info section)
      if (data.infoEnableBrand !== undefined) document.getElementById('infoEnableBrand').checked = data.infoEnableBrand;
      if (data.infoBrandLabel) document.getElementById('infoBrandLabel').value = data.infoBrandLabel;
      if (data.infoBrandValue) document.getElementById('infoBrandValue').value = data.infoBrandValue;

      if (data.infoEnableModel !== undefined) document.getElementById('infoEnableModel').checked = data.infoEnableModel;
      if (data.infoModelLabel) document.getElementById('infoModelLabel').value = data.infoModelLabel;
      if (data.infoModelValue) document.getElementById('infoModelValue').value = data.infoModelValue;

      if (data.infoEnableQuantity !== undefined) document.getElementById('infoEnableQuantity').checked = data.infoEnableQuantity;
      if (data.infoQuantityLabel) document.getElementById('infoQuantityLabel').value = data.infoQuantityLabel;
      if (data.infoQuantityValue) document.getElementById('infoQuantityValue').value = data.infoQuantityValue;

      if (data.infoEnableColors !== undefined) document.getElementById('infoEnableColors').checked = data.infoEnableColors;
      if (data.infoColorsLabel) document.getElementById('infoColorsLabel').value = data.infoColorsLabel;

      if (data.infoEnableSizes !== undefined) document.getElementById('infoEnableSizes').checked = data.infoEnableSizes;
      if (data.infoSizesLabel) document.getElementById('infoSizesLabel').value = data.infoSizesLabel;
      if (data.infoSizesValue) document.getElementById('infoSizesValue').value = data.infoSizesValue;

      if (data.infoEnableMaterial !== undefined) document.getElementById('infoEnableMaterial').checked = data.infoEnableMaterial;
      if (data.infoMaterialLabel) document.getElementById('infoMaterialLabel').value = data.infoMaterialLabel;
      if (data.infoMaterialValue) document.getElementById('infoMaterialValue').value = data.infoMaterialValue;

      if (data.infoEnablePackaging !== undefined) document.getElementById('infoEnablePackaging').checked = data.infoEnablePackaging;
      if (data.infoPackagingLabel) document.getElementById('infoPackagingLabel').value = data.infoPackagingLabel;
      if (data.infoPackagingValue) document.getElementById('infoPackagingValue').value = data.infoPackagingValue;

      // Завантажити дані для маркетингових продуктів (product8, product9)
      if (data.enableProduct8 !== undefined) document.getElementById('enableProduct8').checked = data.enableProduct8;
      if (data.product8Name) document.getElementById('product8Name').value = data.product8Name;
      if (data.product8Color) document.getElementById('product8Color').value = data.product8Color;
      if (data.product8ColorHex) {
        document.getElementById('product8ColorHex').value = data.product8ColorHex;
        const displayEl8 = document.getElementById('product8ColorHexDisplay');
        if (displayEl8) displayEl8.value = data.product8ColorHex;
      }
      if (data.product8Size) setSelectedSizes(8, data.product8Size);
      if (data.product8Material) document.getElementById('product8Material').value = data.product8Material;
      if (data.product8PriceOld) document.getElementById('product8PriceOld').value = data.product8PriceOld;
      if (data.product8Price) document.getElementById('product8Price').value = data.product8Price;
      if (data.product8Images && Array.isArray(data.product8Images)) {
        product8Images = data.product8Images;
        renderProductImages(8);
      }

      if (data.enableProduct9 !== undefined) document.getElementById('enableProduct9').checked = data.enableProduct9;
      if (data.product9Name) document.getElementById('product9Name').value = data.product9Name;
      if (data.product9Color) document.getElementById('product9Color').value = data.product9Color;
      if (data.product9ColorHex) {
        document.getElementById('product9ColorHex').value = data.product9ColorHex;
        const displayEl9 = document.getElementById('product9ColorHexDisplay');
        if (displayEl9) displayEl9.value = data.product9ColorHex;
      }
      if (data.product9Size) setSelectedSizes(9, data.product9Size);
      if (data.product9Material) document.getElementById('product9Material').value = data.product9Material;
      if (data.product9PriceOld) document.getElementById('product9PriceOld').value = data.product9PriceOld;
      if (data.product9Price) document.getElementById('product9Price').value = data.product9Price;
      if (data.product9Images && Array.isArray(data.product9Images)) {
        product9Images = data.product9Images;
        renderProductImages(9);
      }

      // Завантажити Tabs section
      if (data.enableTabs !== undefined) document.getElementById('enableTabs').checked = data.enableTabs;
      if (data.tabsLabel) document.getElementById('tabsLabel').value = data.tabsLabel;
      if (data.tabsTitle) document.getElementById('tabsTitle').value = data.tabsTitle;

      if (data.enableTabItem1 !== undefined) document.getElementById('enableTabItem1').checked = data.enableTabItem1;
      if (data.tab1Title) document.getElementById('tab1Title').value = data.tab1Title;
      if (data.tab1Description) document.getElementById('tab1Description').value = data.tab1Description;
      if (data.tab1Image) {
        document.getElementById('tab1Image').value = data.tab1Image;
        document.getElementById('tab1Preview').innerHTML = `<img src="${data.tab1Image}" style="max-width: 200px; max-height: 150px;"><p>${data.tab1Image}</p>`;
      }

      if (data.enableTabItem2 !== undefined) document.getElementById('enableTabItem2').checked = data.enableTabItem2;
      if (data.tab2Title) document.getElementById('tab2Title').value = data.tab2Title;
      if (data.tab2Description) document.getElementById('tab2Description').value = data.tab2Description;
      if (data.tab2Image) {
        document.getElementById('tab2Image').value = data.tab2Image;
        document.getElementById('tab2Preview').innerHTML = `<img src="${data.tab2Image}" style="max-width: 200px; max-height: 150px;"><p>${data.tab2Image}</p>`;
      }

      if (data.enableTabItem3 !== undefined) document.getElementById('enableTabItem3').checked = data.enableTabItem3;
      if (data.tab3Title) document.getElementById('tab3Title').value = data.tab3Title;
      if (data.tab3Description) document.getElementById('tab3Description').value = data.tab3Description;
      if (data.tab3Image) {
        document.getElementById('tab3Image').value = data.tab3Image;
        document.getElementById('tab3Preview').innerHTML = `<img src="${data.tab3Image}" style="max-width: 200px; max-height: 150px;"><p>${data.tab3Image}</p>`;
      }

      // Завантажити FAQ section
      if (data.enableFaq !== undefined) document.getElementById('enableFaq').checked = data.enableFaq;
      if (data.faqLabel) document.getElementById('faqLabel').value = data.faqLabel;
      if (data.faqTitle) document.getElementById('faqTitle').value = data.faqTitle;
      if (data.faqImage) {
        document.getElementById('faqImage').value = data.faqImage;
        document.getElementById('faqPreview').innerHTML = `<img src="${data.faqImage}" style="max-width: 200px; max-height: 150px;"><p>${data.faqImage}</p>`;
      }

      if (data.enableFaqItem1 !== undefined) document.getElementById('enableFaqItem1').checked = data.enableFaqItem1;
      if (data.faqItem1Title) document.getElementById('faqItem1Title').value = data.faqItem1Title;
      if (data.faqItem1Description) document.getElementById('faqItem1Description').value = data.faqItem1Description;

      if (data.enableFaqItem2 !== undefined) document.getElementById('enableFaqItem2').checked = data.enableFaqItem2;
      if (data.faqItem2Title) document.getElementById('faqItem2Title').value = data.faqItem2Title;
      if (data.faqItem2Description) document.getElementById('faqItem2Description').value = data.faqItem2Description;

      if (data.enableFaqItem3 !== undefined) document.getElementById('enableFaqItem3').checked = data.enableFaqItem3;
      if (data.faqItem3Title) document.getElementById('faqItem3Title').value = data.faqItem3Title;
      if (data.faqItem3Description) document.getElementById('faqItem3Description').value = data.faqItem3Description;

      if (data.enableFaqItem4 !== undefined) document.getElementById('enableFaqItem4').checked = data.enableFaqItem4;
      if (data.faqItem4Title) document.getElementById('faqItem4Title').value = data.faqItem4Title;
      if (data.faqItem4Description) document.getElementById('faqItem4Description').value = data.faqItem4Description;

      // Завантажити How To Buy section
      if (data.enableHow !== undefined) document.getElementById('enableHow').checked = data.enableHow;
      if (data.howLabel) document.getElementById('howLabel').value = data.howLabel;
      if (data.howTitle) document.getElementById('howTitle').value = data.howTitle;
      if (data.howStep1) document.getElementById('howStep1').value = data.howStep1;
      if (data.howStep2) document.getElementById('howStep2').value = data.howStep2;
      if (data.howStep3) document.getElementById('howStep3').value = data.howStep3;
      if (data.howStep4) document.getElementById('howStep4').value = data.howStep4;

      // Завантажити Request Form section
      if (data.requestInfoTitle) {
        document.getElementById('requestInfoTitle').value = data.requestInfoTitle;
      }
      if (data.requestInfoDescription) {
        document.getElementById('requestInfoDescription').value = data.requestInfoDescription;
      }
      if (data.requestButtonText) {
        document.getElementById('requestButtonText').value = data.requestButtonText;
      }
      if (data.requestNamePlaceholder) {
        document.getElementById('requestNamePlaceholder').value = data.requestNamePlaceholder;
      }
      if (data.requestPhonePlaceholder) {
        document.getElementById('requestPhonePlaceholder').value = data.requestPhonePlaceholder;
      }

      // Завантажити Popup section
      if (data.enableAutoPopup !== undefined) {
        document.getElementById('enableAutoPopup').checked = data.enableAutoPopup;
      }
      if (data.autoPopupDelay !== undefined) {
        document.getElementById('autoPopupDelay').value = data.autoPopupDelay;
      }
      if (data.popupLabel) {
        document.getElementById('popupLabel').value = data.popupLabel;
      }
      if (data.popupTitle) {
        document.getElementById('popupTitle').value = data.popupTitle;
      }
      if (data.popupButtonText) {
        document.getElementById('popupButtonText').value = data.popupButtonText;
      }
      if (data.popupSuccessMessage) {
        document.getElementById('popupSuccessMessage').value = data.popupSuccessMessage;
      }
      if (data.popupNamePlaceholder) {
        document.getElementById('popupNamePlaceholder').value = data.popupNamePlaceholder;
      }
      if (data.popupPhonePlaceholder) {
        document.getElementById('popupPhonePlaceholder').value = data.popupPhonePlaceholder;
      }

      // Завантажити Footer section
      if (data.footerCopyright) {
        document.getElementById('footerCopyright').value = data.footerCopyright;
      }
      if (data.footerLink1) {
        document.getElementById('footerLink1').value = data.footerLink1;
      }
      if (data.footerLink2) {
        document.getElementById('footerLink2').value = data.footerLink2;
      }
      if (data.footerLink3) {
        document.getElementById('footerLink3').value = data.footerLink3;
      }

      // Завантажити Integrations section
      if (data.salesdriveApiKey) {
        document.getElementById('salesdriveApiKey').value = data.salesdriveApiKey;
      }
      if (data.salesdriveEndpoint) {
        document.getElementById('salesdriveEndpoint').value = data.salesdriveEndpoint;
      }
      if (data.salesdriveFunnelId) {
        document.getElementById('salesdriveFunnelId').value = data.salesdriveFunnelId;
      }
      if (data.metaPixelId) {
        document.getElementById('metaPixelId').value = data.metaPixelId;
      }
      if (data.metaAccessToken) {
        document.getElementById('metaAccessToken').value = data.metaAccessToken;
      }
      if (data.metaTestEventCode) {
        document.getElementById('metaTestEventCode').value = data.metaTestEventCode;
      }
      if (data.productId) {
        document.getElementById('productId').value = data.productId;
      }
      if (data.sku) {
        document.getElementById('sku').value = data.sku;
      }
      if (data.website) {
        document.getElementById('website').value = data.website;
      }

      // Завантажити Comments section
      if (data.enableComments !== undefined) {
        document.getElementById('enableComments').checked = data.enableComments;
      }
      if (data.commentsLabel) {
        document.getElementById('commentsLabel').value = data.commentsLabel;
      }
      if (data.commentsTitle) {
        document.getElementById('commentsTitle').value = data.commentsTitle;
      }
      if (data.commentsSalesStat) {
        document.getElementById('commentsSalesStat').value = data.commentsSalesStat;
      }
      if (data.commentsSalesText) {
        document.getElementById('commentsSalesText').value = data.commentsSalesText;
      }
      if (data.commentsSatisfiedStat) {
        document.getElementById('commentsSatisfiedStat').value = data.commentsSatisfiedStat;
      }
      if (data.commentsSatisfiedText) {
        document.getElementById('commentsSatisfiedText').value = data.commentsSatisfiedText;
      }
      if (data.commentsRepeatStat) {
        document.getElementById('commentsRepeatStat').value = data.commentsRepeatStat;
      }
      if (data.commentsRepeatText) {
        document.getElementById('commentsRepeatText').value = data.commentsRepeatText;
      }

      // Load comments images
      if (data.commentsImages && Array.isArray(data.commentsImages)) {
        window.commentsImages = data.commentsImages;
        if (typeof renderCommentsImagesList === 'function') {
          renderCommentsImagesList();
        }
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

      // Встановити слухачі для product8 та product9
      [8, 9].forEach(i => {
        const colorInput = document.getElementById(`product${i}ColorHex`);
        if (colorInput) {
          colorInput.addEventListener('input', function() {
            syncColorPickerDisplay(i);
          });
        }
      });

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

    sizeChartImage: sizeChartImageValue,

    // Info list (product characteristics)
    infoEnableBrand: document.getElementById('infoEnableBrand').checked,
    infoBrandLabel: document.getElementById('infoBrandLabel').value,
    infoBrandValue: document.getElementById('infoBrandValue').value,
    infoEnableModel: document.getElementById('infoEnableModel').checked,
    infoModelLabel: document.getElementById('infoModelLabel').value,
    infoModelValue: document.getElementById('infoModelValue').value,
    infoEnableQuantity: document.getElementById('infoEnableQuantity').checked,
    infoQuantityLabel: document.getElementById('infoQuantityLabel').value,
    infoQuantityValue: document.getElementById('infoQuantityValue').value,
    infoEnableColors: document.getElementById('infoEnableColors').checked,
    infoColorsLabel: document.getElementById('infoColorsLabel').value,
    infoEnableSizes: document.getElementById('infoEnableSizes').checked,
    infoSizesLabel: document.getElementById('infoSizesLabel').value,
    infoSizesValue: document.getElementById('infoSizesValue').value,
    infoEnableMaterial: document.getElementById('infoEnableMaterial').checked,
    infoMaterialLabel: document.getElementById('infoMaterialLabel').value,
    infoMaterialValue: document.getElementById('infoMaterialValue').value,
    infoEnablePackaging: document.getElementById('infoEnablePackaging').checked,
    infoPackagingLabel: document.getElementById('infoPackagingLabel').value,
    infoPackagingValue: document.getElementById('infoPackagingValue').value,

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

    product5Images: product5Images,

    // Marketing products (bundles)
    product8Name: document.getElementById('product8Name').value,
    product8Color: document.getElementById('product8Color').value,
    product8ColorHex: document.getElementById('product8ColorHex').value,
    product8Size: getSelectedSizesAsString(8),
    product8Material: document.getElementById('product8Material').value,
    product8PriceOld: document.getElementById('product8PriceOld').value,
    product8Price: document.getElementById('product8Price').value,
    enableProduct8: document.getElementById('enableProduct8').checked,
    product8Images: product8Images,

    product9Name: document.getElementById('product9Name').value,
    product9Color: document.getElementById('product9Color').value,
    product9ColorHex: document.getElementById('product9ColorHex').value,
    product9Size: getSelectedSizesAsString(9),
    product9Material: document.getElementById('product9Material').value,
    product9PriceOld: document.getElementById('product9PriceOld').value,
    product9Price: document.getElementById('product9Price').value,
    enableProduct9: document.getElementById('enableProduct9').checked,
    product9Images: product9Images,

    // Tabs section
    enableTabs: document.getElementById('enableTabs').checked,
    tabsLabel: document.getElementById('tabsLabel').value,
    tabsTitle: document.getElementById('tabsTitle').value,
    enableTabItem1: document.getElementById('enableTabItem1').checked,
    tab1Title: document.getElementById('tab1Title').value,
    tab1Description: document.getElementById('tab1Description').value,
    tab1Image: document.getElementById('tab1Image').value,
    enableTabItem2: document.getElementById('enableTabItem2').checked,
    tab2Title: document.getElementById('tab2Title').value,
    tab2Description: document.getElementById('tab2Description').value,
    tab2Image: document.getElementById('tab2Image').value,
    enableTabItem3: document.getElementById('enableTabItem3').checked,
    tab3Title: document.getElementById('tab3Title').value,
    tab3Description: document.getElementById('tab3Description').value,
    tab3Image: document.getElementById('tab3Image').value,

    // FAQ section
    enableFaq: document.getElementById('enableFaq').checked,
    faqLabel: document.getElementById('faqLabel').value,
    faqTitle: document.getElementById('faqTitle').value,
    faqImage: document.getElementById('faqImage').value,
    enableFaqItem1: document.getElementById('enableFaqItem1').checked,
    faqItem1Title: document.getElementById('faqItem1Title').value,
    faqItem1Description: document.getElementById('faqItem1Description').value,
    enableFaqItem2: document.getElementById('enableFaqItem2').checked,
    faqItem2Title: document.getElementById('faqItem2Title').value,
    faqItem2Description: document.getElementById('faqItem2Description').value,
    enableFaqItem3: document.getElementById('enableFaqItem3').checked,
    faqItem3Title: document.getElementById('faqItem3Title').value,
    faqItem3Description: document.getElementById('faqItem3Description').value,
    enableFaqItem4: document.getElementById('enableFaqItem4').checked,
    faqItem4Title: document.getElementById('faqItem4Title').value,
    faqItem4Description: document.getElementById('faqItem4Description').value,

    // How To Buy section
    enableHow: document.getElementById('enableHow').checked,
    howLabel: document.getElementById('howLabel').value,
    howTitle: document.getElementById('howTitle').value,
    howStep1: document.getElementById('howStep1').value,
    howStep2: document.getElementById('howStep2').value,
    howStep3: document.getElementById('howStep3').value,
    howStep4: document.getElementById('howStep4').value,

    // Comments section
    enableComments: document.getElementById('enableComments').checked,
    commentsLabel: document.getElementById('commentsLabel').value,
    commentsTitle: document.getElementById('commentsTitle').value,
    commentsSalesStat: document.getElementById('commentsSalesStat').value,
    commentsSalesText: document.getElementById('commentsSalesText').value,
    commentsSatisfiedStat: document.getElementById('commentsSatisfiedStat').value,
    commentsSatisfiedText: document.getElementById('commentsSatisfiedText').value,
    commentsRepeatStat: document.getElementById('commentsRepeatStat').value,
    commentsRepeatText: document.getElementById('commentsRepeatText').value,
    commentsImages: window.commentsImages || [],

    // Request Form section
    requestInfoTitle: document.getElementById('requestInfoTitle').value,
    requestInfoDescription: document.getElementById('requestInfoDescription').value,
    requestButtonText: document.getElementById('requestButtonText').value,
    requestNamePlaceholder: document.getElementById('requestNamePlaceholder').value,
    requestPhonePlaceholder: document.getElementById('requestPhonePlaceholder').value,

    // Popup section
    enableAutoPopup: document.getElementById('enableAutoPopup').checked,
    autoPopupDelay: document.getElementById('autoPopupDelay').value || 350,
    popupLabel: document.getElementById('popupLabel').value,
    popupTitle: document.getElementById('popupTitle').value,
    popupButtonText: document.getElementById('popupButtonText').value,
    popupSuccessMessage: document.getElementById('popupSuccessMessage').value,
    popupNamePlaceholder: document.getElementById('popupNamePlaceholder').value,
    popupPhonePlaceholder: document.getElementById('popupPhonePlaceholder').value,

    // Footer section
    footerCopyright: document.getElementById('footerCopyright').value,
    footerLink1: document.getElementById('footerLink1').value,
    footerLink2: document.getElementById('footerLink2').value,
    footerLink3: document.getElementById('footerLink3').value,

    // Integrations section
    salesdriveApiKey: document.getElementById('salesdriveApiKey').value,
    salesdriveEndpoint: document.getElementById('salesdriveEndpoint').value,
    salesdriveFunnelId: document.getElementById('salesdriveFunnelId').value,
    metaPixelId: document.getElementById('metaPixelId').value,
    metaAccessToken: document.getElementById('metaAccessToken').value,
    metaTestEventCode: document.getElementById('metaTestEventCode').value,
    productId: document.getElementById('productId').value,
    sku: document.getElementById('sku').value,
    website: document.getElementById('website').value

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

    // Завантажити фото розмірної сітки
    sizeChartImageValue = formData.sizeChartImage || 'img/info/info-1.webp';
    if (formData.sizeChartImage) {
      const previewContainer = document.getElementById('sizeChartImagePreview');
      const previewImg = document.getElementById('previewSizeChartImage');
      const statusText = document.getElementById('sizeChartUploadStatus');

      previewImg.src = formData.sizeChartImage;
      previewContainer.style.display = 'block';
      statusText.textContent = '✅ Завантажено з конфігурації';
      statusText.style.color = '#27ae60';
    }

    // Завантажити дані інформаційного блоку
    document.getElementById('infoEnableBrand').checked = formData.infoEnableBrand !== false;
    document.getElementById('infoBrandLabel').value = formData.infoBrandLabel || 'Бренд';
    document.getElementById('infoBrandValue').value = formData.infoBrandValue || 'Kopo™ (Україна)';

    document.getElementById('infoEnableModel').checked = formData.infoEnableModel !== false;
    document.getElementById('infoModelLabel').value = formData.infoModelLabel || 'Модель';
    document.getElementById('infoModelValue').value = formData.infoModelValue || 'Жіноча';

    document.getElementById('infoEnableQuantity').checked = formData.infoEnableQuantity !== false;
    document.getElementById('infoQuantityLabel').value = formData.infoQuantityLabel || 'Кількість';
    document.getElementById('infoQuantityValue').value = formData.infoQuantityValue || 'Одна футболка або набір';

    document.getElementById('infoEnableColors').checked = formData.infoEnableColors !== false;
    document.getElementById('infoColorsLabel').value = formData.infoColorsLabel || 'Кольори';

    document.getElementById('infoEnableSizes').checked = formData.infoEnableSizes !== false;
    document.getElementById('infoSizesLabel').value = formData.infoSizesLabel || 'Розміри';
    document.getElementById('infoSizesValue').value = formData.infoSizesValue || 'від S до 5XL';

    document.getElementById('infoEnableMaterial').checked = formData.infoEnableMaterial !== false;
    document.getElementById('infoMaterialLabel').value = formData.infoMaterialLabel || 'Матеріал';
    document.getElementById('infoMaterialValue').value = formData.infoMaterialValue || 'Бавовна 95%, еластан 5%';

    document.getElementById('infoEnablePackaging').checked = formData.infoEnablePackaging !== false;
    document.getElementById('infoPackagingLabel').value = formData.infoPackagingLabel || 'Упаковка';
    document.getElementById('infoPackagingValue').value = formData.infoPackagingValue || 'Футболки запаковані у фірмовий пакет. Можлива упаковка у подарункову коробку за додаткову плату.';

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
    document.getElementById('enableProduct8').checked = formData.enableProduct8;
    document.getElementById('product8Name').value = formData.product8Name || '';
    document.getElementById('product8Color').value = formData.product8Color || '';

    const colorHex8 = formData.product8ColorHex || '#000000';
    document.getElementById('product8ColorHex').value = colorHex8;
    const displayEl8 = document.getElementById('product8ColorHexDisplay');
    if (displayEl8) {
      displayEl8.value = colorHex8;
    }

    const sizes8 = formData.product8Size || '';
    setSelectedSizes(8, sizes8);
    document.getElementById('product8Material').value = formData.product8Material || '';
    document.getElementById('product8PriceOld').value = formData.product8PriceOld || '';
    document.getElementById('product8Price').value = formData.product8Price || '';

    if (formData.product8Images && Array.isArray(formData.product8Images)) {
      product8Images = formData.product8Images;
      renderProductImages(8);
    }

    document.getElementById('enableProduct9').checked = formData.enableProduct9;
    document.getElementById('product9Name').value = formData.product9Name || '';
    document.getElementById('product9Color').value = formData.product9Color || '';

    const colorHex9 = formData.product9ColorHex || '#000000';
    document.getElementById('product9ColorHex').value = colorHex9;
    const displayEl9 = document.getElementById('product9ColorHexDisplay');
    if (displayEl9) {
      displayEl9.value = colorHex9;
    }

    const sizes9 = formData.product9Size || '';
    setSelectedSizes(9, sizes9);
    document.getElementById('product9Material').value = formData.product9Material || '';
    document.getElementById('product9PriceOld').value = formData.product9PriceOld || '';
    document.getElementById('product9Price').value = formData.product9Price || '';

    if (formData.product9Images && Array.isArray(formData.product9Images)) {
      product9Images = formData.product9Images;
      renderProductImages(9);
    }

    // Завантажити tabs section
    if (formData.enableTabs !== undefined) {
      document.getElementById('enableTabs').checked = formData.enableTabs === 'on' || formData.enableTabs === true;
    }
    if (formData.tabsLabel) {
      document.getElementById('tabsLabel').value = formData.tabsLabel;
    }
    if (formData.tabsTitle) {
      document.getElementById('tabsTitle').value = formData.tabsTitle;
    }

    // Tab Item 1
    if (formData.enableTabItem1 !== undefined) {
      document.getElementById('enableTabItem1').checked = formData.enableTabItem1 === 'on' || formData.enableTabItem1 === true;
    }
    if (formData.tab1Title) {
      document.getElementById('tab1Title').value = formData.tab1Title;
    }
    if (formData.tab1Description) {
      document.getElementById('tab1Description').value = formData.tab1Description;
    }
    if (formData.tab1Image) {
      document.getElementById('tab1Image').value = formData.tab1Image;
      document.getElementById('tab1Preview').innerHTML = `
        <img src="${formData.tab1Image}" style="max-width: 200px; max-height: 150px;">
        <p>${formData.tab1Image}</p>
      `;
    }

    // Tab Item 2
    if (formData.enableTabItem2 !== undefined) {
      document.getElementById('enableTabItem2').checked = formData.enableTabItem2 === 'on' || formData.enableTabItem2 === true;
    }
    if (formData.tab2Title) {
      document.getElementById('tab2Title').value = formData.tab2Title;
    }
    if (formData.tab2Description) {
      document.getElementById('tab2Description').value = formData.tab2Description;
    }
    if (formData.tab2Image) {
      document.getElementById('tab2Image').value = formData.tab2Image;
      document.getElementById('tab2Preview').innerHTML = `
        <img src="${formData.tab2Image}" style="max-width: 200px; max-height: 150px;">
        <p>${formData.tab2Image}</p>
      `;
    }

    // Tab Item 3
    if (formData.enableTabItem3 !== undefined) {
      document.getElementById('enableTabItem3').checked = formData.enableTabItem3 === 'on' || formData.enableTabItem3 === true;
    }
    if (formData.tab3Title) {
      document.getElementById('tab3Title').value = formData.tab3Title;
    }
    if (formData.tab3Description) {
      document.getElementById('tab3Description').value = formData.tab3Description;
    }
    if (formData.tab3Image) {
      document.getElementById('tab3Image').value = formData.tab3Image;
      document.getElementById('tab3Preview').innerHTML = `
        <img src="${formData.tab3Image}" style="max-width: 200px; max-height: 150px;">
        <p>${formData.tab3Image}</p>
      `;
    }

    // Завантажити FAQ section
    if (formData.enableFaq !== undefined) {
      document.getElementById('enableFaq').checked = formData.enableFaq === 'on' || formData.enableFaq === true;
    }
    if (formData.faqLabel) {
      document.getElementById('faqLabel').value = formData.faqLabel;
    }
    if (formData.faqTitle) {
      document.getElementById('faqTitle').value = formData.faqTitle;
    }
    if (formData.faqImage) {
      document.getElementById('faqImage').value = formData.faqImage;
      document.getElementById('faqPreview').innerHTML = `
        <img src="${formData.faqImage}" style="max-width: 200px; max-height: 150px;">
        <p>${formData.faqImage}</p>
      `;
    }

    // FAQ Items
    if (formData.enableFaqItem1 !== undefined) {
      document.getElementById('enableFaqItem1').checked = formData.enableFaqItem1 === 'on' || formData.enableFaqItem1 === true;
    }
    if (formData.faqItem1Title) {
      document.getElementById('faqItem1Title').value = formData.faqItem1Title;
    }
    if (formData.faqItem1Description) {
      document.getElementById('faqItem1Description').value = formData.faqItem1Description;
    }

    if (formData.enableFaqItem2 !== undefined) {
      document.getElementById('enableFaqItem2').checked = formData.enableFaqItem2 === 'on' || formData.enableFaqItem2 === true;
    }
    if (formData.faqItem2Title) {
      document.getElementById('faqItem2Title').value = formData.faqItem2Title;
    }
    if (formData.faqItem2Description) {
      document.getElementById('faqItem2Description').value = formData.faqItem2Description;
    }

    if (formData.enableFaqItem3 !== undefined) {
      document.getElementById('enableFaqItem3').checked = formData.enableFaqItem3 === 'on' || formData.enableFaqItem3 === true;
    }
    if (formData.faqItem3Title) {
      document.getElementById('faqItem3Title').value = formData.faqItem3Title;
    }
    if (formData.faqItem3Description) {
      document.getElementById('faqItem3Description').value = formData.faqItem3Description;
    }

    if (formData.enableFaqItem4 !== undefined) {
      document.getElementById('enableFaqItem4').checked = formData.enableFaqItem4 === 'on' || formData.enableFaqItem4 === true;
    }
    if (formData.faqItem4Title) {
      document.getElementById('faqItem4Title').value = formData.faqItem4Title;
    }
    if (formData.faqItem4Description) {
      document.getElementById('faqItem4Description').value = formData.faqItem4Description;
    }

    // Завантажити How To Buy section
    if (formData.enableHow !== undefined) {
      document.getElementById('enableHow').checked = formData.enableHow === 'on' || formData.enableHow === true;
    }
    if (formData.howLabel) {
      document.getElementById('howLabel').value = formData.howLabel;
    }
    if (formData.howTitle) {
      document.getElementById('howTitle').value = formData.howTitle;
    }
    if (formData.howStep1) {
      document.getElementById('howStep1').value = formData.howStep1;
    }
    if (formData.howStep2) {
      document.getElementById('howStep2').value = formData.howStep2;
    }
    if (formData.howStep3) {
      document.getElementById('howStep3').value = formData.howStep3;
    }
    if (formData.howStep4) {
      document.getElementById('howStep4').value = formData.howStep4;
    }

    // Завантажити Request Form section
    if (formData.requestInfoTitle) {
      document.getElementById('requestInfoTitle').value = formData.requestInfoTitle;
    }
    if (formData.requestInfoDescription) {
      document.getElementById('requestInfoDescription').value = formData.requestInfoDescription;
    }
    if (formData.requestButtonText) {
      document.getElementById('requestButtonText').value = formData.requestButtonText;
    }
    if (formData.requestNamePlaceholder) {
      document.getElementById('requestNamePlaceholder').value = formData.requestNamePlaceholder;
    }
    if (formData.requestPhonePlaceholder) {
      document.getElementById('requestPhonePlaceholder').value = formData.requestPhonePlaceholder;
    }

    // Завантажити Popup section
    if (formData.enableAutoPopup !== undefined) {
      document.getElementById('enableAutoPopup').checked = formData.enableAutoPopup;
    }
    if (formData.autoPopupDelay !== undefined) {
      document.getElementById('autoPopupDelay').value = formData.autoPopupDelay;
    }
    if (formData.popupLabel) {
      document.getElementById('popupLabel').value = formData.popupLabel;
    }
    if (formData.popupTitle) {
      document.getElementById('popupTitle').value = formData.popupTitle;
    }
    if (formData.popupButtonText) {
      document.getElementById('popupButtonText').value = formData.popupButtonText;
    }
    if (formData.popupSuccessMessage) {
      document.getElementById('popupSuccessMessage').value = formData.popupSuccessMessage;
    }
    if (formData.popupNamePlaceholder) {
      document.getElementById('popupNamePlaceholder').value = formData.popupNamePlaceholder;
    }
    if (formData.popupPhonePlaceholder) {
      document.getElementById('popupPhonePlaceholder').value = formData.popupPhonePlaceholder;
    }

    // Завантажити Footer section
    if (formData.footerCopyright) {
      document.getElementById('footerCopyright').value = formData.footerCopyright;
    }
    if (formData.footerLink1) {
      document.getElementById('footerLink1').value = formData.footerLink1;
    }
    if (formData.footerLink2) {
      document.getElementById('footerLink2').value = formData.footerLink2;
    }
    if (formData.footerLink3) {
      document.getElementById('footerLink3').value = formData.footerLink3;
    }

    // Завантажити Integrations section
    if (formData.salesdriveApiKey) {
      document.getElementById('salesdriveApiKey').value = formData.salesdriveApiKey;
    }
    if (formData.salesdriveEndpoint) {
      document.getElementById('salesdriveEndpoint').value = formData.salesdriveEndpoint;
    }
    if (formData.salesdriveFunnelId) {
      document.getElementById('salesdriveFunnelId').value = formData.salesdriveFunnelId;
    }
    if (formData.metaPixelId) {
      document.getElementById('metaPixelId').value = formData.metaPixelId;
    }
    if (formData.metaAccessToken) {
      document.getElementById('metaAccessToken').value = formData.metaAccessToken;
    }
    if (formData.metaTestEventCode) {
      document.getElementById('metaTestEventCode').value = formData.metaTestEventCode;
    }
    if (formData.productId) {
      document.getElementById('productId').value = formData.productId;
    }
    if (formData.sku) {
      document.getElementById('sku').value = formData.sku;
    }
    if (formData.website) {
      document.getElementById('website').value = formData.website;
    }

    // Завантажити Comments section
    if (formData.enableComments !== undefined) {
      document.getElementById('enableComments').checked = formData.enableComments;
    }
    if (formData.commentsLabel) {
      document.getElementById('commentsLabel').value = formData.commentsLabel;
    }
    if (formData.commentsTitle) {
      document.getElementById('commentsTitle').value = formData.commentsTitle;
    }
    if (formData.commentsSalesStat) {
      document.getElementById('commentsSalesStat').value = formData.commentsSalesStat;
    }
    if (formData.commentsSalesText) {
      document.getElementById('commentsSalesText').value = formData.commentsSalesText;
    }
    if (formData.commentsSatisfiedStat) {
      document.getElementById('commentsSatisfiedStat').value = formData.commentsSatisfiedStat;
    }
    if (formData.commentsSatisfiedText) {
      document.getElementById('commentsSatisfiedText').value = formData.commentsSatisfiedText;
    }
    if (formData.commentsRepeatStat) {
      document.getElementById('commentsRepeatStat').value = formData.commentsRepeatStat;
    }
    if (formData.commentsRepeatText) {
      document.getElementById('commentsRepeatText').value = formData.commentsRepeatText;
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
    product9Images: JSON.stringify(product9Images),

    // Tabs section
    enableTabs: document.getElementById('enableTabs').checked ? 'on' : 'off',
    tabsLabel: document.getElementById('tabsLabel').value,
    tabsTitle: document.getElementById('tabsTitle').value,
    enableTabItem1: document.getElementById('enableTabItem1').checked ? 'on' : 'off',
    tab1Title: document.getElementById('tab1Title').value,
    tab1Description: document.getElementById('tab1Description').value,
    tab1Image: document.getElementById('tab1Image').value,
    enableTabItem2: document.getElementById('enableTabItem2').checked ? 'on' : 'off',
    tab2Title: document.getElementById('tab2Title').value,
    tab2Description: document.getElementById('tab2Description').value,
    tab2Image: document.getElementById('tab2Image').value,
    enableTabItem3: document.getElementById('enableTabItem3').checked ? 'on' : 'off',
    tab3Title: document.getElementById('tab3Title').value,
    tab3Description: document.getElementById('tab3Description').value,
    tab3Image: document.getElementById('tab3Image').value,

    // FAQ section
    enableFaq: document.getElementById('enableFaq').checked ? 'on' : 'off',
    faqLabel: document.getElementById('faqLabel').value,
    faqTitle: document.getElementById('faqTitle').value,
    faqImage: document.getElementById('faqImage').value,
    enableFaqItem1: document.getElementById('enableFaqItem1').checked ? 'on' : 'off',
    faqItem1Title: document.getElementById('faqItem1Title').value,
    faqItem1Description: document.getElementById('faqItem1Description').value,
    enableFaqItem2: document.getElementById('enableFaqItem2').checked ? 'on' : 'off',
    faqItem2Title: document.getElementById('faqItem2Title').value,
    faqItem2Description: document.getElementById('faqItem2Description').value,
    enableFaqItem3: document.getElementById('enableFaqItem3').checked ? 'on' : 'off',
    faqItem3Title: document.getElementById('faqItem3Title').value,
    faqItem3Description: document.getElementById('faqItem3Description').value,
    enableFaqItem4: document.getElementById('enableFaqItem4').checked ? 'on' : 'off',
    faqItem4Title: document.getElementById('faqItem4Title').value,
    faqItem4Description: document.getElementById('faqItem4Description').value,

    // How To Buy section
    enableHow: document.getElementById('enableHow').checked ? 'on' : 'off',
    howLabel: document.getElementById('howLabel').value,
    howTitle: document.getElementById('howTitle').value,
    howStep1: document.getElementById('howStep1').value,
    howStep2: document.getElementById('howStep2').value,
    howStep3: document.getElementById('howStep3').value,
    howStep4: document.getElementById('howStep4').value,

    // Comments section
    enableComments: document.getElementById('enableComments').checked ? 'on' : 'off',
    commentsLabel: document.getElementById('commentsLabel').value,
    commentsTitle: document.getElementById('commentsTitle').value,
    commentsSalesStat: document.getElementById('commentsSalesStat').value,
    commentsSalesText: document.getElementById('commentsSalesText').value,
    commentsSatisfiedStat: document.getElementById('commentsSatisfiedStat').value,
    commentsSatisfiedText: document.getElementById('commentsSatisfiedText').value,
    commentsRepeatStat: document.getElementById('commentsRepeatStat').value,
    commentsRepeatText: document.getElementById('commentsRepeatText').value,
    commentsImages: window.commentsImages || [],

    // Request Form section
    requestInfoTitle: document.getElementById('requestInfoTitle').value,
    requestInfoDescription: document.getElementById('requestInfoDescription').value,
    requestButtonText: document.getElementById('requestButtonText').value,
    requestNamePlaceholder: document.getElementById('requestNamePlaceholder').value,
    requestPhonePlaceholder: document.getElementById('requestPhonePlaceholder').value,

    // Popup section
    enableAutoPopup: document.getElementById('enableAutoPopup').checked,
    autoPopupDelay: document.getElementById('autoPopupDelay').value || 350,
    popupLabel: document.getElementById('popupLabel').value,
    popupTitle: document.getElementById('popupTitle').value,
    popupButtonText: document.getElementById('popupButtonText').value,
    popupSuccessMessage: document.getElementById('popupSuccessMessage').value,
    popupNamePlaceholder: document.getElementById('popupNamePlaceholder').value,
    popupPhonePlaceholder: document.getElementById('popupPhonePlaceholder').value,

    // Footer section
    footerCopyright: document.getElementById('footerCopyright').value,
    footerLink1: document.getElementById('footerLink1').value,
    footerLink2: document.getElementById('footerLink2').value,
    footerLink3: document.getElementById('footerLink3').value,

    // Integrations section
    salesdriveApiKey: document.getElementById('salesdriveApiKey').value,
    salesdriveEndpoint: document.getElementById('salesdriveEndpoint').value,
    salesdriveFunnelId: document.getElementById('salesdriveFunnelId').value,
    metaPixelId: document.getElementById('metaPixelId').value,
    metaAccessToken: document.getElementById('metaAccessToken').value,
    metaTestEventCode: document.getElementById('metaTestEventCode').value,
    productId: document.getElementById('productId').value,
    sku: document.getElementById('sku').value,
    website: document.getElementById('website').value

  });



  return params.toString();

}



function previewSite() {
  try {
    console.log('previewSite called');

    // Helper для безпечного отримання значень
    const getValue = (id) => {
      const el = document.getElementById(id);
      return el ? el.value : '';
    };
    const getChecked = (id) => {
      const el = document.getElementById(id);
      return el && el.checked ? 'on' : 'off';
    };

    // Створюємо тимчасову форму для POST запиту
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/generate';
    form.target = '_blank';
    form.style.display = 'none';

    // Збираємо всі дані з форми
    const formData = {
    headerText: getValue('headerText'),
    heroTitle: getValue('heroTitle'),
    heroPrice: getValue('heroPrice'),
    enableTimer: getChecked('enableTimer'),
    enableStock: getChecked('enableStock'),
    heroImage: uploadedHeroImageFilename,
    enableImage: getChecked('enableImage'),
    imageUrl: imageUrlValue,
    enableVideo: getChecked('enableVideo'),
    videoUrl: videoUrlValue,
    enableVideoThumbnail: getChecked('enableVideoThumbnail'),
    videoThumbnailDesktop: videoThumbnailDesktopValue,
    videoThumbnailMobile: videoThumbnailMobileValue,
    sizeChartImage: getValue('sizeChartImage'),

    // Info fields
    infoEnableBrand: getChecked('infoEnableBrand'),
    infoBrandLabel: getValue('infoBrandLabel'),
    infoBrandValue: getValue('infoBrandValue'),
    infoEnableModel: getChecked('infoEnableModel'),
    infoModelLabel: getValue('infoModelLabel'),
    infoModelValue: getValue('infoModelValue'),
    infoEnableQuantity: getChecked('infoEnableQuantity'),
    infoQuantityLabel: getValue('infoQuantityLabel'),
    infoQuantityValue: getValue('infoQuantityValue'),
    infoEnableColors: getChecked('infoEnableColors'),
    infoColorsLabel: getValue('infoColorsLabel'),
    infoEnableSizes: getChecked('infoEnableSizes'),
    infoSizesLabel: getValue('infoSizesLabel'),
    infoSizesValue: getValue('infoSizesValue'),
    infoEnableMaterial: getChecked('infoEnableMaterial'),
    infoMaterialLabel: getValue('infoMaterialLabel'),
    infoMaterialValue: getValue('infoMaterialValue'),
    infoEnablePackaging: getChecked('infoEnablePackaging'),
    infoPackagingLabel: getValue('infoPackagingLabel'),
    infoPackagingValue: getValue('infoPackagingValue'),

    // Benefits
    benefits: JSON.stringify(getBenefitsData()),

    // Products 1-5
    product1Name: getValue('product1Name'),
    product1Color: getValue('product1Color'),
    product1ColorHex: getValue('product1ColorHex'),
    product1Size: getValue('product1Size'),
    product1Material: getValue('product1Material'),
    product1PriceOld: getValue('product1PriceOld'),
    product1Price: getValue('product1Price'),
    enableProduct1: getChecked('enableProduct1'),
    product1Images: JSON.stringify(product1Images),

    product2Name: getValue('product2Name'),
    product2Color: getValue('product2Color'),
    product2ColorHex: getValue('product2ColorHex'),
    product2Size: getValue('product2Size'),
    product2Material: getValue('product2Material'),
    product2PriceOld: getValue('product2PriceOld'),
    product2Price: getValue('product2Price'),
    enableProduct2: getChecked('enableProduct2'),
    product2Images: JSON.stringify(product2Images),

    product3Name: getValue('product3Name'),
    product3Color: getValue('product3Color'),
    product3ColorHex: getValue('product3ColorHex'),
    product3Size: getValue('product3Size'),
    product3Material: getValue('product3Material'),
    product3PriceOld: getValue('product3PriceOld'),
    product3Price: getValue('product3Price'),
    enableProduct3: getChecked('enableProduct3'),
    product3Images: JSON.stringify(product3Images),

    product4Name: getValue('product4Name'),
    product4Color: getValue('product4Color'),
    product4ColorHex: getValue('product4ColorHex'),
    product4Size: getValue('product4Size'),
    product4Material: getValue('product4Material'),
    product4PriceOld: getValue('product4PriceOld'),
    product4Price: getValue('product4Price'),
    enableProduct4: getChecked('enableProduct4'),
    product4Images: JSON.stringify(product4Images),

    product5Name: getValue('product5Name'),
    product5Color: getValue('product5Color'),
    product5ColorHex: getValue('product5ColorHex'),
    product5Size: getValue('product5Size'),
    product5Material: getValue('product5Material'),
    product5PriceOld: getValue('product5PriceOld'),
    product5Price: getValue('product5Price'),
    enableProduct5: getChecked('enableProduct5'),
    product5Images: JSON.stringify(product5Images),

    // Products 8-9
    product8Name: getValue('product8Name'),
    product8Color: getValue('product8Color'),
    product8ColorHex: getValue('product8ColorHex'),
    product8Size: getValue('product8Size'),
    product8Material: getValue('product8Material'),
    product8PriceOld: getValue('product8PriceOld'),
    product8Price: getValue('product8Price'),
    enableProduct8: getChecked('enableProduct8'),
    product8Images: JSON.stringify(product8Images),

    product9Name: getValue('product9Name'),
    product9Color: getValue('product9Color'),
    product9ColorHex: getValue('product9ColorHex'),
    product9Size: getValue('product9Size'),
    product9Material: getValue('product9Material'),
    product9PriceOld: getValue('product9PriceOld'),
    product9Price: getValue('product9Price'),
    enableProduct9: getChecked('enableProduct9'),
    product9Images: JSON.stringify(product9Images),

    // Tabs
    enableTabs: getChecked('enableTabs'),
    tabsLabel: getValue('tabsLabel'),
    tabsTitle: getValue('tabsTitle'),
    enableTabItem1: getChecked('enableTabItem1'),
    tab1Title: getValue('tab1Title'),
    tab1Description: getValue('tab1Description'),
    tab1Image: getValue('tab1Image'),
    enableTabItem2: getChecked('enableTabItem2'),
    tab2Title: getValue('tab2Title'),
    tab2Description: getValue('tab2Description'),
    tab2Image: getValue('tab2Image'),
    enableTabItem3: getChecked('enableTabItem3'),
    tab3Title: getValue('tab3Title'),
    tab3Description: getValue('tab3Description'),
    tab3Image: getValue('tab3Image'),

    // FAQ
    enableFaq: getChecked('enableFaq'),
    faqLabel: getValue('faqLabel'),
    faqTitle: getValue('faqTitle'),
    faqImage: getValue('faqImage'),
    enableFaqItem1: getChecked('enableFaqItem1'),
    faqItem1Title: getValue('faqItem1Title'),
    faqItem1Description: getValue('faqItem1Description'),
    enableFaqItem2: getChecked('enableFaqItem2'),
    faqItem2Title: getValue('faqItem2Title'),
    faqItem2Description: getValue('faqItem2Description'),
    enableFaqItem3: getChecked('enableFaqItem3'),
    faqItem3Title: getValue('faqItem3Title'),
    faqItem3Description: getValue('faqItem3Description'),
    enableFaqItem4: getChecked('enableFaqItem4'),
    faqItem4Title: getValue('faqItem4Title'),
    faqItem4Description: getValue('faqItem4Description'),

    // How to Buy
    enableHow: getChecked('enableHow'),
    howLabel: getValue('howLabel'),
    howTitle: getValue('howTitle'),
    howStep1: getValue('howStep1'),
    howStep2: getValue('howStep2'),
    howStep3: getValue('howStep3'),
    howStep4: getValue('howStep4'),

    // Request Form
    requestInfoTitle: getValue('requestInfoTitle'),
    requestInfoDescription: getValue('requestInfoDescription'),
    requestButtonText: getValue('requestButtonText'),
    requestNamePlaceholder: getValue('requestNamePlaceholder'),
    requestPhonePlaceholder: getValue('requestPhonePlaceholder'),

    // Popup
    enableAutoPopup: getChecked('enableAutoPopup'),
    autoPopupDelay: getValue('autoPopupDelay') || 350,
    popupLabel: getValue('popupLabel'),
    popupTitle: getValue('popupTitle'),
    popupButtonText: getValue('popupButtonText'),
    popupSuccessMessage: getValue('popupSuccessMessage'),
    popupNamePlaceholder: getValue('popupNamePlaceholder'),
    popupPhonePlaceholder: getValue('popupPhonePlaceholder'),

    // Footer
    footerCopyright: getValue('footerCopyright'),
    footerLink1: getValue('footerLink1'),
    footerLink2: getValue('footerLink2'),
    footerLink3: getValue('footerLink3'),

    // Integrations
    salesdriveApiKey: getValue('salesdriveApiKey'),
    salesdriveEndpoint: getValue('salesdriveEndpoint'),
    salesdriveFunnelId: getValue('salesdriveFunnelId'),
    metaPixelId: getValue('metaPixelId'),
    metaAccessToken: getValue('metaAccessToken'),
    metaTestEventCode: getValue('metaTestEventCode'),
    productId: getValue('productId'),
    sku: getValue('sku'),
    website: getValue('website'),

    // Comments
    enableComments: getChecked('enableComments'),
    commentsLabel: getValue('commentsLabel'),
    commentsTitle: getValue('commentsTitle'),
    commentsSalesStat: getValue('commentsSalesStat'),
    commentsSalesText: getValue('commentsSalesText'),
    commentsSatisfiedStat: getValue('commentsSatisfiedStat'),
    commentsSatisfiedText: getValue('commentsSatisfiedText'),
    commentsRepeatStat: getValue('commentsRepeatStat'),
    commentsRepeatText: getValue('commentsRepeatText'),
    commentsImages: JSON.stringify(window.commentsImages || [])
  };

  // Додаємо всі поля як приховані input
  for (const [key, value] of Object.entries(formData)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value || '';
    form.appendChild(input);
  }

  // Додаємо форму до body, submit і видаляємо
  document.body.appendChild(form);
  console.log('Form appended, submitting...');
  form.submit();
  document.body.removeChild(form);
  console.log('Preview opened successfully');
  } catch (error) {
    console.error('Error in previewSite:', error);
    alert('ПОМИЛКА: ' + error.message + '\n\nДивись консоль для деталей (F12)');
  }
}

// Допоміжна функція для збору benefits
function getBenefitsData() {
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
  return benefits;
}



// Wrap in DOMContentLoaded to ensure form exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFormSubmit);
} else {
  initFormSubmit();
}

function initFormSubmit() {
  const form = document.getElementById('constructorForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const params = getFormParams();
      window.location.href = '/export?' + params;
    });
  }
}


// ==================== TABS SECTION ====================

// Toggle collapsible для tab items
function toggleTabItem(itemNum) {
  const content = document.getElementById(`tabItemContent${itemNum}`);
  const arrow = document.getElementById(`tabItemArrow${itemNum}`);

  if (content.style.display === 'none' || content.style.display === '') {
    content.style.display = 'block';
    arrow.style.transform = 'rotate(180deg)';
  } else {
    content.style.display = 'none';
    arrow.style.transform = 'rotate(0deg)';
  }
}

// Tab 1 Upload
async function handleTab1Upload() {
  const input = document.getElementById('tab1ImageInput');
  const file = input.files[0];

  if (!file) {
    alert('Оберіть файл для завантаження');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/upload-tab-image/1', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('tab1Preview').innerHTML = `
        <img src="${data.path}" style="max-width: 200px; max-height: 150px; border-radius: 4px;">
        <p style="font-size: 12px; color: #666; margin-top: 8px;">${data.path}</p>
      `;
      document.getElementById('tab1Image').value = data.path;
    } else {
      alert('Помилка: ' + data.error);
    }
  } catch (error) {
    alert('Помилка завантаження: ' + error.message);
  }
}

// Tab 2 Upload
async function handleTab2Upload() {
  const input = document.getElementById('tab2ImageInput');
  const file = input.files[0];

  if (!file) {
    alert('Оберіть файл для завантаження');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/upload-tab-image/2', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('tab2Preview').innerHTML = `
        <img src="${data.path}" style="max-width: 200px; max-height: 150px; border-radius: 4px;">
        <p style="font-size: 12px; color: #666; margin-top: 8px;">${data.path}</p>
      `;
      document.getElementById('tab2Image').value = data.path;
    } else {
      alert('Помилка: ' + data.error);
    }
  } catch (error) {
    alert('Помилка завантаження: ' + error.message);
  }
}

// Tab 3 Upload
async function handleTab3Upload() {
  const input = document.getElementById('tab3ImageInput');
  const file = input.files[0];

  if (!file) {
    alert('Оберіть файл для завантаження');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/upload-tab-image/3', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('tab3Preview').innerHTML = `
        <img src="${data.path}" style="max-width: 200px; max-height: 150px; border-radius: 4px;">
        <p style="font-size: 12px; color: #666; margin-top: 8px;">${data.path}</p>
      `;
      document.getElementById('tab3Image').value = data.path;
    } else {
      alert('Помилка: ' + data.error);
    }
  } catch (error) {
    alert('Помилка завантаження: ' + error.message);
  }
}

// ========== FAQ (Доставка і оплата) ФУНКЦІЇ ==========

function toggleFaqItem(itemNum) {
  const content = document.getElementById(`faqItemContent${itemNum}`);
  const arrow = document.getElementById(`faqItemArrow${itemNum}`);

  if (content.style.display === 'none' || content.style.display === '') {
    content.style.display = 'block';
    arrow.style.transform = 'rotate(180deg)';
  } else {
    content.style.display = 'none';
    arrow.style.transform = 'rotate(0deg)';
  }
}

async function handleFaqUpload() {
  const input = document.getElementById('faqImageInput');
  const file = input.files[0];

  if (!file) {
    alert('Оберіть файл для завантаження');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/upload-faq-image', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('faqPreview').innerHTML = `
        <img src="${data.path}" style="max-width: 200px; max-height: 150px; border-radius: 4px;">
        <p style="font-size: 12px; color: #666; margin-top: 8px;">${data.path}</p>
      `;
      document.getElementById('faqImage').value = data.path;
    } else {
      alert('Помилка: ' + data.error);
    }
  } catch (error) {
    alert('Помилка завантаження: ' + error.message);
  }
}

