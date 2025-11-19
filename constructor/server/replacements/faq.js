/**
 * FAQ section replacements
 */

module.exports = function applyFaqReplacements(html, options, dataObj) {
  // FAQ section header
  const faqLabel = options.faqLabel || dataObj.faqLabel || '';
  const faqTitle = options.faqTitle || dataObj.faqTitle || '';
  html = html.replace(/\{\{faqLabel\}\}/g, faqLabel);
  html = html.replace(/\{\{faqTitle\}\}/g, faqTitle);

  // FAQ items
  const faq1Question = options.faq1Question || dataObj.faq1Question || '';
  const faq1Answer = options.faq1Answer || dataObj.faq1Answer || '';
  const faq2Question = options.faq2Question || dataObj.faq2Question || '';
  const faq2Answer = options.faq2Answer || dataObj.faq2Answer || '';
  const faq3Question = options.faq3Question || dataObj.faq3Question || '';
  const faq3Answer = options.faq3Answer || dataObj.faq3Answer || '';
  const faq4Question = options.faq4Question || dataObj.faq4Question || '';
  const faq4Answer = options.faq4Answer || dataObj.faq4Answer || '';

  html = html.replace(/\{\{faq1Question\}\}/g, faq1Question);
  html = html.replace(/\{\{faq1Answer\}\}/g, faq1Answer);
  html = html.replace(/\{\{faq2Question\}\}/g, faq2Question);
  html = html.replace(/\{\{faq2Answer\}\}/g, faq2Answer);
  html = html.replace(/\{\{faq3Question\}\}/g, faq3Question);
  html = html.replace(/\{\{faq3Answer\}\}/g, faq3Answer);
  html = html.replace(/\{\{faq4Question\}\}/g, faq4Question);
  html = html.replace(/\{\{faq4Answer\}\}/g, faq4Answer);

  return html;
};
