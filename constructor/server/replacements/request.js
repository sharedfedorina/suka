/**
 * Request form section replacements
 */

module.exports = function applyRequestReplacements(html, options, dataObj) {
  // Request form fields
  const requestTitle = options.requestTitle || dataObj.requestTitle || '';
  const requestTimerText = options.requestTimerText || dataObj.requestTimerText || '';
  const requestInfoTitle = options.requestInfoTitle || dataObj.requestInfoTitle || '';
  const requestInfoDescription = options.requestInfoDescription || dataObj.requestInfoDescription || '';
  const requestNamePlaceholder = options.requestNamePlaceholder || dataObj.requestNamePlaceholder || '';
  const requestPhonePlaceholder = options.requestPhonePlaceholder || dataObj.requestPhonePlaceholder || '';
  const requestPhoneFormat = options.requestPhoneFormat || dataObj.requestPhoneFormat || '';
  const requestButtonText = options.requestButtonText || dataObj.requestButtonText || '';
  const requestStockPrefix = options.requestStockPrefix || dataObj.requestStockPrefix || '';
  const requestStockSuffix = options.requestStockSuffix || dataObj.requestStockSuffix || '';

  html = html.replace(/\{\{requestTitle\}\}/g, requestTitle);
  html = html.replace(/\{\{requestTimerText\}\}/g, requestTimerText);
  html = html.replace(/\{\{requestInfoTitle\}\}/g, requestInfoTitle);
  html = html.replace(/\{\{requestInfoDescription\}\}/g, requestInfoDescription);
  html = html.replace(/\{\{requestNamePlaceholder\}\}/g, requestNamePlaceholder);
  html = html.replace(/\{\{requestPhonePlaceholder\}\}/g, requestPhonePlaceholder);
  html = html.replace(/\{\{requestPhoneFormat\}\}/g, requestPhoneFormat);
  html = html.replace(/\{\{requestButtonText\}\}/g, requestButtonText);
  html = html.replace(/\{\{requestStockPrefix\}\}/g, requestStockPrefix);
  html = html.replace(/\{\{requestStockSuffix\}\}/g, requestStockSuffix);

  return html;
};
