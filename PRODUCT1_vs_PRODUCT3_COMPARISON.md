# COMPREHENSIVE COMPARISON: PRODUCT 1 vs PRODUCT 3

## ALL DIFFERENCES BETWEEN PRODUCT 1 AND PRODUCT 3 IMPLEMENTATIONS

---

## FILE: `constructor/data/landing-data.json`

### In the "products" array section:

| Property | Product 1 | Product 3 |
|----------|-----------|-----------|
| id | "product1" | "product3" |
| name | "Жіноча футболка оверсайз" | "Жіноча футболка оверсайз" |
| color | "Рожевий" | "Червоний" |
| color_hex | "#fc5f88" | "#f80e28" |
| size | "S, M, L, XL, 2XL, 3XL, 4XL, 5XL" | "S, M, L, XL, 2XL, 3XL, 4XL, 5XL" |
| material | "95% бавовна, 5% еластан" | "95% бавовна, 5% еластан" |
| price_old | "585 грн" | "585 грн" |
| price_new | "390 грн" | "390 грн" |
| **images** | 6 images: product_1.jpg to product_1_5.jpg | 9 images: product_3.jpg to product_3_8.jpg |

### In flat structure section:

| Property | Product 1 | Product 3 |
|----------|-----------|-----------|
| **Color** | "Чорний" (Black) | "Пудра" (Powder) |
| **ColorHex** | "#19161a" | "#e2bcc9" |
| **Size** | "S, M, L, XL, 2XL, 3XL, 4XL, 5XL" | "S, M, L, XL, 2XL, 3XL, 4XL, 5XL" |
| **Material** | "95% бавовна, 5% еластан" | "95% бавовна, 5% еластан" |
| **PriceOld** | "585 грн" | "585 грн" |
| **Price** | "390 грн" | "390 грн" |
| **Images** | 8 images (product_1.jpg to product_1_7.jpg) | 8 images (product_4.jpg to product_4_7.jpg) |

---

## FILE: `constructor/form.html`

### Product 1 Form Section (lines 233-277):
- Collapsible div ID: `productCollapsible1`
- Header title: "📦 Продукт 1"
- Enable checkbox ID: `enableProduct1`
- All field IDs: `product1Name`, `product1Color`, `product1ColorHex`, `product1Size`, `product1Material`, `product1PriceOld`, `product1Price`
- Color placeholder: "Чорний"
- Hex placeholder: "#19161a"
- Size placeholder: "S, M, L..."
- Material placeholder: "95% бавовна, 5% еластан"
- Old price placeholder: "585 грн"
- New price placeholder: "390 грн"
- Image management section ID: `product1ImagesList`
- New image input ID: `product1NewImage`
- Add button onclick: `addProductImage(1)`
- Image path placeholder: "img/products/product_1.jpg"

### Product 3 Form Section (lines 341-385):
- Collapsible div ID: `productCollapsible3`
- Header title: "📦 Продукт 3"
- Enable checkbox ID: `enableProduct3`
- All field IDs: `product3Name`, `product3Color`, `product3ColorHex`, `product3Size`, `product3Material`, `product3PriceOld`, `product3Price`
- Color placeholder: "Пудра"
- Hex placeholder: "#e2bcc9"
- Size placeholder: "S, M, L..."
- Material placeholder: "95% бавовна, 5% еластан"
- Old price placeholder: "585 грн"
- New price placeholder: "390 грн"
- Image management section ID: `product3ImagesList`
- New image input ID: `product3NewImage`
- Add button onclick: `addProductImage(3)`
- Image path placeholder: "img/products/product_3.jpg"

### KEY FORM DIFFERENCES:
1. **All IDs**: `product1*` → `product3*`
2. **Color value**: "Чорний" → "Пудра"
3. **Hex color**: "#19161a" → "#e2bcc9"
4. **Image path suffix**: product_1 → product_3
5. **BOTH use TEXT INPUT for hex**, not color picker

---

## FILE: `constructor/js/form.js`

### Global Variables:
- `product1Data` object (line 11) vs `product3Data` object (line 15)
- `product1Images` array (line 25) vs `product3Images` array (line 29)

### In `saveFormToServer()` function:
```
Product 1 (lines 487-501):
- product1Name, product1Color, product1ColorHex, product1Size, product1Material, product1PriceOld, product1Price
- getSelectedSizesAsString(1)
- enableProduct1

Product 3 (lines 519-533):
- product3Name, product3Color, product3ColorHex, product3Size, product3Material, product3PriceOld, product3Price
- getSelectedSizesAsString(3)
- enableProduct3
```

### In `getFormParams()` function:
```
Product 1 (lines 1136-1150):
- product1Name, product1Color, product1ColorHex, product1Size, product1Material, product1PriceOld, product1Price
- getSelectedSizesAsString(1)
- enableProduct1 (returns 'on' or 'off')

Product 3 (lines 1168-1182):
- product3Name, product3Color, product3ColorHex, product3Size, product3Material, product3PriceOld, product3Price
- getSelectedSizesAsString(3)
- enableProduct3 (returns 'on' or 'off')
```

### Image Arrays:
- `product1Images: JSON.stringify(product1Images)` vs `product3Images: JSON.stringify(product3Images)`

---

## FILE: `constructor/server.js`

### In `/api/original-form-data` GET endpoint (lines 302-328):
```
Product 1:
- product1Name, product1Color, product1ColorHex, product1Size, product1Material, product1PriceOld, product1Price
- product1Images
- enableProduct1

Product 3:
- product3Name, product3Color, product3ColorHex, product3Size, product3Material, product3PriceOld, product3Price
- product3Images
- enableProduct3
```

### In `/api/get-user-config` GET endpoint:
- Default values for product1* and product3* fields
- All default to empty strings except booleans which default to `true`

### In `generateHTML()` function:
- Uses loop: `for (let i = 1; i <= 5; i++)`
- Dynamic placeholder replacement: `{{product${i}Name}}`, `{{product${i}Color}}`, etc.
- Dynamic product removal: `<!--product${i}-->...<!--/product${i}-->`

---

## FILE: `constructor/index.html` (Template)

### Product 1 Section (lines 245-347):
```html
<!--product1-->
<h3>Жіноча футболка оверсайз <br> Колір: {{product1Color}}</h3>
<circle cx="13" cy="13" r="13" fill="{{product1ColorHex}}" />
<span>{{product1Size}}</span>
<span>{{product1Material}}</span>
<p class="products-text_price">{{product1PriceOld}} <span>{{product1Price}}</span></p>
<button class="products-text_btn btn-one btn-modal" data-id="product1">ЗАМОВИТИ</button>
<div class="swiper products-slider">{{product1Slides}}</div>
<!--/product1-->
```

### Product 3 Section (lines 402-455):
```html
<!--product3-->
<h3>Жіноча футболка оверсайз <br> Колір: {{product3Color}}</h3>
<circle cx="13" cy="13" r="13" fill="{{product3ColorHex}}" />
<span>{{product3Size}}</span>
<span>{{product3Material}}</span>
<p class="products-text_price">{{product3PriceOld}} <span>{{product3Price}}</span></p>
<button class="products-text_btn btn-one btn-modal" data-id="product3">ЗАМОВИТИ</button>
<div class="swiper products-slider">{{product3Slides}}</div>
<!--/product3-->
```

### KEY TEMPLATE DIFFERENCES:
1. **HTML comments**: `<!--product1-->` vs `<!--product3-->`
2. **All placeholders**: `{{product1...}}` vs `{{product3...}}`
3. **Button data-id**: `data-id="product1"` vs `data-id="product3"`
4. **Slides placeholder**: `{{product1Slides}}` vs `{{product3Slides}}`

---

## FILE: `constructor/transform_products.py`

### In products_data dictionary:
```python
Product 1 (key 1):
- name: 'Жіноча футболка оверсайз'
- color: 'Чорний'
- colorHex: '#19161a'

Product 3 (key 3):
- name: 'Жіноча футболка оверсайз'
- color: 'Пудра'
- colorHex: '#e2bcc9'
```

### In product_images mapping:
- Product 1 maps to: 'product_1'
- Product 3 maps to: 'product_4'

---

## COMPLETE SUMMARY TABLE

| Aspect | Product 1 | Product 3 |
|--------|-----------|-----------|
| **HTML IDs/Attributes** | product1* | product3* |
| **Placeholder Color Name** | Чорний (Black) | Пудра (Powder) |
| **Placeholder Hex Code** | #19161a | #e2bcc9 |
| **Form Collapsible ID** | productCollapsible1 | productCollapsible3 |
| **All Form Field IDs** | product1Name, product1Color, product1ColorHex, etc. | product3Name, product3Color, product3ColorHex, etc. |
| **Input Type for Color** | TEXT INPUT (not color picker) | TEXT INPUT (not color picker) |
| **Input Type for Size** | TEXT INPUT (comma-separated) | TEXT INPUT (comma-separated) |
| **Size Checkbox Classes** | N/A (uses text input) | N/A (uses text input) |
| **Image Folder** | product_1 (or product_1_1, product_1_2, etc.) | product_3 (or product_4 in some places) |
| **Data Attribute** | data-id="product1" | data-id="product3" |
| **JavaScript Data Object** | product1Data | product3Data |
| **JavaScript Image Array** | product1Images | product3Images |
| **Material** | IDENTICAL: 95% бавовна, 5% еластан | IDENTICAL: 95% бавовна, 5% еластан |
| **Price Old** | IDENTICAL: 585 грн | IDENTICAL: 585 грн |
| **Price New** | IDENTICAL: 390 грн | IDENTICAL: 390 грн |
| **Size Options (default)** | IDENTICAL: S, M, L, XL, 2XL, 3XL, 4XL, 5XL | IDENTICAL: S, M, L, XL, 2XL, 3XL, 4XL, 5XL |

---

## ARCHITECTURAL PATTERN

Both products follow the **"ONE CODE - DIFFERENT CONFIG FILES"** pattern:

1. **Single JavaScript logic** handles both through dynamic product numbers
2. **Single form template** with field IDs that include product number as suffix
3. **Single server-side generation** using placeholders `{{productNName}}` format
4. **Single landing page template** with product blocks wrapped in `<!--productN-->...<!--/productN-->`
5. **Loop-based processing** in JavaScript and backend uses: `for (let i = 1; i <= 5; i++)`

### The ONLY differences are:
- **Product number suffix** (1 vs 3) in all IDs, class names, and variable names
- **Color information** (color name and hex code)
- **Image file path prefixes** (different product photo directories)
- **No functional code differences** - identical logic applies to both

---

## CONCLUSION

Product 1 and Product 3 are **structurally identical** with the same input field types and validation logic. The only meaningful differences are the **data values**: color information and image paths. This confirms that the system is designed as a **generic template** that can handle any number of products by simply:

1. Adding product data to `landing-data.json`
2. Creating form sections with numbered IDs
3. Using the product number in placeholders
4. Providing the appropriate image files

The implementation is **clean, scalable, and consistent**.
