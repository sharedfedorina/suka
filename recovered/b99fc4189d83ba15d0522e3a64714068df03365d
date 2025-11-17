const fs = require('fs');
const path = require('path');

// Read server.js
const serverPath = path.join(__dirname, 'server.js');
let serverCode = fs.readFileSync(serverPath, 'utf8');

console.log('🔧 Виправляю багаторядкові дефолтні значення...\n');

// Fields with long/multiline content - should NOT have default values in code
// Instead they should use empty string '' as default
const longFields = [
  'tab1Description',
  'tab2Description',
  'tab3Description',
  'faqItem1Description',
  'faqItem2Description',
  'faqItem3Description',
  'faqItem4Description',
  'howStep1',
  'howStep2',
  'howStep3',
  'howStep4'
];

let changesCount = 0;

longFields.forEach(field => {
  // Pattern: const field = (options.field && options.field.trim()) ? options.field : (dataObj.field || 'LONG DEFAULT VALUE...');
  // We need to remove everything after dataObj.field || and replace with empty string

  // Find the line with this field
  const regex = new RegExp(
    `const ${field} = \\(options\\.${field} && options\\.${field}\\.trim\\(\\)\\) \\? options\\.${field} : \\(dataObj\\.${field} \\|\\| '[\\s\\S]*?'\\);`,
    'g'
  );

  const replacement = `const ${field} = (options.${field} && options.${field}.trim()) ? options.${field} : (dataObj.${field} || '');`;

  if (regex.test(serverCode)) {
    serverCode = serverCode.replace(regex, replacement);
    console.log(`✅ Fixed: ${field}`);
    changesCount++;
  }
});

// Write back
fs.writeFileSync(serverPath, serverCode, 'utf8');

console.log(`\n✅ Виправлено ${changesCount} параметрів`);
