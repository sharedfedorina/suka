const fs = require('fs');
const { PATHS } = require('./constants');

/**
 * Завантажує конфіг з файлу
 */
function loadConfig() {
  try {
    const data = fs.readFileSync(PATHS.CONFIG, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('❌ Помилка при завантаженні конфігу:', err.message);
    return {};
  }
}

/**
 * Зберігає конфіг у файл
 */
function saveConfig(config) {
  try {
    fs.writeFileSync(PATHS.CONFIG, JSON.stringify(config, null, 2), 'utf8');
    console.log('✅ Конфіг збережено');
    return true;
  } catch (err) {
    console.error('❌ Помилка при збереженні конфігу:', err.message);
    return false;
  }
}

/**
 * Оновлює конфіг (мерджить з існуючим)
 */
function updateConfig(newData) {
  try {
    const currentConfig = loadConfig();
    const updatedConfig = { ...currentConfig, ...newData };
    return saveConfig(updatedConfig);
  } catch (err) {
    console.error('❌ Помилка при оновленні конфігу:', err.message);
    return false;
  }
}

module.exports = {
  loadConfig,
  saveConfig,
  updateConfig
};
