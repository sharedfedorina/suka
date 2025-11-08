# Landing Page Constructor - Архітектура та Інструкція

## Принцип: ONE CODE - DIFFERENT CONFIG FILES

Весь код логіки однаковий, незалежно від того, з якого конфіга завантажуються дані.

```
🔄 Оригінал        📂 Збережене
     ↓                    ↓
landing-data.json   user-config.json
     ↓                    ↓
  (ОДНАКОВА СТРУКТУРА, РІЗНІ ЗНАЧЕННЯ)
     ↓                    ↓
→→→ ОДИН КОД ←←←
```

**НИКАКИХ** if/else на основі джерела даних. Тільки placeholder → value заміни.

---

## ЧЕК-ЛИСТ: Як додати новий блок/функцію

### КРОК 1: Структура конфігу
- [ ] В **landing-data.json** та **user-config.json** додай новий параметр
- [ ] Структура МАЮТЬ бути **ІДЕНТИЧНОЮ** в обох файлах
- [ ] Приклад:
  ```json
  "enableImage": true,
  "imageUrl": "/public/img/hero/hero-1762611101603_m.webp"
  ```

### КРОК 2: HTML шаблон (index.html)
- [ ] Обгорни блок **HTML-коментарями** для умовного видалення:
  ```html
  <!--blockName-->
  <div class="block">
    <img src="{{placeholder}}" alt="img">
  </div>
  <!--/blockName-->
  ```
- [ ] Замінь всі значення на **ПЛЕЙСХОЛДЕРИ** у форматі `{{paramName}}`
- [ ] Не міняй HTML структуру - тільки атрибути
- [ ] НЕ додавай жодної логіки - тільки статичний HTML

### КРОК 3: Форма конструктора (form.html)
- [ ] Додай **checkbox** для включення/вимкнення блоку:
  ```html
  <input type="checkbox" id="enableBlockName" name="enableBlockName" />
  Показувати [Блок Назва]
  ```
- [ ] Додай **file input** для завантаження файлу (якщо потрібно):
  ```html
  <input type="file" id="blockNameUpload" name="blockNameUpload" accept="image/*" />
  ```
- [ ] Додай **preview контейнер**:
  ```html
  <div id="blockNamePreview" style="display: none;">
    <img id="previewBlockName" src="" alt="preview">
  </div>
  ```

### КРОК 4: JavaScript логіка (form.js)

#### 4.1 Декларація змінної для трекування
```javascript
let blockNameValue = ''; // На початку файлу (line 1-5)
```

#### 4.2 DOMContentLoaded ініціалізація
У `DOMContentLoaded` функції додай завантаження з `/api/original-form-data`:
```javascript
if (data.enableBlockName !== undefined) {
  document.getElementById('enableBlockName').checked = data.enableBlockName;
}
if (data.blockNameValue) {
  blockNameValue = data.blockNameValue;
}
```

#### 4.3 File upload обробка
Додай event listener для file input:
```javascript
document.getElementById('blockNameUpload').addEventListener('change', async function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('heroImage', file); // Використовуй ОДИН endpoint

  try {
    const response = await fetch('/upload-hero-image', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Error');

    const result = await response.json();
    blockNameValue = result.filename;
    console.log('✅ Файл завантажено:', blockNameValue);
  } catch (error) {
    alert('❌ Помилка: ' + error.message);
    document.getElementById('blockNameUpload').value = '';
    blockNameValue = '';
  }
});
```

#### 4.4 saveFormToServer() - Додай до formData
```javascript
enableBlockName: document.getElementById('enableBlockName').checked,
blockNameValue: blockNameValue,
```

#### 4.5 loadSavedValues() - Додай завантаження
```javascript
document.getElementById('enableBlockName').checked = formData.enableBlockName;
blockNameValue = formData.blockNameValue;
if (formData.blockNameValue) {
  document.getElementById('previewBlockName').src = formData.blockNameValue;
  document.getElementById('blockNamePreview').style.display = 'block';
}
```

#### 4.6 getFormParams() - Додай до URL параметрів
```javascript
const enableBlockName = document.getElementById('enableBlockName').checked ? 'on' : 'off';
const blockNameValue = blockNameValue;

params.append('enableBlockName', enableBlockName);
params.append('blockNameValue', blockNameValue);
```

### КРОК 5: API збереження (server.js) - /api/save-config
- [ ] Прочитай `enableBlockName` та `blockNameValue` з req.body
- [ ] Збережи їх в user-config.json:
  ```javascript
  userConfig.enableBlockName = req.body.enableBlockName;
  userConfig.blockNameValue = req.body.blockNameValue;
  ```

### КРОК 6: API завантаження (server.js) - /api/get-user-config
- [ ] Автоматично повертай `enableBlockName` та `blockNameValue` з user-config.json
- [ ] Не потрібно додавати спеціальної логіки - просто повер файл

### КРОК 7: HTML генерація (server.js) - generateHTML()
- [ ] **Заміна плейсхолдера**:
  ```javascript
  html = html.replace('{{blockNamePlaceholder}}', params.blockNameValue || '');
  ```

- [ ] **Умовне видалення блоку** (регекс):
  ```javascript
  if (params.enableBlockName !== 'on') {
    html = html.replace(/<!--blockName-->[\s\S]*?<!--\/blockName-->/g, '');
  }
  ```

### КРОК 8: Шлях завантаженого файлу
- [ ] Всі завантажені файли розміщуються в `/public/img/hero/`
- [ ] Файли автоматично оптимізуються (Sharp):
  - `image.jpg` → `image_m.webp` (мобільна версія)
- [ ] Повертається **приватизований** шлях: `/public/img/hero/image_m.webp`

### КРОК 9: Тестування
- [ ] ✅ Можу завантажити файл
- [ ] ✅ Preview показується у формі
- [ ] ✅ Натискаю "💾 Зберегти" - дані зберігаються
- [ ] ✅ Натискаю "📂 Збережене" - дані завантажуються + preview показується
- [ ] ✅ Checkbox включений - блок показується у preview
- [ ] ✅ Checkbox вимкнений - блок прихований у preview
- [ ] ✅ Генеруючи ZIP - блок правильно показується/приховується

### КРОК 10: Git commit
- [ ] Перевір всі файли що змінилися (git status)
- [ ] Додай тільки конструктор файли (не untracked)
- [ ] Напиши детальний опис в commit message
- [ ] Запуш на remote (git push)

---

## Файли для редагування (у порядку)

1. **landing-data.json** - Додай параметри з значеннями
2. **user-config.json** - Додай ІДЕНТИЧНІ параметри з стандартними значеннями
3. **index.html** - Обгорни блок коментарями, замінь на плейсхолдери
4. **form.html** - Додай checkbox, file input, preview
5. **form.js** - Додай змінну, логіку, event listeners
6. **server.js** - Додай заміну, умовне видалення, API логіку

---

## Архітектурні ПРАВИЛА

### ✅ РОБИТИ:
- Placeholder string replacement: `{{name}}`
- Регекс для видалення блоків: `<!--blockName-->...<!--/blockName-->`
- Одна функція, один код - різні конфіги
- Структура конфігів ІДЕНТИЧНА
- Один endpoint для всіх файлів (`/upload-hero-image`)
- Sharp оптимізація для обох версій (desktop + mobile)

### ❌ НЕ РОБИТИ:
- if/else логіка на основі даних
- Hardcoded paths - все через конфіг
- Нові функції для кожного блоку
- Різна структура конфігів
- Логіка в HTML шаблоні
- Додавання параметрів без обох конфігів

---

## Приклад: Plus-Logo Image Block

Цей саме блок як в коді:

```
landing-data.json:
  "enableImage": true,
  "imageUrl": "/public/img/hero/hero-1762611101603_m.webp"

user-config.json:
  "enableImage": true,
  "imageUrl": "/public/img/hero/hero-1762611101603_m.webp"

index.html:
  <!--image-->
  <div class="plus-logo">
    <img src="{{imageUrl}}" alt="img">
  </div>
  <!--/image-->

form.html:
  <input type="checkbox" id="enableImage" name="enableImage" />
  <input type="file" id="imageUpload" name="imageUpload" accept="image/*" />
  <div id="imageUploadPreview"><img id="previewImageUpload" src=""></div>

form.js:
  let imageUrlValue = '';

  document.getElementById('imageUpload').addEventListener('change', async function(e) {
    // upload logic
    imageUrlValue = result.filename;
  });

  saveFormToServer(): {
    enableImage: document.getElementById('enableImage').checked,
    imageUrl: imageUrlValue,
  }

  loadSavedValues(): {
    document.getElementById('enableImage').checked = formData.enableImage;
    imageUrlValue = formData.imageUrl;
    if (formData.imageUrl) {
      document.getElementById('previewImageUpload').src = formData.imageUrl;
      document.getElementById('imageUploadPreview').style.display = 'block';
    }
  }

server.js:
  html = html.replace('{{imageUrl}}', params.imageUrl || '');
  if (params.enableImage !== 'on') {
    html = html.replace(/<!--image-->[\s\S]*?<!--\/image-->/g, '');
  }
```

---

## Якщо щось не працює

1. Перевір що **обидва конфіги** мають **ІДЕНТИЧНУ структуру**
2. Перевір що **плейсхолдери** пишуться як `{{paramName}}`
3. Перевір що **регекс** правильно обгортає блок: `<!--name-->...<!--/name-->`
4. Перевір що **checkbox id** співпадає з селектором в form.js
5. Перевір що **переменна** оголошена на початку form.js
6. Перевір що `/api/save-config` зберігає всі параметри в user-config.json
7. Перевір що `/api/get-user-config` повертає все, що там збережено
8. Перевір що `generateHTML()` заміняє плейсхолдери та видаляє блоки

---

## Приклад нового блоку: Video Block

Якби була задача додати video блок, схема була б:

```json
{
  "enableVideo": true,
  "videoUrl": "/public/video/promo.mp4"
}
```

Блок: `<!--video-->...<video src="{{videoUrl}}">...<!--/video-->`

Форма: checkbox + file input для video + preview

Form.js: `let videoUrlValue = ''` + весь решта логіка як у plus-logo

Server: заміна `{{videoUrl}}`, регекс `<!--video-->...<!--/video-->`

**NOTHING ELSE!**架構однакова для всіх блоків.
