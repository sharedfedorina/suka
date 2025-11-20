/**
 * Main replacements module
 * Coordinates all section-specific replacement modules
 */

// Import all replacement modules
const applyBasicReplacements = require('./basic');
const applyHeroReplacements = require('./hero');
const applyBenefitsReplacements = require('./benefits');
const applyPlusLogoReplacements = require('./pluslogo');
const applyVideoReplacements = require('./video');
const applyProductsReplacements = require('./products');
const applySizeChartReplacements = require('./sizechart');
const applyTabsReplacements = require('./tabs');
const applyCommentsReplacements = require('./comments');
const applyReviewsReplacements = require('./reviews');
const applyFaqReplacements = require('./faq');
const applyHowToReplacements = require('./howto');
const applyRequestReplacements = require('./request');
const applyFooterReplacements = require('./footer');
const applySalesDriveReplacements = require('./salesdrive');
const applySeoReplacements = require('./seo');

/**
 * Apply all modular replacements in proper order
 */
module.exports = function applyAllReplacements(html, options, dataObj) {
  // Apply each section's replacements
  html = applyBasicReplacements(html, options, dataObj);
  html = applyHeroReplacements(html, options, dataObj);
  html = applyBenefitsReplacements(html, options, dataObj);
  html = applyPlusLogoReplacements(html, options, dataObj);
  html = applyVideoReplacements(html, options, dataObj);
  html = applyProductsReplacements(html, options, dataObj);
  html = applySizeChartReplacements(html, options, dataObj);
  html = applyTabsReplacements(html, options, dataObj);
  html = applyCommentsReplacements(html, options, dataObj);
  html = applyReviewsReplacements(html, options, dataObj);
  html = applyFaqReplacements(html, options, dataObj);
  html = applyHowToReplacements(html, options, dataObj);
  html = applyRequestReplacements(html, options, dataObj);
  html = applyFooterReplacements(html, options, dataObj);
  html = applySalesDriveReplacements(html, options, dataObj);
  html = applySeoReplacements(html, options, dataObj);

  return html;
};
