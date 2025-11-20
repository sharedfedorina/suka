/**
 * SalesDrive integration replacements module
 */
module.exports = function applySalesDriveReplacements(html, options, dataObj) {
  const enableSalesDrive = options.enableSalesDrive || dataObj.enableSalesDrive || false;
  const salesDriveApiKey = options.salesDriveApiKey || dataObj.salesDriveApiKey || '';
  const salesDriveStreamId = options.salesDriveStreamId || dataObj.salesDriveStreamId || '';
  const salesDriveOfferId = options.salesDriveOfferId || dataObj.salesDriveOfferId || '';
  const salesDriveWebmasterId = options.salesDriveWebmasterId || dataObj.salesDriveWebmasterId || '';

  html = html.replace(/\{\{enableSalesDrive\}\}/g, enableSalesDrive);
  html = html.replace(/\{\{salesDriveApiKey\}\}/g, salesDriveApiKey);
  html = html.replace(/\{\{salesDriveStreamId\}\}/g, salesDriveStreamId);
  html = html.replace(/\{\{salesDriveOfferId\}\}/g, salesDriveOfferId);
  html = html.replace(/\{\{salesDriveWebmasterId\}\}/g, salesDriveWebmasterId);

  return html;
};