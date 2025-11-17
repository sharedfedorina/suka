const fs = require('fs');
const path = require('path');

// Read server.js
const serverPath = path.join(__dirname, 'server.js');
let serverCode = fs.readFileSync(serverPath, 'utf8');

// List of all fields that need fallback (from user-config.json)
const fieldsNeedingFallback = [
  'headerText', 'heroTitle', 'heroPrice', 'heroImage', 'imageUrl', 'videoUrl',
  'videoThumbnailDesktop', 'videoThumbnailMobile', 'sizeChartImage',
  'infoBrandLabel', 'infoBrandValue', 'infoModelLabel', 'infoModelValue',
  'infoQuantityLabel', 'infoQuantityValue', 'infoColorsLabel',
  'infoSizesLabel', 'infoSizesValue', 'infoMaterialLabel', 'infoMaterialValue',
  'infoPackagingLabel', 'infoPackagingValue',

  // Benefits array - already has fallback

  // Products 1-5 - handled in loop, check if loop has fallback

  // Products 8, 9
  'product8Name', 'product8Color', 'product8ColorHex', 'product8Size', 'product8Material',
  'product8PriceOld', 'product8Price',
  'product9Name', 'product9Color', 'product9ColorHex', 'product9Size', 'product9Material',
  'product9PriceOld', 'product9Price',

  // Tabs
  'tabsLabel', 'tabsTitle',
  'tab1Title', 'tab1Description', 'tab1Image',
  'tab2Title', 'tab2Description', 'tab2Image',
  'tab3Title', 'tab3Description', 'tab3Image',

  // FAQ
  'faqLabel', 'faqTitle', 'faqImage',
  'faqItem1Title', 'faqItem1Description',
  'faqItem2Title', 'faqItem2Description',
  'faqItem3Title', 'faqItem3Description',
  'faqItem4Title', 'faqItem4Description',

  // How
  'howLabel', 'howTitle', 'howStep1', 'howStep2', 'howStep3', 'howStep4',

  // Comments
  'commentsLabel', 'commentsTitle', 'commentsSalesStat', 'commentsSalesText',
  'commentsSatisfiedStat', 'commentsSatisfiedText', 'commentsRepeatStat', 'commentsRepeatText',
  'commentsButtonText',

  // Request Form
  'requestInfoTitle', 'requestInfoDescription', 'requestButtonText',
  'requestNamePlaceholder', 'requestPhonePlaceholder',

  // Popup
  'popupLabel', 'popupTitle', 'popupButtonText', 'popupSuccessMessage',
  'popupNamePlaceholder', 'popupPhonePlaceholder',

  // Action Bar & Products Section
  'actionChooseText', 'productsSectionLabel', 'productsSectionTitle',

  // Footer
  'footerCopyright', 'footerLink1', 'footerLink2', 'footerLink3',

  // Integrations
  'salesdriveApiKey', 'salesdriveEndpoint', 'salesdriveFunnelId',
  'metaPixelId', 'metaAccessToken', 'metaTestEventCode',
  'productId', 'sku', 'website'
];

// Counter
let changesCount = 0;

// Add fallback to each field
fieldsNeedingFallback.forEach(field => {
  // Pattern 1: const fieldName = (options.field && options.field.trim()) ? options.field : '';
  const pattern1 = new RegExp(
    `const ${field} = \\(options\\.${field} && options\\.${field}\\.trim\\(\\)\\) \\? options\\.${field} : '';`,
    'g'
  );

  const replacement1 = `const ${field} = (options.${field} && options.${field}.trim()) ? options.${field} : (dataObj.${field} || '');`;

  if (pattern1.test(serverCode)) {
    serverCode = serverCode.replace(pattern1, replacement1);
    console.log(`✅ Added fallback for: ${field}`);
    changesCount++;
  }

  // Pattern 2: const rawField = (options.field && options.field.trim()) ? options.field : '';
  const rawFieldName = 'raw' + field.charAt(0).toUpperCase() + field.slice(1);
  const pattern2 = new RegExp(
    `const ${rawFieldName} = \\(options\\.${field} && options\\.${field}\\.trim\\(\\)\\) \\? options\\.${field} : '';`,
    'g'
  );

  const replacement2 = `const ${rawFieldName} = (options.${field} && options.${field}.trim()) ? options.${field} : (dataObj.${field} || '');`;

  if (pattern2.test(serverCode)) {
    serverCode = serverCode.replace(pattern2, replacement2);
    console.log(`✅ Added fallback for: ${rawFieldName}`);
    changesCount++;
  }
});

// Arrays that need fallback
const arraysNeedingFallback = ['benefits', 'commentsImages'];

arraysNeedingFallback.forEach(field => {
  const pattern = new RegExp(`const ${field} = options\\.${field} \\|\\| \\[\\];`, 'g');
  const replacement = `const ${field} = options.${field} || dataObj.${field} || [];`;

  if (pattern.test(serverCode)) {
    serverCode = serverCode.replace(pattern, replacement);
    console.log(`✅ Added fallback for array: ${field}`);
    changesCount++;
  }
});

// Write back
fs.writeFileSync(serverPath, serverCode, 'utf8');

console.log(`\n✅ ЗАВЕРШЕНО! Додано fallback для ${changesCount} параметрів`);
