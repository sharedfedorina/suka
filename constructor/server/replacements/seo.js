/**
 * SEO/META section replacements
 */

module.exports = function applySeoReplacements(html, options, dataObj) {
  // SEO/META fields
  const pageTitle = options.pageTitle || dataObj.pageTitle || '';
  const pageDescription = options.pageDescription || dataObj.pageDescription || '';

  html = html.replace(/\{\{pageTitle\}\}/g, pageTitle);
  html = html.replace(/\{\{pageDescription\}\}/g, pageDescription);

  return html;
};
