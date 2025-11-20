/**
 * Reviews section replacements module
 */
module.exports = function applyReviewsReplacements(html, options, dataObj) {
  const enableReviews = options.enableReviews || dataObj.enableReviews || false;
  const reviewsLabel = options.reviewsLabel || dataObj.reviewsLabel || '';
  const reviewsTitle = options.reviewsTitle || dataObj.reviewsTitle || '';

  html = html.replace(/\{\{enableReviews\}\}/g, enableReviews);
  html = html.replace(/\{\{reviewsLabel\}\}/g, reviewsLabel);
  html = html.replace(/\{\{reviewsTitle\}\}/g, reviewsTitle);

  // Process reviews 1-4
  for (let i = 1; i <= 4; i++) {
    const reviewName = options[`review${i}Name`] || dataObj[`review${i}Name`] || '';
    const reviewText = options[`review${i}Text`] || dataObj[`review${i}Text`] || '';
    const reviewImage = options[`review${i}Image`] || dataObj[`review${i}Image`] || '';

    html = html.replace(new RegExp(`\\{\\{review${i}Name\\}\\}`, 'g'), reviewName);
    html = html.replace(new RegExp(`\\{\\{review${i}Text\\}\\}`, 'g'), reviewText);
    html = html.replace(new RegExp(`\\{\\{review${i}Image\\}\\}`, 'g'), reviewImage);
  }

  return html;
};