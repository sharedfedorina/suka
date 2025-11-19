# 🧪 Автоматичні Тести Конструктора

Система автоматичного тестування для перевірки цілісності генерації лендінгу.

## 🚀 Швидкий старт

```bash
# З директорії constructor/
node tests/test-runner.js
```

## 📊 Що тестується

| Тест | Опис | Що перевіряє |
|------|------|--------------|
| **PLACEHOLDERS** | Незаповнені плейсхолдери | Чи всі `{{...}}` замінені на значення |
| **ASSETS** | Файли ресурсів | Чи існують всі картинки/відео на диску |
| **FORM-TEMPLATE SYNC** | Синхронізація форми і темплейту | Чи співпадають поля форми і плейсхолдери |
| **DATA LOADING** | Завантаження даних | Чи використовуються правильні джерела даних |

## 📂 Структура

```
tests/
├── README.md              ← Цей файл
├── TEST_STRATEGY.md       ← Детальна стратегія
├── test-runner.js         ← Головний runner
└── [майбутні тести]
```

## 📝 Приклад виводу

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🧪 CONSTRUCTOR TEST SUITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Started: 2025-11-10 22:38:32

1. PLACEHOLDER TEST
   ❌ Found 12 unfilled placeholders:
      • {{benefit1Title}}
      • {{benefit1Description}}
      ...
   ⏱️  Duration: 0.03s

2. ASSET FILES TEST
   ❌ Missing 4 files:
      • img/start/hero-1762710428290_m.webp
      • video/custom-video-1762701401126.mp4
      ...
   ⏱️  Duration: 0.02s

3. FORM-TEMPLATE SYNC TEST
   ✅ Perfect sync between form and template
   ⏱️  Duration: 0.00s

4. DATA LOADING TEST
   ✅ /api/data returns landing-data.json (футболки)
   ✅ /generate uses user-config.json (худі)
   ⏱️  Duration: 0.02s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊 TEST RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Passed: 2/4 (50%)
   ❌ placeholders
   ❌ assets
   ✅ formFields
   ✅ dataLoading
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  2 TEST(S) FAILED
```

## 🔍 Детальний звіт

Після запуску тестів дивись **../TEST_REPORT.md** для детального аналізу проблем.

## 📌 Вимоги

- Node.js (будь-яка версія)
- Сервер має бути запущений на http://localhost:6614

## ⚙️ Запуск сервера

```bash
cd constructor
node server.js
```

## 🎯 Exit codes

- **0** - всі тести пройшли ✅
- **1** - є проблеми ❌

## 📖 Документація

- [TEST_STRATEGY.md](./TEST_STRATEGY.md) - Детальна стратегія тестування
- [../TEST_REPORT.md](../TEST_REPORT.md) - Останній звіт про тести
