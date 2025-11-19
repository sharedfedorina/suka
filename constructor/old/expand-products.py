#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import json

# Read template
with open('views/template.ejs', 'r', encoding='utf-8') as f:
    template = f.read()

# Read JSON to know how many products we have
with open('data/landing-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

num_products = len(data['products']['items'])
print(f'Found {num_products} products in JSON')

# For now, simplify products section - remove the hardcoded products and replace with a loop
# This is a simplified approach that generates basic product HTML

new_products_section = '''      <div class="products-list">
       <% data.products.items.forEach((product, index) => { %>
       <div class="products-list_point">
        <div class="swiper products-slider">
         <div class="swiper-wrapper">
          <div class="swiper-slide products-slide">
           <picture>
            <source srcset="img/products/product_<%= index + 1 %>.jpg" media="(min-width: 800px)">
            <img src="img/products/product_<%= index + 1 %>_m.webp" alt="img">
           </picture>
          </div>
         </div>
         <div class="products-navigation">
          <span class="products-arrow products-prev">
           <svg width="10" height="15" viewBox="0 0 10 15" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.4375 1.25L1.96875 7.71875L8.4375 14.1875" stroke-width="2" />
           </svg>
          </span>
          <div class="swiper-pagination products-pagination"></div>
          <span class="products-arrow products-next">
           <svg width="10" height="15" viewBox="0 0 10 15" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5625 13.75L8.03125 7.28125L1.5625 0.8125" stroke-width="2" />
           </svg>
          </span>
         </div>
        </div>
        <div class="products-text">
         <h3 class="products-text_title">
          <%= product.name %><br> <%= product.subtitle %>         </h3>
         <ul class="products-text_list">
          <% if (product.specs && product.specs.length > 0) { %>
            <% product.specs.forEach((spec) => { %>
            <li class="info-list_point">
             <span><%= spec.name %>:</span>
             <span><%= spec.value %></span>
            </li>
            <% }) %>
          <% } %>
         </ul>
         <div class="products-text_price price">
          <span class="price-discount">
           <%= product.price_old %> <%= product.currency %>          </span>
          <span class="price-total">
           <%= product.price_new %> <%= product.currency %>
          </span>
         </div>
         <button class="products-text_btn btn-one btn-modal" data-id="product<%= index + 1 %>">ЗАМОВИТИ<span></span></button>
        </div>
       </div>
       <% }) %>
      </div>'''

# Find the products section
products_start = template.find('<div class="products-list">')
products_end = template.find('<!--/products-->') + len('<!--/products-->')

if products_start != -1 and products_end > products_start:
    new_template = template[:products_start] + new_products_section + '\n    ' + template[products_end:]

    with open('views/template.ejs', 'w', encoding='utf-8') as f:
        f.write(new_template)

    print('OK - Products loop added')
    print(f'Products simplified to dynamic loop')
else:
    print('ERROR - Could not find products section')

