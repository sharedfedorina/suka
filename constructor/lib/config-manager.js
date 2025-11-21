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
 * Глибокий мердж об'єктів (не перетирає існуючі значення пустими)
 */
function deepMerge(current, updates) {
  const result = { ...current };

  for (const key in updates) {
    const updateValue = updates[key];
    const currentValue = current[key];

    // Не перетираємо існуючі значення пустими
    if (updateValue === '' || updateValue === null || updateValue === undefined) {
      // Пропускаємо пусті значення - залишаємо існуючі
      continue;
    }

    // Не перетираємо існуючі масиви пустими масивами
    if (Array.isArray(updateValue) && updateValue.length === 0 &&
        Array.isArray(currentValue) && currentValue.length > 0) {
      // Залишаємо існуючий масив
      continue;
    }

    // Для об'єктів робимо рекурсивний мердж
    if (typeof updateValue === 'object' && !Array.isArray(updateValue) && updateValue !== null &&
        typeof currentValue === 'object' && !Array.isArray(currentValue) && currentValue !== null) {
      result[key] = deepMerge(currentValue, updateValue);
    } else {
      // Для примітивів та масивів - оновлюємо значення
      result[key] = updateValue;
    }
  }

  return result;
}

/**
 * Оновлює конфіг (мерджить з існуючим БЕЗ перетирання пустими значеннями)
 */
function updateConfig(newData) {
  try {
    console.log('📝 updateConfig called with:', Object.keys(newData).length, 'keys');
    const currentConfig = loadConfig();
    console.log('📖 Current config has:', Object.keys(currentConfig).length, 'keys');
    const updatedConfig = deepMerge(currentConfig, newData);
    console.log('🔀 After merge has:', Object.keys(updatedConfig).length, 'keys');

    // КРИТИЧНА ПЕРЕВІРКА: якщо конфіг став порожній - НЕ ЗБЕРІГАЄМО!
    if (Object.keys(updatedConfig).length < 50) {
      console.error('🚨 CRITICAL: Updated config has less than 50 keys! Not saving!');
      console.error('Current keys:', Object.keys(currentConfig).length);
      console.error('New data keys:', Object.keys(newData).length);
      console.error('Result keys:', Object.keys(updatedConfig).length);
      return false;
    }

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
