# Netlify + Salesdrive CRM - Інструкція з налаштування

## Структура проекту

```
constructor/
├── netlify/
│   └── functions/
│       └── submit-order.js    # Serverless функція для відправки замовлень
├── netlify.toml               # Конфігурація Netlify
├── index.html                 # Згенерований лендінг
└── public/                    # Статичні файли (images, css, js)
```

## Як працює безпека

1. **Статичний HTML** не містить API ключів
2. **JavaScript у браузері** відправляє замовлення на `/api/submit-order`
3. **Netlify Function** отримує замовлення, додає API ключ з Environment Variables, відправляє в Salesdrive
4. **API ключ НІКОЛИ не покидає сервер** - він живе тільки в Environment Variables

## Кроки налаштування в Netlify

### 1. Підключити GitHub репозиторій до Netlify

1. Зайти на https://app.netlify.com/
2. **New site from Git** → вибрати GitHub репозиторій
3. **Build settings**:
   - Build command: (залишити порожнім, якщо не потрібен build)
   - Publish directory: `constructor` (або папка з вашим експортом)

### 2. Налаштувати Environment Variables

У Netlify Dashboard:

**Site settings** → **Environment variables** → **Add a variable**

Додати 3 змінні:

| Key | Value | Приклад |
|-----|-------|---------|
| `SALESDRIVE_ENDPOINT` | URL Salesdrive webhook | `https://example.salesdrive.me/handler/` |
| `SALESDRIVE_API_KEY` | Ваш API ключ Salesdrive | `Ycxui0h7tqIgGn3EJi1AcBgUaTpnXSgpJ4U-...` |
| `SALESDRIVE_FUNNEL_ID` | ID воронки | `1` |

⚠️ **ВАЖЛИВО**: Ці змінні НІКОЛИ не будуть доступні у браузері. Вони існують тільки на сервері Netlify.

### 3. Deploy сайту

Після commit & push в GitHub:
- Netlify автоматично задеплоїть сайт
- Serverless функція буде доступна на `/api/submit-order`
- Лендінг буде працювати на `https://your-site.netlify.app/`

## Як працює маршрут замовлення

```
Браузер → /api/submit-order (Netlify Function) → Salesdrive CRM
         [дані замовлення]      [+ API ключ]      [отримує замовлення]
```

## Тестування локально

Для тестування Netlify Functions локально:

```bash
npm install -g netlify-cli
cd constructor
netlify dev
```

Створити файл `.env` з секретними ключами:

```env
SALESDRIVE_ENDPOINT=https://example.salesdrive.me/handler/
SALESDRIVE_API_KEY=Ycxui0h7tqIgGn3EJi1AcBgUaTpnXSgpJ4U-AUldjbFFepXWHuj2QQ3ekCpgX76Yz
SALESDRIVE_FUNNEL_ID=1
```

⚠️ **ВАЖЛИВО**: `.env` файл НЕ повинен потрапити в Git! Додати в `.gitignore`:

```gitignore
.env
.env.local
```

## Перевірка роботи

Після deploy перевірити:

1. Відкрити лендінг: `https://your-site.netlify.app/`
2. Натиснути кнопку "Замовити"
3. Заповнити форму
4. Перевірити в Salesdrive CRM - замовлення має з'явитися

## Логи (для debugging)

Netlify Dashboard → **Functions** → **submit-order** → переглянути логи виконання

## Безпека ✅

- ✅ API ключ НЕ в HTML
- ✅ API ключ НЕ в JavaScript
- ✅ API ключ НЕ в Git репозиторії
- ✅ API ключ тільки в Environment Variables Netlify
- ✅ Ключ НІКОЛИ не передається у браузер

## Що далі?

Експортуй свій згенерований лендінг + `netlify/` папку + `netlify.toml` в Git репозиторій і підключи до Netlify.
