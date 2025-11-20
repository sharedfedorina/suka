/**
 * Video section replacements module
 */
module.exports = function applyVideoReplacements(html, options, dataObj) {
  const videoUrl = options.videoUrl || dataObj.videoUrl || '';
  const videoThumbnailDesktop = options.videoThumbnailDesktop || dataObj.videoThumbnailDesktop || '';
  const videoThumbnailMobile = options.videoThumbnailMobile || dataObj.videoThumbnailMobile || '';
  const videoSectionLabel = options.videoSectionLabel || dataObj.videoSectionLabel || '';
  const videoSectionTitle = options.videoSectionTitle || dataObj.videoSectionTitle || '';
  const enableVideo = options.enableVideo || dataObj.enableVideo || false;
  const enableVideoThumbnail = options.enableVideoThumbnail || dataObj.enableVideoThumbnail || false;

  html = html.replace(/\{\{videoUrl\}\}/g, videoUrl);
  html = html.replace(/\{\{videoThumbnailDesktop\}\}/g, videoThumbnailDesktop);
  html = html.replace(/\{\{videoThumbnailMobile\}\}/g, videoThumbnailMobile);
  html = html.replace(/\{\{videoSectionLabel\}\}/g, videoSectionLabel);
  html = html.replace(/\{\{videoSectionTitle\}\}/g, videoSectionTitle);
  html = html.replace(/\{\{enableVideo\}\}/g, enableVideo);
  html = html.replace(/\{\{enableVideoThumbnail\}\}/g, enableVideoThumbnail);

  return html;
};