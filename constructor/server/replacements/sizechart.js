/**
 * Size chart section replacements module
 */
module.exports = function applySizeChartReplacements(html, options, dataObj) {
  const sizeChartImage = options.sizeChartImage || dataObj.sizeChartImage || '';
  const sizeChartLabel = options.sizeChartLabel || dataObj.sizeChartLabel || '';
  const sizeChartTitle = options.sizeChartTitle || dataObj.sizeChartTitle || '';

  html = html.replace(/\{\{sizeChartImage\}\}/g, sizeChartImage);
  html = html.replace(/\{\{sizeChartLabel\}\}/g, sizeChartLabel);
  html = html.replace(/\{\{sizeChartTitle\}\}/g, sizeChartTitle);

  return html;
};