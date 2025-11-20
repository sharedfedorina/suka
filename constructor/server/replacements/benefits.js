/**
 * Benefits section replacements module
 */
module.exports = function applyBenefitsReplacements(html, options, dataObj) {
  // Benefits replacements
  for (let i = 1; i <= 5; i++) {
    const benefitTitle = options[`benefit${i}Title`] || dataObj[`benefit${i}Title`] || '';
    const benefitDescription = options[`benefit${i}Description`] || dataObj[`benefit${i}Description`] || '';

    html = html.replace(new RegExp(`\\{\\{benefit${i}Title\\}\\}`, 'g'), benefitTitle);
    html = html.replace(new RegExp(`\\{\\{benefit${i}Description\\}\\}`, 'g'), benefitDescription);
  }

  return html;
};