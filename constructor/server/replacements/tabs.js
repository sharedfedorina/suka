/**
 * Tabs section replacements
 */

module.exports = function applyTabsReplacements(html, options, dataObj) {
  // Tabs section header
  const tabsLabel = options.tabsLabel || dataObj.tabsLabel || '';
  const tabsTitle = options.tabsTitle || dataObj.tabsTitle || '';
  html = html.replace(/\{\{tabsLabel\}\}/g, tabsLabel);
  html = html.replace(/\{\{tabsTitle\}\}/g, tabsTitle);

  // Tab 1
  const tab1Title = options.tab1Title || dataObj.tab1Title || '';
  const tab1Description = options.tab1Description || dataObj.tab1Description || '';
  const tab1ImageDesktop = options.tab1ImageDesktop || dataObj.tab1ImageDesktop || '';
  const tab1ImageMobile = options.tab1ImageMobile || dataObj.tab1ImageMobile || '';
  html = html.replace(/\{\{tab1Title\}\}/g, tab1Title);
  html = html.replace(/\{\{tab1Description\}\}/g, tab1Description);
  html = html.replace(/\{\{tab1ImageDesktop\}\}/g, tab1ImageDesktop);
  html = html.replace(/\{\{tab1ImageMobile\}\}/g, tab1ImageMobile);

  // Tab 2
  const tab2Title = options.tab2Title || dataObj.tab2Title || '';
  const tab2Description = options.tab2Description || dataObj.tab2Description || '';
  const tab2ImageDesktop = options.tab2ImageDesktop || dataObj.tab2ImageDesktop || '';
  const tab2ImageMobile = options.tab2ImageMobile || dataObj.tab2ImageMobile || '';
  html = html.replace(/\{\{tab2Title\}\}/g, tab2Title);
  html = html.replace(/\{\{tab2Description\}\}/g, tab2Description);
  html = html.replace(/\{\{tab2ImageDesktop\}\}/g, tab2ImageDesktop);
  html = html.replace(/\{\{tab2ImageMobile\}\}/g, tab2ImageMobile);

  // Tab 3
  const tab3Title = options.tab3Title || dataObj.tab3Title || '';
  const tab3Description = options.tab3Description || dataObj.tab3Description || '';
  const tab3ImageDesktop = options.tab3ImageDesktop || dataObj.tab3ImageDesktop || '';
  const tab3ImageMobile = options.tab3ImageMobile || dataObj.tab3ImageMobile || '';
  html = html.replace(/\{\{tab3Title\}\}/g, tab3Title);
  html = html.replace(/\{\{tab3Description\}\}/g, tab3Description);
  html = html.replace(/\{\{tab3ImageDesktop\}\}/g, tab3ImageDesktop);
  html = html.replace(/\{\{tab3ImageMobile\}\}/g, tab3ImageMobile);

  return html;
};
