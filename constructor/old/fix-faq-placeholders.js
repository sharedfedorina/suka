const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'views', 'template.ejs');
let html = fs.readFileSync(templatePath, 'utf8');

// FAQ answers
const replacements = [
  {
    old: 'Отримуйте своє замовлення максимально швидко. Вже через 1-2 дні після замовлення ви зможете\n                                            його отримати в поштовому відділенні.',
    new: '{{faq1Answer}}'
  },
  {
    old: 'Сплачуйте за товар після перегляду на пошті (накладний платіж) або на картку, як забажаєте.',
    new: '{{faq2Answer}}'
  },
  {
    old: 'Перед відправкою всі посилки проходять ретельну перевірку, щоб Ви отримали замовлення в\n                                            найкращому вигляді.',
    new: '{{faq3Answer}}'
  },
  {
    old: 'Наші офіційні партнери Нова пошта та Укрпошта.',
    new: '{{faq4Answer}}'
  }
];

// FAQ questions
const questionReplacements = [
  { old: 'Оплата', new: '{{faq2Question}}' },
  { old: 'Надійність', new: '{{faq3Question}}' },
  { old: 'Наші партнери', new: '{{faq4Question}}' }
];

// Apply replacements
replacements.forEach(({ old, new: newStr }) => {
  html = html.replace(old, newStr);
});

// Apply question replacements (in context of FAQ section only)
questionReplacements.forEach(({ old, new: newStr }) => {
  html = html.replace(
    new RegExp(`<h3 class="faq-list_title title-md">${old}</h3>`, 'g'),
    `<h3 class="faq-list_title title-md">${newStr}</h3>`
  );
});

fs.writeFileSync(templatePath, html, 'utf8');
console.log('✅ FAQ placeholders замінено успішно');
