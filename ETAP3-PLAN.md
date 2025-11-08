# 🎨 ЕТАП 3: РОЗРОБКА EJS ШАБЛОНУ

## 📋 План розробки

### Крок 1: Скопіювати HTML структуру
- Взяти printer-landing/index.html (1530 строк)
- Копіювати в views/template.ejs

### Крок 2: Замінити жорсткі значення на EJS змінні

#### Замінити:
```html
<!-- БУЛО -->
<title>Професійні 3D принтери для виробництва | Printex Pro</title>

<!-- СТАНЕ -->
<title><%= data.metadata.title %></title>
```

#### Приклади замін:

**Метаданні:**
```ejs
<%= data.metadata.title %>
<%= data.metadata.description %>
<%= data.metadata.brand %>
```

**Hero секція:**
```ejs
<h1><%= data.hero.title %></h1>
<span class="price-total">від <%= data.hero.price %> <%= data.hero.currency %></span>
<span class="start-numbers">Залишилось <b><%= data.hero.count %></b> <%= data.hero.count_unit %></span>
```

**Переваги (loop):**
```ejs
<% data.advantages.forEach((adv, i) => { %>
  <li class="plus-list_point">
    <img src="<%= adv.icon %>" alt="img">
    <span class="plus-list_descr text-l">
      <b><%= adv.title %></b> <br>
      <%= adv.description %>
    </span>
  </li>
<% }) %>
```

**Товари (loop):**
```ejs
<% data.products.items.forEach((product) => { %>
  <div class="products-list_point">
    <h3 class="products-text_title">
      <%= product.name %>
      <br> <%= product.subtitle %>
    </h3>
    <span class="price-discount"><%= product.price_old %> <%= product.currency %></span>
    <span class="price-total"><%= product.price_new %> <%= product.currency %></span>
  </div>
<% }) %>
```

### Крок 3: Розділити на компоненти (опціонально)
- _header.ejs
- _hero.ejs
- _advantages.ejs
- _products.ejs
- _footer.ejs

### Крок 4: Тестувати генерацію

#### Тест 1: Рендер шаблону
```javascript
res.render('template', { data: jsonData })
```

#### Тест 2: Перевірити HTML
- Усі змінні підставлені
- Усі <div> закриті
- CSS завантажується
- JS завантажується

#### Тест 3: В браузері
- Відкрити згенерований HTML
- Перевірити дизайн
- Тестувати JavaScript (слайдери, таймер)

---

## 🎯 Метакроків:

1. **Стовпити template.ejs з жорсткими даними** ✅ Це буде як printer-landing/index.html
2. **Замінити значення на EJS змінні** ⏳ Почнемо з цього
3. **Тестувати генерацію HTML** ⏳
4. **Розробити маршрут /generate** ⏳
5. **Готово!** ⏳

---

## ⏱️ Орієнтовний час:

- Копіювання HTML: 5 хв
- Заміна змінних: 30 хв
- Тестування: 15 хв
- **Всього: ~50 хвилин**

