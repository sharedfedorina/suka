const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'views', 'template.ejs');
let html = fs.readFileSync(templatePath, 'utf8');

// SEO/META fields
const replacements = [
  {
    old: '<title>Жіночі футболки оверсайз від українскього бренду Kopo</title>',
    new: '<title>{{pageTitle}}</title>'
  },
  {
    old: '<meta name="description" content="Жіночі футболки оверсайз від українскього бренду Kopo">',
    new: '<meta name="description" content="{{pageDescription}}">'
  },
  {
    old: '<meta property="og:title" content="Kopo">',
    new: '<meta property="og:title" content="{{pageTitle}}">'
  },
  {
    old: '<meta property="og:description" content="Жіночі футболки оверсайз від українскього бренду Kopo">',
    new: '<meta property="og:description" content="{{pageDescription}}">'
  }
];

// Apply replacements
replacements.forEach(({ old, new: newStr }) => {
  html = html.replace(old, newStr);
});

fs.writeFileSync(templatePath, html, 'utf8');
console.log('✅ SEO/META placeholders замінено успішно');
