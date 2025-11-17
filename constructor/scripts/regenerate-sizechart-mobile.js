#!/usr/bin/env node

/**
 * Regenerate Mobile WebP Versions for Size Chart Images
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SIZE_CHART_DIR = path.join(__dirname, '..', 'public', 'img', 'info');

async function regenerateSizeChartMobile() {
  console.log('\n🔄 REGENERATE MOBILE SIZE CHART IMAGES\n');
  console.log(`📁 Directory: ${SIZE_CHART_DIR}`);
  console.log(`🔍 Pattern: size-chart-*.png\n`);

  const allFiles = fs.readdirSync(SIZE_CHART_DIR);
  const files = allFiles
    .filter(file => file.startsWith('size-chart-') && file.endsWith('.png'))
    .map(file => path.join(SIZE_CHART_DIR, file));

  if (files.length === 0) {
    console.log('⚠️  No size chart images found.');
    return;
  }

  console.log(`📸 Found ${files.length} size chart images\n`);

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const filePath of files) {
    const basename = path.basename(filePath, '.png');
    const mobilePath = path.join(SIZE_CHART_DIR, `${basename}_m.webp`);

    if (fs.existsSync(mobilePath)) {
      console.log(`⏭️  SKIP: ${basename}_m.webp (already exists)`);
      skipped++;
      continue;
    }

    try {
      await sharp(filePath)
        .resize(640, null, { fit: 'inside' })
        .webp({ quality: 80 })
        .toFile(mobilePath);

      const stats = fs.statSync(filePath);
      const mobileStats = fs.statSync(mobilePath);
      const savings = ((1 - mobileStats.size / stats.size) * 100).toFixed(1);

      console.log(`✅ ${basename}.png → ${basename}_m.webp`);
      console.log(`   Desktop: ${(stats.size / 1024).toFixed(1)} KB → Mobile: ${(mobileStats.size / 1024).toFixed(1)} KB (${savings}% smaller)\n`);

      processed++;
    } catch (err) {
      console.error(`❌ ERROR processing ${basename}.png:`, err.message);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY\n');
  console.log(`   Total files: ${files.length}`);
  console.log(`   ✅ Processed: ${processed}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('='.repeat(60) + '\n');

  if (processed > 0) {
    console.log('🎉 Size chart mobile images regenerated successfully!\n');
  }
}

regenerateSizeChartMobile().catch(err => {
  console.error('\n❌ FATAL ERROR:', err);
  process.exit(1);
});
