# СТРУКТУРА LANDING PAGE - ТЕХНІЧНИЙ ОПИС

## ЗАГАЛЬНА ІНФОРМАЦІЯ

**Тип**: Одностроінковий landing page (Single Page)
**Мова**: Українська
**Товар**: Жіночий одяг 

---

## ПОСЛІДОВНІСТЬ СЕКЦІЙ (ЩО ЗА ЧИМ ЙДЕ)

```
1. HEADER (Шапка)
   ↓
2. HERO/START (Головна секція з товаром)
   ↓
3. ACTION BAR (Липка панель при скролі)
   ↓
4. PLUS/BENEFITS (5 переваг покупки)
   ↓
5. VIDEO/PROMO (Відеоогляд товару)
   ↓
6. PRODUCTS (Каталог товарів)
   ↓
7. INFO (Розмірна сітка + характеристики)
   ↓
8. TABS (3 вкладки з описом переваг)
   ↓
9. COMMENTS (Відгуки клієнтів)
   ↓
10. FAQ (4 питання-відповіді)
   ↓
11. HOW (Як замовити - 4 кроки)
   ↓
12. REQUEST (Форма замовлення)
   ↓
13. FOOTER (Підвал)
   ↓
14. POPUP (Спливаюче вікно замовлення)
```

---

## ДЕТАЛЬНИЙ ОПИС КОЖНОЇ СЕКЦІЇ

### 1. HEADER (Шапка)

**Розташування**: Верх сторінки, фіксована позиція

**Елементи**:
- Іконка цінника (SVG)
- Текст акції

**Змінні**:
- `{{headerText}}` - текст у шапці

**Смисловий зміст**: Акційне повідомлення, привертає увагу до знижки

---

### 2. HERO / START (Головна секція)

**Розташування**: Перший екран після header

**Елементи**:
- H1 заголовок
- Ціна
- Кнопка "ВИБРАТИ" (скрол до #products)
- Слайдер з фото товару (Swiper)
- Таймер зворотного відліку (опціонально)
- Лічильник залишку товару (опціонально)
- Навігація слайдера (prev/next, пагінація)

**Змінні**:
- `{{heroTitle}}` - заголовок
- `{{heroPrice}}` - ціна
- `{{heroImage}}` - фото товару
- `{{enableTimer}}` - показувати таймер (true/false)
- `{{enableStock}}` - показувати залишок (true/false)
- `{{stockCount}}` - кількість товару
- `{{enableImage}}` - показувати додаткове фото (true/false)
- `{{imageUrl}}` - URL додаткового фото

**Смисловий зміст**: Перше враження, основна пропозиція, ціна, візуал товару

---

### 3. ACTION BAR (Липка панель)

**Розташування**: З'являється при скролі вниз, закріплюється зверху

**Елементи**:
- Текст "Обирайте колір або набір"
- Підтекст "Діють акційні ціни!"
- Кнопка "ВИБРАТИ" (скрол до #products)

**Змінні**: Немає (хардкод)

**Смисловий зміст**: Швидкий доступ до каталогу товарів під час скролу

---

### 4. PLUS / BENEFITS (Переваги)

**Розташування**: Після Hero, перед Products

**Елементи**:
- 5 блоків переваг
- Кожен блок: іконка (SVG) + заголовок + опис
- Фото товару (центр на десктопі)

**Змінні** (5 переваг):
- `{{benefit1Title}}` / `{{benefit1Description}}`
- `{{benefit2Title}}` / `{{benefit2Description}}`
- `{{benefit3Title}}` / `{{benefit3Description}}`
- `{{benefit4Title}}` / `{{benefit4Description}}`
- `{{benefit5Title}}` / `{{benefit5Description}}`
- `benefits[].enabled` - показувати перевагу (true/false)

**Смисловий зміст**: Переваги покупки, причини довіряти, гарантії

---

### 5. VIDEO / PROMO (Відеоогляд)

**Розташування**: Після Benefits, перед Products

**Елементи**:
- Лейбл "Відеоогляд"
- Заголовок "Краще один раз побачити"
- Превью відео (picture з desktop/mobile версіями)
- Кнопка Play (SVG)
- Посилання на відео (Fancybox lightbox)

**Змінні**:
- `{{enableVideo}}` - показувати секцію (true/false)
- `{{videoUrl}}` - URL відео файлу
- `{{enableVideoThumbnail}}` - показувати превью (true/false)
- `{{videoThumbnailDesktop}}` - превью для desktop
- `{{videoThumbnailMobile}}` - превью для mobile

**Смисловий зміст**: Візуальна демонстрація товару, показати якість

---

### 6. PRODUCTS (Каталог товарів)

**Розташування**: Центральна частина, після відео

**Елементи секції**:
- Лейбл "Замовляйте зараз зі знижкою"
- Заголовок "Обирайте колір або Свій набір футболок"
- Список товарів (до 9 штук: product1-product9)

**Елементи ОДНОГО товару**:
- Слайдер фото (Swiper, до 8 фото)
- Навігація слайдера (prev/next, dots)
- Назва товару
- Колір (текст + кружечок з HEX кольором)
- Розміри (текст)
- Матеріал (текст)
- Стара ціна (перекреслена)
- Нова ціна (велика)
- Кнопка "ЗАМОВИТИ" (data-id="productN")

**Змінні для кожного товару** (приклад product1):
- `{{enableProduct1}}` - показувати товар (true/false)
- `{{product1Name}}` - назва
- `{{product1Color}}` - колір (текст)
- `{{product1ColorHex}}` - колір (HEX код)
- `{{product1Size}}` - розміри
- `{{product1Material}}` - матеріал
- `{{product1PriceOld}}` - стара ціна
- `{{product1Price}}` - нова ціна
- `{{product1Images}}` - масив URL фото
- `{{product1Slides}}` - HTML слайдів (генерується)

**Товари**:
- product1-product5: окремі товари
- product8-product9: набори товарів

**Смисловий зміст**: Вибір товару, демонстрація асортименту, ціни, кнопка замовлення

---

### 7. INFO (Розмірна сітка + Характеристики)

**Розташування**: Після Products

**Елементи**:
- Лейбл "Розмірна сітка"
- Заголовок "Вагаєтесь з розміром?"
- Фото таблиці розмірів
- Список характеристик (6-7 пунктів)

**Змінні**:
- `{{sizeChartImage}}` - фото таблиці розмірів

**Характеристики** (кожна має enable):
- `{{infoEnableBrand}}` / `{{infoBrandLabel}}` / `{{infoBrandValue}}`
- `{{infoEnableModel}}` / `{{infoModelLabel}}` / `{{infoModelValue}}`
- `{{infoEnableQuantity}}` / `{{infoQuantityLabel}}` / `{{infoQuantityValue}}`
- `{{infoEnableColors}}` / `{{infoColorsLabel}}` / `{{infoColorCircles}}` (HTML з кружечками)
- `{{infoEnableSizes}}` / `{{infoSizesLabel}}` / `{{infoSizesValue}}`
- `{{infoEnableMaterial}}` / `{{infoMaterialLabel}}` / `{{infoMaterialValue}}`
- `{{infoEnablePackaging}}` / `{{infoPackagingLabel}}` / `{{infoPackagingValue}}`

**Смисловий зміст**: Допомога у виборі розміру, повна інформація про товар

---

### 8. TABS (Вкладки з описом)

**Розташування**: Після Info

**Елементи секції**:
- Лейбл `{{tabsLabel}}`
- Заголовок `{{tabsTitle}}`
- 3 вкладки-акордеони

**Елементи ОДНОЇ вкладки**:
- Заголовок (H3)
- Іконка chevron (SVG)
- Контент (розкривається при кліку):
  - Фото (picture з desktop/mobile)
  - Опис (текст)

**Змінні**:
- `{{enableTabs}}` - показувати секцію (true/false)
- `{{tabsLabel}}` - лейбл секції
- `{{tabsTitle}}` - заголовок секції

**Вкладка 1**:
- `{{enableTabItem1}}` - показувати (true/false)
- `{{tab1Title}}` - заголовок
- `{{tab1Description}}` - опис
- `{{tab1Image}}` - фото (загальне)
- `{{tab1ImageDesktop}}` - фото desktop (генерується)
- `{{tab1ImageMobile}}` - фото mobile (генерується)

**Вкладка 2**:
- `{{enableTabItem2}}` / `{{tab2Title}}` / `{{tab2Description}}` / `{{tab2Image}}`

**Вкладка 3**:
- `{{enableTabItem3}}` / `{{tab3Title}}` / `{{tab3Description}}` / `{{tab3Image}}`

**Смисловий зміст**: Детальна інформація про переваги товару, інтерактивність

---

### 9. COMMENTS (Відгуки)

**Розташування**: Після Tabs

**Елементи**:
- Лейбл `{{commentsLabel}}`
- Заголовок `{{commentsTitle}}`
- Статистика (3 пункти)
- Слайдер фото відгуків (Swiper)
- Навігація слайдера (prev/next)
- Кнопка `{{commentsButtonText}}`

**Змінні**:
- `{{enableComments}}` - показувати секцію (true/false)
- `{{commentsLabel}}` - лейбл
- `{{commentsTitle}}` - заголовок
- **Статистика**:
  - `{{commentsSalesStat}}` / `{{commentsSalesText}}` (наприклад: "5000+" / "клієнтів")
  - `{{commentsSatisfiedStat}}` / `{{commentsSatisfiedText}}` (наприклад: "98%" / "задоволених")
  - `{{commentsRepeatStat}}` / `{{commentsRepeatText}}` (наприклад: "40%" / "повторних покупок")
- `{{commentsImages}}` - масив URL фото відгуків
- `{{commentsButtonText}}` - текст кнопки

**Смисловий зміст**: Соціальний доказ, відгуки реальних клієнтів, довіра

---

### 10. FAQ (Питання-відповіді)

**Розташування**: Після Comments

**Елементи**:
- Лейбл `{{faqLabel}}`
- Заголовок `{{faqTitle}}`
- Фото (picture з desktop/mobile)
- 4 питання-відповіді (акордеони)

**Елементи ОДНОГО питання**:
- Заголовок (H3)
- Іконка chevron (SVG)
- Опис (розкривається при кліку)

**Змінні**:
- `{{enableFaq}}` - показувати секцію (true/false)
- `{{faqLabel}}` - лейбл
- `{{faqTitle}}` - заголовок
- `{{faqImage}}` - фото
- `{{faqImageDesktop}}` / `{{faqImageMobile}}` (генеруються)

**Питання 1-4**:
- `{{enableFaqItem1}}` / `{{faqItem1Title}}` / `{{faqItem1Description}}`
- `{{enableFaqItem2}}` / `{{faqItem2Title}}` / `{{faqItem2Description}}`
- `{{enableFaqItem3}}` / `{{faqItem3Title}}` / `{{faqItem3Description}}`
- `{{enableFaqItem4}}` / `{{faqItem4Title}}` / `{{faqItem4Description}}`

**Смисловий зміст**: Відповіді на типові питання, зняття заперечень

---

### 11. HOW (Як замовити)

**Розташування**: Після FAQ, перед формою

**Елементи**:
- Лейбл `{{howLabel}}`
- Заголовок `{{howTitle}}`
- Нумерований список (OL, 4 кроки)

**Змінні**:
- `{{enableHow}}` - показувати секцію (true/false)
- `{{howLabel}}` - лейбл
- `{{howTitle}}` - заголовок
- `{{howStep1}}` - крок 1
- `{{howStep2}}` - крок 2
- `{{howStep3}}` - крок 3
- `{{howStep4}}` - крок 4

**Смисловий зміст**: Інструкція з замовлення, простота процесу

---

### 12. REQUEST (Форма замовлення)

**Розташування**: Наприкінці, перед Footer

**Елементи**:
- Фото товару (picture)
- Заголовок акції `{{headerText}}`
- Таймер (опціонально, якщо `enableTimer: true`)
- **Блок форми**:
  - Заголовок `{{requestInfoTitle}}`
  - Опис `{{requestInfoDescription}}`
  - Форма (ID: form-popup1):
    - Поле "Ім'я" (text, pattern, required)
    - Підказка формату телефону
    - Поле "Телефон" (tel, pattern, required)
    - Прихований поле "product"
    - Кнопка `{{requestButtonText}}`

**Змінні**:
- `{{requestInfoTitle}}` - заголовок форми
- `{{requestInfoDescription}}` - опис форми
- `{{requestNamePlaceholder}}` - placeholder поля "Ім'я"
- `{{requestPhonePlaceholder}}` - placeholder поля "Телефон"
- `{{requestButtonText}}` - текст кнопки

**Смисловий зміст**: Збір заявок, основна конверсійна точка

---

### 13. FOOTER (Підвал)

**Розташування**: Самий низ сторінки

**Елементи**:
- Логотип ComoYo
- 3 посилання на юридичні сторінки
- Copyright

**Змінні**:
- `{{footerLink1}}` - текст посилання 1
- `{{footerLink2}}` - текст посилання 2
- `{{footerLink3}}` - текст посилання 3
- `{{footerCopyright}}` - текст copyright

**Посилання**:
- exchange.html - обмін та повернення
- politics.html - конфіденційність
- agrement.html - угода користувача

**Смисловий зміст**: Юридична інформація, посилання на документи

---

### 14. POPUP (Спливаюче вікно)

**Розташування**: Поверх сторінки (z-index), спливає при:
- Клік на кнопку "ЗАМОВИТИ" (будь-яку)
- Автоматично через N секунд (якщо `enableAutoPopup: true`)

**Елементи**:
- Overlay (затемнення фону)
- Кнопка закриття (X)
- **Контент**:
  - Лейбл `{{popupLabel}}`
  - Заголовок `{{popupTitle}}`
  - Таймер (якщо `enableTimer: true`)
  - Ціна (стара/нова)
  - Форма (ID: form-popup2):
    - Поле "Ім'я" (text, pattern, required)
    - Підказка формату телефону
    - Поле "Телефон" (tel, pattern, required)
    - Прихований поле "product"
    - Кнопка `{{popupButtonText}}`

**Змінні**:
- `{{enableAutoPopup}}` - автопоказ (true/false)
- `{{autoPopupDelay}}` - затримка автопоказу (секунди)
- `{{popupLabel}}` - лейбл
- `{{popupTitle}}` - заголовок
- `{{popupButtonText}}` - текст кнопки
- `{{popupSuccessMessage}}` - повідомлення після відправки
- `{{popupNamePlaceholder}}` - placeholder "Ім'я"
- `{{popupPhonePlaceholder}}` - placeholder "Телефон"

**Смисловий зміст**: Швидке замовлення товару, додаткова конверсійна точка

---

## ТЕХНІЧНІ ЕЛЕМЕНТИ (НЕ ВИДИМІ)

### Meta Pixel (Facebook)

**Розташування**: `<head>`

**Елементи**:
- Код ініціалізації fbq()
- Трекінг подій: PageView, InitiateCheckout, Purchase

**Змінні**:
- `{{metaPixelCode}}` - згенерований код pixel
- `metaPixelId` - ID pixel (з user-config.json)
- `metaAccessToken` - токен доступу
- `metaTestEventCode` - код для тестування

### SalesDrive CRM

**Розташування**: `<script>` в кінці body

**Функції**:
- `sendToSalesdrive(orderData)` - відправка замовлення
- Event listeners на форми (form-popup1, form-popup2)
- `window.selectedProduct` - дані обраного товару

**Змінні** (з user-config.json):
- `salesdriveApiKey` - API ключ
- `salesdriveEndpoint` - URL endpoint
- `salesdriveFunnelId` - ID воронки
- `productId` - ID товару
- `sku` - SKU товару
- `website` - домен сайту

---

## RESPONSIVE (Mobile/Desktop)

**Breakpoint**: 800px

**Mobile (< 800px)**:
- Використовуються мобільні версії фото (суфікс `_m.webp`)
- `<source srcset="..." media="(min-width: 800px)">` - desktop
- `<img src="..._m.webp">` - mobile (fallback)

**Desktop (>= 800px)**:
- Десктопні версії фото (без суфіксу або `_d`)

---

## СПИСОК УСІХ ЗМІННИХ (PLACEHOLDERS)

### Header
- `{{headerText}}`

### Hero
- `{{heroTitle}}`
- `{{heroPrice}}`
- `{{heroImage}}`
- `{{enableTimer}}`
- `{{enableStock}}`
- `{{stockCount}}`
- `{{enableImage}}`
- `{{imageUrl}}`

### Benefits (5 штук)
- `{{benefit1Title}}` / `{{benefit1Description}}`
- `{{benefit2Title}}` / `{{benefit2Description}}`
- `{{benefit3Title}}` / `{{benefit3Description}}`
- `{{benefit4Title}}` / `{{benefit4Description}}`
- `{{benefit5Title}}` / `{{benefit5Description}}`
- `benefits[].enabled`

### Video
- `{{enableVideo}}`
- `{{videoUrl}}`
- `{{enableVideoThumbnail}}`
- `{{videoThumbnailDesktop}}`
- `{{videoThumbnailMobile}}`

### Products (для кожного product1-product9)
- `{{enableProduct1}}`
- `{{product1Name}}`
- `{{product1Color}}`
- `{{product1ColorHex}}`
- `{{product1Size}}`
- `{{product1Material}}`
- `{{product1PriceOld}}`
- `{{product1Price}}`
- `{{product1Images}}`
- `{{product1Slides}}`

### Info
- `{{sizeChartImage}}`
- `{{infoEnableBrand}}` / `{{infoBrandLabel}}` / `{{infoBrandValue}}`
- `{{infoEnableModel}}` / `{{infoModelLabel}}` / `{{infoModelValue}}`
- `{{infoEnableQuantity}}` / `{{infoQuantityLabel}}` / `{{infoQuantityValue}}`
- `{{infoEnableColors}}` / `{{infoColorsLabel}}` / `{{infoColorCircles}}`
- `{{infoEnableSizes}}` / `{{infoSizesLabel}}` / `{{infoSizesValue}}`
- `{{infoEnableMaterial}}` / `{{infoMaterialLabel}}` / `{{infoMaterialValue}}`
- `{{infoEnablePackaging}}` / `{{infoPackagingLabel}}` / `{{infoPackagingValue}}`

### Tabs
- `{{enableTabs}}`
- `{{tabsLabel}}`
- `{{tabsTitle}}`
- `{{enableTabItem1}}` / `{{tab1Title}}` / `{{tab1Description}}` / `{{tab1Image}}`
- `{{enableTabItem2}}` / `{{tab2Title}}` / `{{tab2Description}}` / `{{tab2Image}}`
- `{{enableTabItem3}}` / `{{tab3Title}}` / `{{tab3Description}}` / `{{tab3Image}}`

### Comments
- `{{enableComments}}`
- `{{commentsLabel}}`
- `{{commentsTitle}}`
- `{{commentsSalesStat}}` / `{{commentsSalesText}}`
- `{{commentsSatisfiedStat}}` / `{{commentsSatisfiedText}}`
- `{{commentsRepeatStat}}` / `{{commentsRepeatText}}`
- `{{commentsImages}}`
- `{{commentsButtonText}}`

### FAQ
- `{{enableFaq}}`
- `{{faqLabel}}`
- `{{faqTitle}}`
- `{{faqImage}}`
- `{{enableFaqItem1}}` / `{{faqItem1Title}}` / `{{faqItem1Description}}`
- `{{enableFaqItem2}}` / `{{faqItem2Title}}` / `{{faqItem2Description}}`
- `{{enableFaqItem3}}` / `{{faqItem3Title}}` / `{{faqItem3Description}}`
- `{{enableFaqItem4}}` / `{{faqItem4Title}}` / `{{faqItem4Description}}`

### How
- `{{enableHow}}`
- `{{howLabel}}`
- `{{howTitle}}`
- `{{howStep1}}` / `{{howStep2}}` / `{{howStep3}}` / `{{howStep4}}`

### Request
- `{{requestInfoTitle}}`
- `{{requestInfoDescription}}`
- `{{requestNamePlaceholder}}`
- `{{requestPhonePlaceholder}}`
- `{{requestButtonText}}`

### Footer
- `{{footerLink1}}`
- `{{footerLink2}}`
- `{{footerLink3}}`
- `{{footerCopyright}}`

### Popup
- `{{enableAutoPopup}}`
- `{{autoPopupDelay}}`
- `{{popupLabel}}`
- `{{popupTitle}}`
- `{{popupButtonText}}`
- `{{popupSuccessMessage}}`
- `{{popupNamePlaceholder}}`
- `{{popupPhonePlaceholder}}`

### Meta/Tracking
- `{{metaPixelCode}}`
- `metaPixelId`
- `metaAccessToken`
- `metaTestEventCode`
- `salesdriveApiKey`
- `salesdriveEndpoint`
- `salesdriveFunnelId`
- `productId`
- `sku`
- `website`

---

## КІНЕЦЬ СТРУКТУРИ
