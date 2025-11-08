#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

with open('views/template.ejs', 'r', encoding='utf-8') as f:
    content = f.read()

# ЗАМІНА 1: Переваги (advantages loop)
old_advantages = '''     <ul class="plus-list">
      <li class="plus-list_point">
       <img class="plus-list_icon" src="icons/plus/plus-1.svg" alt="img">
       <span class="plus-list_descr text-l"><b>Безкоштовна доставка</b> <br>Доставимо будь-куди по Україні без прихованих платежів. Страховка включена.</span>
      </li>
      <li class="plus-list_point">
       <img class="plus-list_icon" src="icons/plus/plus-2.svg" alt="img">
       <span class="plus-list_descr text-l"><b>Гарантія 2 роки</b> <br> Повна гарантія на всі компоненти. Сервіс розташований у Києві, Харкові, Львові.</span>
      </li>
      <li class="plus-list_point">
       <img class="plus-list_icon" src="icons/plus/plus-3.svg" alt="img">
       <span class="plus-list_descr text-l"><b>Встановлення та навчання</b> <br> Безплатна розпакування, установка та базове навчання персоналу на місці.</span>
      </li>
      <li class="plus-list_point">
       <img class="plus-list_icon" src="icons/plus/plus-4.svg" alt="img">
       <span class="plus-list_descr text-l"><b>Технічна підтримка 24/7</b> <br>Лінія гарячої підтримки завжди готова допомогти. Онлайн консультація з інженерами.</span>
      </li>
      <li class="plus-list_point">
       <img class="plus-list_icon" src="icons/plus/plus-5.svg" alt="img">
       <span class="plus-list_descr text-l"><b>Офіційний дилер</b> <br> Оригінальні запчастини та матеріали. <br> Авторизований сервіс виробника!</span>
      </li>
     </ul>'''

new_advantages = '''     <ul class="plus-list">
      <% data.advantages.forEach((adv, index) => { %>
      <li class="plus-list_point">
       <img class="plus-list_icon" src="<%= adv.icon %>" alt="img">
       <span class="plus-list_descr text-l"><b><%= adv.title %></b> <br><%= adv.description %></span>
      </li>
      <% }) %>
     </ul>'''

content = content.replace(old_advantages, new_advantages)

print('OK - Template expanded with loops')
print('✓ Advantages loop added')

with open('views/template.ejs', 'w', encoding='utf-8') as f:
    f.write(content)

print('Template updated')
