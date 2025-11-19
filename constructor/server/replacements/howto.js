/**
 * How to buy section replacements
 */

module.exports = function applyHowToReplacements(html, options, dataObj) {
  // How to buy section header
  const howLabel = options.howLabel || dataObj.howLabel || '';
  const howTitle = options.howTitle || dataObj.howTitle || '';
  html = html.replace(/\{\{howLabel\}\}/g, howLabel);
  html = html.replace(/\{\{howTitle\}\}/g, howTitle);

  // How to buy steps
  const howStep1 = options.howStep1 || dataObj.howStep1 || '';
  const howStep2 = options.howStep2 || dataObj.howStep2 || '';
  const howStep3 = options.howStep3 || dataObj.howStep3 || '';
  const howStep4 = options.howStep4 || dataObj.howStep4 || '';

  html = html.replace(/\{\{howStep1\}\}/g, howStep1);
  html = html.replace(/\{\{howStep2\}\}/g, howStep2);
  html = html.replace(/\{\{howStep3\}\}/g, howStep3);
  html = html.replace(/\{\{howStep4\}\}/g, howStep4);

  return html;
};
