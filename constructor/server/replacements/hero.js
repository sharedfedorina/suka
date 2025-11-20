/**
 * Hero section replacements module
 */
module.exports = function applyHeroReplacements(html, options, dataObj) {
  // Hero section replacements
  const heroTitle = options.heroTitle || dataObj.heroTitle || '';
  const heroPrice = options.heroPrice || dataObj.heroPrice || '';
  const heroImage = options.heroImage || dataObj.heroImage || '';
  const heroButtonText = options.heroButtonText || dataObj.heroButtonText || 'Замовити зараз';
  const headerText = options.headerText || dataObj.headerText || '';

  // Timer related
  const enableTimer = options.enableTimer || dataObj.enableTimer || false;
  const enableStock = options.enableStock || dataObj.enableStock || false;

  html = html.replace(/\{\{heroTitle\}\}/g, heroTitle);
  html = html.replace(/\{\{heroPrice\}\}/g, heroPrice);
  html = html.replace(/\{\{heroImage\}\}/g, heroImage);
  html = html.replace(/\{\{heroButtonText\}\}/g, heroButtonText);
  html = html.replace(/\{\{headerText\}\}/g, headerText);
  html = html.replace(/\{\{enableTimer\}\}/g, enableTimer);
  html = html.replace(/\{\{enableStock\}\}/g, enableStock);

  return html;
};