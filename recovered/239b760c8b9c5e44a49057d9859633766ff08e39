const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'server.js');
let serverCode = fs.readFileSync(serverPath, 'utf8');

console.log('🔧 Виправляю подвійні лапки...\n');

// Replace || '''); with || '');
const before = serverCode;
serverCode = serverCode.replace(/\|\| '''\);/g, "|| '');");

const changesCount = (before.match(/\|\| '''\);/g) || []).length;

fs.writeFileSync(serverPath, serverCode, 'utf8');

console.log(`✅ Виправлено ${changesCount} випадків подвійних лапок`);
