/**
 * Comments section replacements module
 */
module.exports = function applyCommentsReplacements(html, options, dataObj) {
  const enableComments = options.enableComments || dataObj.enableComments || false;
  const commentsLabel = options.commentsLabel || dataObj.commentsLabel || '';
  const commentsTitle = options.commentsTitle || dataObj.commentsTitle || '';
  const commentsSalesStat = options.commentsSalesStat || dataObj.commentsSalesStat || '';
  const commentsSalesText = options.commentsSalesText || dataObj.commentsSalesText || '';
  const commentsSatisfiedStat = options.commentsSatisfiedStat || dataObj.commentsSatisfiedStat || '';
  const commentsSatisfiedText = options.commentsSatisfiedText || dataObj.commentsSatisfiedText || '';
  const commentsRepeatStat = options.commentsRepeatStat || dataObj.commentsRepeatStat || '';
  const commentsRepeatText = options.commentsRepeatText || dataObj.commentsRepeatText || '';
  const commentsButtonText = options.commentsButtonText || dataObj.commentsButtonText || '';

  html = html.replace(/\{\{enableComments\}\}/g, enableComments);
  html = html.replace(/\{\{commentsLabel\}\}/g, commentsLabel);
  html = html.replace(/\{\{commentsTitle\}\}/g, commentsTitle);
  html = html.replace(/\{\{commentsSalesStat\}\}/g, commentsSalesStat);
  html = html.replace(/\{\{commentsSalesText\}\}/g, commentsSalesText);
  html = html.replace(/\{\{commentsSatisfiedStat\}\}/g, commentsSatisfiedStat);
  html = html.replace(/\{\{commentsSatisfiedText\}\}/g, commentsSatisfiedText);
  html = html.replace(/\{\{commentsRepeatStat\}\}/g, commentsRepeatStat);
  html = html.replace(/\{\{commentsRepeatText\}\}/g, commentsRepeatText);
  html = html.replace(/\{\{commentsButtonText\}\}/g, commentsButtonText);

  return html;
};