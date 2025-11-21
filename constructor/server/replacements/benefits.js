/**
 * Benefits section replacements module
 */
module.exports = function applyBenefitsReplacements(html, options, dataObj) {
  // Get benefits array from config
  const benefits = options.benefits || dataObj.benefits || [];

  // Convert array to flat structure for replacements
  for (let i = 1; i <= 5; i++) {
    let benefitTitle = '';
    let benefitDescription = '';

    // First check if data exists in array format
    if (Array.isArray(benefits)) {
      const benefit = benefits.find(b => b.id === i);
      if (benefit && benefit.enabled) {
        benefitTitle = benefit.title || '';
        benefitDescription = benefit.description || '';
      }
    }

    // Fallback to flat structure if it exists
    if (!benefitTitle) {
      benefitTitle = options[`benefit${i}Title`] || dataObj[`benefit${i}Title`] || '';
    }
    if (!benefitDescription) {
      benefitDescription = options[`benefit${i}Description`] || dataObj[`benefit${i}Description`] || '';
    }

    html = html.replace(new RegExp(`\\{\\{benefit${i}Title\\}\\}`, 'g'), benefitTitle);
    html = html.replace(new RegExp(`\\{\\{benefit${i}Description\\}\\}`, 'g'), benefitDescription);
  }

  return html;
};