#!/usr/bin/env node

/**
 * Regenerate Mobile WebP Versions for Existing Product Images
 *
 * This script processes all existing product-*.jpg files in public/img/products/
 * and creates corresponding _m.webp mobile versions.
 *
 * Usage: node scripts/regenerate-product-mobile.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PRODUCTS_DIR = path.join(__dirname, '..', 'public', 'img', 'products');

async function regenerateMobileImages() {
  console.log('\n🔄 REGENERATE MOBILE PRODUCT IMAGES\n');
  console.log(`📁 Directory: ${PRODUCTS_DIR}`);
  console.log(`🔍 Pattern: product-*.jpg\n`);

  // Find all product JPG files using fs.readdirSync
  const allFiles = fs.readdirSync(PRODUCTS_DIR);
  const files = allFiles
    .filter(file => file.startsWith('product-') && file.endsWith('.jpg'))
    .map(file => path.join(PRODUCTS_DIR, file));

  if (files.length === 0) {
    console.log('⚠️  No product images found.');
    return;
  }

  console.log(`📸 Found ${files.length} product images\n`);

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const filePath of files) {
    const basename = path.basename(filePath, '.jpg');
    const mobilePath = path.join(PRODUCTS_DIR, `${basename}_m.webp`);

    // Skip if mobile version already exists
    if (fs.existsSync(mobilePath)) {
      console.log(`⏭️  SKIP: ${basename}_m.webp (already exists)`);
      skipped++;
      continue;
    }

    try {
      // Generate mobile WebP version (640px width, 80% quality)
      await sharp(filePath)
        .resize(640, null, { fit: 'inside' })
        .webp({ quality: 80 })
        .toFile(mobilePath);

      const stats = fs.statSync(filePath);
      const mobileStats = fs.statSync(mobilePath);
      const savings = ((1 - mobileStats.size / stats.size) * 100).toFixed(1);

      console.log(`✅ ${basename}.jpg → ${basename}_m.webp`);
      console.log(`   Desktop: ${(stats.size / 1024).toFixed(1)} KB → Mobile: ${(mobileStats.size / 1024).toFixed(1)} KB (${savings}% smaller)\n`);

      processed++;
    } catch (err) {
      console.error(`❌ ERROR processing ${basename}.jpg:`, err.message);
      errors++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY\n');
  console.log(`   Total files: ${files.length}`);
  console.log(`   ✅ Processed: ${processed}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('='.repeat(60) + '\n');

  if (processed > 0) {
    console.log('🎉 Mobile images regenerated successfully!\n');
    console.log('Next steps:');
    console.log('1. Restart the server to apply changes');
    console.log('2. Test mobile view in browser');
    console.log('3. Verify WebP images are loading\n');
  }
}

// Run the script
regenerateMobileImages().catch(err => {
  console.error('\n❌ FATAL ERROR:', err);
  process.exit(1);
});
