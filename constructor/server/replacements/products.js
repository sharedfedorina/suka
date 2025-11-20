/**
 * Products section replacements module
 */
module.exports = function applyProductsReplacements(html, options, dataObj) {
  // Products section settings
  const productsSectionLabel = options.productsSectionLabel || dataObj.productsSectionLabel || '';
  const productsSectionTitle = options.productsSectionTitle || dataObj.productsSectionTitle || '';
  const productOrderButtonText = options.productOrderButtonText || dataObj.productOrderButtonText || 'Замовити';
  const actionChooseText = options.actionChooseText || dataObj.actionChooseText || '';
  const actionPromoText = options.actionPromoText || dataObj.actionPromoText || '';

  html = html.replace(/\{\{productsSectionLabel\}\}/g, productsSectionLabel);
  html = html.replace(/\{\{productsSectionTitle\}\}/g, productsSectionTitle);
  html = html.replace(/\{\{productOrderButtonText\}\}/g, productOrderButtonText);
  html = html.replace(/\{\{actionChooseText\}\}/g, actionChooseText);
  html = html.replace(/\{\{actionPromoText\}\}/g, actionPromoText);

  // Info color circles placeholder
  const infoColorCircles = options.infoColorCircles || dataObj.infoColorCircles || '';
  html = html.replace(/\{\{infoColorCircles\}\}/g, infoColorCircles);

  // Process each product (1-9)
  for (let i = 1; i <= 9; i++) {
    const enableProduct = options[`enableProduct${i}`] || dataObj[`enableProduct${i}`] || false;
    const productName = options[`product${i}Name`] || dataObj[`product${i}Name`] || '';
    const productColor = options[`product${i}Color`] || dataObj[`product${i}Color`] || '';
    const productColorHex = options[`product${i}ColorHex`] || dataObj[`product${i}ColorHex`] || '';
    const productSize = options[`product${i}Size`] || dataObj[`product${i}Size`] || '';
    const productMaterial = options[`product${i}Material`] || dataObj[`product${i}Material`] || '';
    const productPriceOld = options[`product${i}PriceOld`] || dataObj[`product${i}PriceOld`] || '';
    const productPrice = options[`product${i}Price`] || dataObj[`product${i}Price`] || '';
    const productImages = options[`product${i}Images`] || dataObj[`product${i}Images`] || [];

    html = html.replace(new RegExp(`\\{\\{enableProduct${i}\\}\\}`, 'g'), enableProduct);
    html = html.replace(new RegExp(`\\{\\{product${i}Name\\}\\}`, 'g'), productName);
    html = html.replace(new RegExp(`\\{\\{product${i}Color\\}\\}`, 'g'), productColor);
    html = html.replace(new RegExp(`\\{\\{product${i}ColorHex\\}\\}`, 'g'), productColorHex);
    html = html.replace(new RegExp(`\\{\\{product${i}Size\\}\\}`, 'g'), productSize);
    html = html.replace(new RegExp(`\\{\\{product${i}Material\\}\\}`, 'g'), productMaterial);
    html = html.replace(new RegExp(`\\{\\{product${i}PriceOld\\}\\}`, 'g'), productPriceOld);
    html = html.replace(new RegExp(`\\{\\{product${i}Price\\}\\}`, 'g'), productPrice);

    // Generate image slides for products (with correct placeholder names)
    if (productImages && productImages.length > 0) {
      const slides = productImages.map(img => `
        <div class="swiper-slide">
          <img src="${img}" alt="Product ${i}">
        </div>
      `).join('');
      html = html.replace(new RegExp(`\\{\\{product${i}Slides\\}\\}`, 'g'), slides);
    } else {
      html = html.replace(new RegExp(`\\{\\{product${i}Slides\\}\\}`, 'g'), '');
    }

    // Replace individual image placeholders
    for (let j = 1; j <= 9; j++) {
      const imageKey = `product${i}Images${j}`;
      const imageValue = options[imageKey] || dataObj[imageKey] || '';
      html = html.replace(new RegExp(`\\{\\{${imageKey}\\}\\}`, 'g'), imageValue);
    }
  }

  return html;
};