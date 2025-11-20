/**
 * Basic/head section replacements module
 */
module.exports = function applyBasicReplacements(html, options, dataObj) {
  // Meta tags
  const pageTitle = options.pageTitle || dataObj.pageTitle || 'Інтернет-магазин';
  const pageDescription = options.pageDescription || dataObj.pageDescription || '';
  const ogTitle = options.ogTitle || dataObj.ogTitle || pageTitle;
  const ogDescription = options.ogDescription || dataObj.ogDescription || pageDescription;
  const ogImage = options.ogImage || dataObj.ogImage || '';
  const ogUrl = options.ogUrl || dataObj.ogUrl || '';

  // Facebook Pixel
  const facebookPixelId = options.facebookPixelId || dataObj.facebookPixelId || '';

  html = html.replace(/\{\{pageTitle\}\}/g, pageTitle);
  html = html.replace(/\{\{pageDescription\}\}/g, pageDescription);
  html = html.replace(/\{\{ogTitle\}\}/g, ogTitle);
  html = html.replace(/\{\{ogDescription\}\}/g, ogDescription);
  html = html.replace(/\{\{ogImage\}\}/g, ogImage);
  html = html.replace(/\{\{ogUrl\}\}/g, ogUrl);
  html = html.replace(/\{\{facebookPixelId\}\}/g, facebookPixelId);

  return html;
};