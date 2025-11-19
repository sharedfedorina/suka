/**
 * Main replacements module
 * Coordinates all section-specific replacement modules
 */

const applyTabsReplacements = require('./tabs');
const applyFaqReplacements = require('./faq');
const applyHowToReplacements = require('./howto');
const applyRequestReplacements = require('./request');
const applySeoReplacements = require('./seo');

/**
 * Apply all new modular replacements
 * (Hero, Video, Products, SizeChart are still in server.js for now)
 */
module.exports = function applyAllReplacements(html, options, dataObj) {
  // Apply each section's replacements
  html = applyTabsReplacements(html, options, dataObj);
  html = applyFaqReplacements(html, options, dataObj);
  html = applyHowToReplacements(html, options, dataObj);
  html = applyRequestReplacements(html, options, dataObj);
  html = applySeoReplacements(html, options, dataObj);

  return html;
};
