/**
 * Plus logo section replacements module
 */
module.exports = function applyPlusLogoReplacements(html, options, dataObj) {
  const enableImage = options.enableImage || dataObj.enableImage || false;
  const imageUrl = options.imageUrl || dataObj.imageUrl || '';

  html = html.replace(/\{\{enableImage\}\}/g, enableImage);
  html = html.replace(/\{\{imageUrl\}\}/g, imageUrl);

  return html;
};