const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'views', 'template.ejs');
let html = fs.readFileSync(templatePath, 'utf8');

// HOW TO steps
const replacements = [
  {
    old: '<li class="text-l">Залиште заявку на обрані Вами футболки</li>',
    new: '<li class="text-l">{{howStep1}}</li>'
  },
  {
    old: '<li class="text-l">Ми Вам швидко зателефонуємо</li>',
    new: '<li class="text-l">{{howStep2}}</li>'
  },
  {
    old: '<li class="text-l">Доставимо за 1-2 дні</li>',
    new: '<li class="text-l">{{howStep3}}</li>'
  },
  {
    old: '<li class="text-l">Сплачуйте при отриманні</li>',
    new: '<li class="text-l">{{howStep4}}</li>'
  }
];

// Apply replacements
replacements.forEach(({ old, new: newStr }) => {
  html = html.replace(old, newStr);
});

fs.writeFileSync(templatePath, html, 'utf8');
console.log('✅ HOW TO placeholders замінено успішно');
