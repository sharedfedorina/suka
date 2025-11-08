#!/usr/bin/env python3
import re

# Read the HTML file
with open('constructor/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Product data for reference
products_data = {
    1: {
        'name': 'Жіноча футболка оверсайз',
        'color': 'Чорний',
        'colorHex': '#19161a',
        'size': 'S, M, L, XL, 2XL, 3XL, 4XL, 5XL',
        'material': '95% бавовна, 5% еластан',
        'priceOld': '585 грн',
        'price': '390 грн'
    },
    2: {
        'name': 'Жіноча футболка оверсайз',
        'color': 'Рожевий',
        'colorHex': '#fc5f88',
        'size': 'S, M, L, XL, 2XL, 3XL, 4XL, 5XL',
        'material': '95% бавовна, 5% еластан',
        'priceOld': '585 грн',
        'price': '390 грн'
    },
    3: {
        'name': 'Жіноча футболка оверсайз',
        'color': 'Пудра',
        'colorHex': '#e2bcc9',
        'size': 'S, M, L, XL, 2XL, 3XL, 4XL, 5XL',
        'material': '95% бавовна, 5% еластан',
        'priceOld': '585 грн',
        'price': '390 грн'
    },
    4: {
        'name': 'Жіноча футболка оверсайз',
        'color': 'Бежевий',
        'colorHex': '#d9cfc1',
        'size': 'S, M, L, XL, 2XL, 3XL, 4XL, 5XL',
        'material': '95% бавовна, 5% еластан',
        'priceOld': '585 грн',
        'price': '390 грн'
    },
    5: {
        'name': 'Жіноча футболка оверсайз',
        'color': 'Хакі',
        'colorHex': '#9b9c7c',
        'size': 'S, M, L, XL, 2XL, 3XL, 4XL, 5XL',
        'material': '95% бавовна, 5% еластан',
        'priceOld': '585 грн',
        'price': '390 грн'
    }
}

# Product mappings (product number to image number used in HTML)
product_images = {
    1: 'product_1',
    2: 'product_3',
    3: 'product_4',
    4: 'product_5',
    5: 'product_6'
}

# Replace products 1-5 with wrapped and placeholder-based versions
# Product 1 (product_1 images) - line 232 onwards
product1_pattern = r'(<div class="products-list">\s*<div class="products-list_point">\s*<div class="swiper products-slider">.*?(?=<div class="products-list_point">))'
# This approach is complex. Let me use a different strategy.

# Split by product blocks and rebuild
# Find start of products section
products_start = html.find('<!--products-->')
products_end = html.find('<!--/products-->')

if products_start == -1 or products_end == -1:
    print("Could not find products section markers")
    exit(1)

# Extract before, products section, and after
before_products = html[:products_start]
products_section = html[products_start:products_end]
after_products = html[products_end:]

# Now process products section - replace each of the 5 main products
# Split by "products-list_point" divs

# Find all product blocks - they start with <div class="products-list_point">
product_blocks = re.findall(r'<div class="products-list_point">.*?</div>\s*(?=(?:<div class="products-list_point">|</div>\s*</section>))',
                            products_section, re.DOTALL)

if len(product_blocks) < 5:
    print(f"Found only {len(product_blocks)} products, need at least 5")
    exit(1)

# Process each of the first 5 product blocks
new_product_blocks = []
for product_num in range(1, 6):
    if product_num - 1 < len(product_blocks):
        block = product_blocks[product_num - 1]

        # Wrap with HTML comments
        block = f'<!--product{product_num}-->\n{block}\n<!--/product{product_num}-->'

        # Replace text values with placeholders
        prod_data = products_data[product_num]

        block = block.replace(prod_data['name'], f'{{{{product{product_num}Name}}}}')
        block = block.replace(prod_data['color'], f'{{{{product{product_num}Color}}}}')
        block = block.replace(prod_data['colorHex'], f'{{{{product{product_num}ColorHex}}}}')
        block = block.replace(prod_data['size'], f'{{{{product{product_num}Size}}}}')
        block = block.replace(prod_data['material'], f'{{{{product{product_num}Material}}}}')
        block = block.replace(prod_data['priceOld'], f'{{{{product{product_num}PriceOld}}}}')
        block = block.replace(prod_data['price'], f'{{{{product{product_num}Price}}}}')
        block = block.replace(f'data-id="product{product_num}"', f'data-id="product{product_num}"')

        new_product_blocks.append(block)

# Reconstruct products section
new_products_section = products_section[:products_section.find('<div class="products-list_point">')] + \
                       '\n'.join(new_product_blocks) + \
                       products_section[products_section.rfind('</div>'):products_section.rfind('</section>')+10]

# Reconstruct full HTML
new_html = before_products + new_products_section + after_products

# Write back
with open('constructor/index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("✅ Products transformed successfully!")
print(f"Modified 5 product blocks with HTML comments and placeholders")
