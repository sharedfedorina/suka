/**
 * PHASE 1: Генерація детального звіту про відсутні placeholders
 * Категоризує всі відсутні placeholders для подальшої імплементації
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('📋 PHASE 1: АНАЛІЗ ВІДСУТНІХ PLACEHOLDERS');
console.log('='.repeat(60) + '\n');

// Завантажуємо auto-generated mapping
const mappingPath = path.join(__dirname, 'config-to-placeholder-mapping-AUTO.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Завантажуємо template
const templatePath = path.join(__dirname, 'views', 'template.ejs');
const templateContent = fs.readFileSync(templatePath, 'utf8');

// Знаходимо всі відсутні placeholders
const missing = [];
const existing = [];

for (const [configKey, placeholder] of Object.entries(mapping.mapping)) {
  if (!templateContent.includes(placeholder)) {
    missing.push({ configKey, placeholder });
  } else {
    existing.push({ configKey, placeholder });
  }
}

console.log(`✅ Існуючі: ${existing.length}`);
console.log(`❌ Відсутні: ${missing.length}`);
console.log(`📊 Всього: ${existing.length + missing.length}\n`);

// Категоризація відсутніх placeholders
const categories = {
  'Meta/SEO': [],
  'Hero Section': [],
  'Video Section': [],
  'Products Section': [],
  'Size Chart': [],
  'Tabs Section': [],
  'Reviews Section': [],
  'FAQ Section': [],
  'How To Buy Section': [],
  'Request Form': [],
  'Enable Flags': [],
  'Benefits': [],
  'Product Images': [],
  'Other': []
};

missing.forEach(({ configKey, placeholder }) => {
  if (configKey.startsWith('page.')) {
    categories['Meta/SEO'].push({ configKey, placeholder });
  } else if (configKey.startsWith('hero') || configKey === 'heroButtonText' || configKey === 'heroImage') {
    categories['Hero Section'].push({ configKey, placeholder });
  } else if (configKey.includes('video') || configKey.includes('Video')) {
    categories['Video Section'].push({ configKey, placeholder });
  } else if (configKey.includes('product') && configKey.includes('Section')) {
    categories['Products Section'].push({ configKey, placeholder });
  } else if (configKey.includes('action')) {
    categories['Products Section'].push({ configKey, placeholder });
  } else if (configKey.includes('sizeChart') || configKey.includes('SizeChart')) {
    categories['Size Chart'].push({ configKey, placeholder });
  } else if (configKey.includes('tab') && !configKey.includes('enable')) {
    categories['Tabs Section'].push({ configKey, placeholder });
  } else if (configKey.includes('review') || configKey.includes('Review')) {
    categories['Reviews Section'].push({ configKey, placeholder });
  } else if (configKey.includes('faq') || configKey.includes('Faq')) {
    categories['FAQ Section'].push({ configKey, placeholder });
  } else if (configKey.includes('how') || configKey.includes('How')) {
    categories['How To Buy Section'].push({ configKey, placeholder });
  } else if (configKey.includes('request') || configKey.includes('Request')) {
    categories['Request Form'].push({ configKey, placeholder });
  } else if (configKey.startsWith('enable') || configKey.includes('Enable')) {
    categories['Enable Flags'].push({ configKey, placeholder });
  } else if (configKey.includes('benefit') && (configKey.includes('id') || configKey.includes('enabled'))) {
    categories['Benefits'].push({ configKey, placeholder });
  } else if (configKey.includes('product') && configKey.includes('Images')) {
    categories['Product Images'].push({ configKey, placeholder });
  } else {
    categories['Other'].push({ configKey, placeholder });
  }
});

// Вивести категорії
console.log('📂 КАТЕГОРИЗАЦІЯ ВІДСУТНІХ PLACEHOLDERS:\n');

let totalCategorized = 0;
for (const [category, items] of Object.entries(categories)) {
  if (items.length > 0) {
    console.log(`\n${category} (${items.length}):`);
    console.log('─'.repeat(60));
    items.forEach(({ configKey, placeholder }) => {
      console.log(`  ${configKey.padEnd(45)} → ${placeholder}`);
    });
    totalCategorized += items.length;
  }
}

console.log('\n' + '='.repeat(60));
console.log(`📊 Всього категоризовано: ${totalCategorized} з ${missing.length}`);
console.log('='.repeat(60) + '\n');

// Створити JSON звіт
const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    total: existing.length + missing.length,
    existing: existing.length,
    missing: missing.length,
    percentage_missing: ((missing.length / (existing.length + missing.length)) * 100).toFixed(1) + '%'
  },
  categories: {},
  missingPlaceholders: missing,
  existingPlaceholders: existing
};

// Додати категорії до звіту
for (const [category, items] of Object.entries(categories)) {
  if (items.length > 0) {
    report.categories[category] = {
      count: items.length,
      priority: getPriority(category),
      items: items
    };
  }
}

// Визначити пріоритет категорії
function getPriority(category) {
  const highPriority = ['Meta/SEO', 'Hero Section', 'Products Section', 'Request Form'];
  const mediumPriority = ['Video Section', 'Size Chart', 'Tabs Section', 'FAQ Section', 'How To Buy Section'];
  const lowPriority = ['Reviews Section', 'Enable Flags', 'Benefits', 'Product Images', 'Other'];

  if (highPriority.includes(category)) return 'HIGH';
  if (mediumPriority.includes(category)) return 'MEDIUM';
  return 'LOW';
}

// Зберегти звіт
const reportPath = path.join(__dirname, 'missing-placeholders-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

console.log(`💾 Звіт збережено: missing-placeholders-report.json\n`);

// Вивести пріоритети
console.log('🎯 ПРІОРИТЕТИ ІМПЛЕМЕНТАЦІЇ:\n');

const byPriority = {
  HIGH: [],
  MEDIUM: [],
  LOW: []
};

for (const [category, data] of Object.entries(report.categories)) {
  byPriority[data.priority].push({ category, count: data.count });
}

['HIGH', 'MEDIUM', 'LOW'].forEach(priority => {
  if (byPriority[priority].length > 0) {
    console.log(`\n${priority} PRIORITY:`);
    byPriority[priority].forEach(({ category, count }) => {
      console.log(`  ✓ ${category} (${count} placeholders)`);
    });
  }
});

console.log('\n' + '='.repeat(60));
console.log('✅ PHASE 1 ЗАВЕРШЕНО');
console.log('='.repeat(60) + '\n');
