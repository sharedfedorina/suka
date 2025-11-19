const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'server.js');
let serverCode = fs.readFileSync(serverPath, 'utf8');

console.log('🔧 Прибираю ВСІ довгі дефолтні значення...\n');

// ALL fields with defaults that are longer than 30 chars should be replaced with ''
const lines = serverCode.split('\n');
const fixedLines = [];
let changesCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Pattern: const field = (options.field && options.field.trim()) ? options.field : (dataObj.field || 'LONG DEFAULT');
  // We want to find lines where the default is longer than 15 characters
  const match = line.match(/^(\s*const\s+\w+\s*=\s*\(options\.\w+.*?\) \? options\.\w+ : \(dataObj\.\w+\s*\|\|\s*)'(.{15,}?)('\);?)$/);

  if (match) {
    // This line has a long default value (>15 chars) - replace with empty string
    const fixedLine = `${match[1]}''${match[3]}`;
    fixedLines.push(fixedLine);
    changesCount++;
    const fieldName = line.match(/const (\w+)/)[1];
    console.log(`✅ Fixed: ${fieldName}`);
  } else {
    fixedLines.push(line);
  }
}

serverCode = fixedLines.join('\n');
fs.writeFileSync(serverPath, serverCode, 'utf8');

console.log(`\n✅ Виправлено ${changesCount} рядків з довгими дефолтами`);
