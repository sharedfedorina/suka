const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'server.log');

/**
 * Логує повідомлення у файл та консоль
 */
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type}] ${message}`;
  
  // Пишемо у файл
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
  
  // Виводимо в консоль
  console.log(logMessage);
}

/**
 * Логує помилку
 */
function error(message, err) {
  const errorMsg = err ? `${message}: ${err.message}` : message;
  log(errorMsg, 'ERROR');
  if (err && err.stack) {
    fs.appendFileSync(LOG_FILE, err.stack + '\n');
  }
}

/**
 * Логує запит
 */
function request(method, url, ip) {
  log(`${method} ${url} - IP: ${ip}`, 'REQUEST');
}

/**
 * Очищує лог файл
 */
function clearLog() {
  fs.writeFileSync(LOG_FILE, '');
  log('Лог файл очищено', 'SYSTEM');
}

module.exports = {
  log,
  error,
  request,
  clearLog
};
