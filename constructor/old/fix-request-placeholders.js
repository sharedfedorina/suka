const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'views', 'template.ejs');
let html = fs.readFileSync(templatePath, 'utf8');

// REQUEST fields
const replacements = [
  {
    old: '<h1 class="request-title title-xl">Жіночі футболки оверсайз</h1>',
    new: '<h1 class="request-title title-xl">{{requestTitle}}</h1>'
  },
  {
    old: '<span class="timer-descr">До кінця акції залишилося</span>',
    new: '<span class="timer-descr">{{requestTimerText}}</span>'
  },
  {
    old: '<span class="popup-format">Формат телефона: <b>380999999999</b></span>',
    new: '<span class="popup-format">{{requestPhoneFormat}}</span>'
  },
  {
    old: '<span class="request-numbers">Залишилось <b>19</b> футболок по акції</span>',
    new: '<span class="request-numbers">{{requestStockPrefix}} <b>19</b> {{requestStockSuffix}}</span>'
  }
];

// Apply replacements
replacements.forEach(({ old, new: newStr }) => {
  html = html.replace(old, newStr);
});

fs.writeFileSync(templatePath, html, 'utf8');
console.log('✅ REQUEST placeholders замінено успішно');
