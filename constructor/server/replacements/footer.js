/**
 * Footer section replacements module
 */
module.exports = function applyFooterReplacements(html, options, dataObj) {
  const footerCopyright = options.footerCopyright || dataObj.footerCopyright || '© 2024 Всі права захищено';
  const footerPrivacyText = options.footerPrivacyText || dataObj.footerPrivacyText || 'Політика конфіденційності';
  const footerPrivacyLink = options.footerPrivacyLink || dataObj.footerPrivacyLink || '#';
  const footerTermsText = options.footerTermsText || dataObj.footerTermsText || 'Умови використання';
  const footerTermsLink = options.footerTermsLink || dataObj.footerTermsLink || '#';

  html = html.replace(/\{\{footerCopyright\}\}/g, footerCopyright);
  html = html.replace(/\{\{footerPrivacyText\}\}/g, footerPrivacyText);
  html = html.replace(/\{\{footerPrivacyLink\}\}/g, footerPrivacyLink);
  html = html.replace(/\{\{footerTermsText\}\}/g, footerTermsText);
  html = html.replace(/\{\{footerTermsLink\}\}/g, footerTermsLink);

  return html;
};