---
name: check-mapping
description: Перевірити маппінг плейсхолдерів для секції
---

# Перевірка маппінгу плейсхолдерів

Запитай людину: **"Яку секцію перевірити? (hero/benefits/products/...)"**

Потім для вибраної секції (наприклад, hero):

## 1. Перевір форму (`/sections/hero.html`)
```bash
grep 'id=' sections/hero.html | grep -E '(heroTitle|heroPrice|heroImage)'
```

Шукай: `id="heroTitle"`, `id="heroPrice"`, etc.

## 2. Перевір config (`user-config.json`)
```bash
cat user-config.json | grep -E '(heroTitle|heroPrice|heroImage)'
```

Має бути: `"heroTitle": "..."`, `"heroPrice": "..."`, etc.

## 3. Перевір template (`/modules/hero.html`)
```bash
grep '{{' modules/hero.html | grep -E '(heroTitle|heroPrice|heroImage)'
```

Шукай: `{{heroTitle}}`, `{{heroPrice}}`, etc.

## 4. Перевір replacement (`/server/replacements/...`)
```bash
# Якщо є окремий replacement для цієї секції
cat server/replacements/hero.js | grep -E '(heroTitle|heroPrice)'
```

---

**КРИТИЧНО:** Всі назви мають бути ОДНАКОВІ!

**Якщо знайшов невідповідність - ЗУПИНИСЬ і повідом!**
