# 🗺️ Landing Constructor - Complete Development Roadmap

**Created:** 2025-11-09
**Status:** IN PROGRESS
**Architecture:** ONE CODE - DIFFERENT CONFIG FILES

---

## 📊 Project Status Overview

### ✅ Completed Features
- [x] Hero image upload (desktop JPG + mobile WebP)
- [x] Video thumbnail upload (desktop + mobile)
- [x] Timer block (enable/disable)
- [x] Stock counter block
- [x] Info block with 7 fields (Brand, Model, Quantity, Colors, Sizes, Material, Packaging)
- [x] Benefits section (5 items)
- [x] Basic form interface
- [x] Save/Load config to user-config.json
- [x] Preview mode
- [x] Export ZIP (partial)

### 🚧 In Progress / Broken
- [ ] Product images (1-5, 8-9) - NO mobile WebP generation
- [ ] Export ZIP - missing product images
- [ ] Path processing - inconsistent `/public/` handling
- [ ] generateSlides() - uses same image for desktop/mobile

### ❌ Not Started (Based on Template Analysis)
- [ ] Comments section
- [ ] FAQ section
- [ ] How to Buy section
- [ ] Request form section
- [ ] Footer section
- [ ] Additional product options
- [ ] Promo section
- [ ] Tabs functionality

---

## 🎯 Development Phases

### PHASE 0: CRITICAL FIXES (Mobile-First) 🚨
**Priority:** BLOCKER - Must complete before ad launch
**Estimated Time:** 2-3 hours
**Status:** NOT STARTED

#### Objectives
Fix mobile-first architecture to ensure proper WebP delivery for product images

#### Tasks

**Task 0.1: Fix Product Upload Endpoints (9 endpoints)**
- File: `constructor/server.js`
- Lines: 888-1246
- Action: Add Sharp processing to create desktop JPG + mobile WebP
- Pattern: Copy from hero upload (lines 817-873)
- Endpoints to fix:
  - `/upload-product1-image` (lines 888-917)
  - `/upload-product2-image` (lines 941-970)
  - `/upload-product3-image` (lines 994-1023)
  - `/upload-product4-image` (lines 1047-1076)
  - `/upload-product5-image` (lines 1100-1129)
  - `/upload-product8-image` (lines 1153-1182)
  - `/upload-product9-image` (lines 1206-1235)

**Implementation Template:**
```javascript
const timestamp = Date.now();
const basename = `product-${timestamp}`;
const uploadedPath = req.file.path;

// Desktop version (original quality JPG)
const desktopPath = path.join(productImageDir, `${basename}.jpg`);
await sharp(uploadedPath)
  .jpeg({ quality: 90 })
  .toFile(desktopPath);

// Mobile version (640px width, WebP 80%)
const mobilePath = path.join(productImageDir, `${basename}_m.webp`);
await sharp(uploadedPath)
  .resize(640, null, { fit: 'inside' })
  .webp({ quality: 80 })
  .toFile(mobilePath);

// Delete original
fs.unlinkSync(uploadedPath);

res.json({ filename: `/public/img/products/${basename}.jpg` });
```

**Task 0.2: Fix generateSlides() Function**
- File: `constructor/server.js`
- Lines: 215-232
- Action: Generate mobile path and use in picture tag

**Implementation:**
```javascript
function generateSlides(images = []) {
  if (!Array.isArray(images) || images.length === 0) return '';

  return images.map(imagePath => {
    const desktopPath = imagePath.replace(/^\//, '');
    const mobilePath = desktopPath.replace(/\.jpg$/, '_m.webp');

    return `<div class="swiper-slide products-slide">
      <picture>
        <source srcset="${desktopPath}" media="(min-width: 800px)">
        <img src="${mobilePath}" alt="img">
      </picture>
    </div>`;
  }).join('\n');
}
```

**Task 0.3: Regenerate Existing Product Images**
- Create: `constructor/scripts/regenerate-product-mobile.js`
- Action: Find all product-*.jpg files and create _m.webp versions

**Script:**
```javascript
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const productDir = path.join(__dirname, '..', 'public', 'img', 'products');
const files = fs.readdirSync(productDir).filter(f => f.endsWith('.jpg') && !f.includes('_m'));

for (const file of files) {
  const inputPath = path.join(productDir, file);
  const outputPath = path.join(productDir, file.replace('.jpg', '_m.webp'));

  if (!fs.existsSync(outputPath)) {
    await sharp(inputPath)
      .resize(640, null, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log(`✅ Created: ${outputPath}`);
  }
}
```

**Task 0.4: Add Product Images to Export ZIP**
- File: `constructor/server.js`
- Lines: After 1435
- Action: Loop through product images and add to archive

**Implementation:**
```javascript
// Add product images (1-5)
for (let i = 1; i <= 5; i++) {
  const images = options[`product${i}Images`] || [];
  for (const imagePath of images) {
    const filename = path.basename(imagePath, '.jpg');
    const desktopPath = path.join(productImageDir, `${filename}.jpg`);
    const mobilePath = path.join(productImageDir, `${filename}_m.webp`);

    if (fs.existsSync(desktopPath)) {
      archive.file(desktopPath, { name: `img/products/${filename}.jpg` });
    }
    if (fs.existsSync(mobilePath)) {
      archive.file(mobilePath, { name: `img/products/${filename}_m.webp` });
    }
  }
}

// Add product images (8, 9)
for (const prodNum of [8, 9]) {
  const images = options[`product${prodNum}Images`] || [];
  for (const imagePath of images) {
    // Same logic as above
  }
}
```

#### Testing Checklist
- [ ] Upload new product image → creates .jpg + _m.webp
- [ ] Preview shows product images on desktop
- [ ] Preview shows WebP images on mobile (check DevTools Network tab)
- [ ] Export ZIP contains all product images (desktop + mobile)
- [ ] ZIP works on hosting
- [ ] PageSpeed Insights Mobile score > 85

#### Git Checkpoint
```bash
git add constructor/server.js
git add constructor/scripts/regenerate-product-mobile.js
git commit -m "fix: implement mobile-first for product images

- Add Sharp processing to all 9 product upload endpoints
- Generate desktop JPG + mobile WebP for products
- Fix generateSlides() to use responsive images
- Add product images to export ZIP
- Create script to regenerate mobile versions

BREAKING: Existing product images need regeneration
Run: node constructor/scripts/regenerate-product-mobile.js
"
git push
```

**Delegation Point:**
This phase can be delegated to another developer with:
- Access to MOBILE_FIRST_PROBLEM.md
- This roadmap section
- CONSTRUCTOR-ARCHITECTURE.md for patterns

---

### PHASE 1: COMPLETE MISSING SECTIONS
**Priority:** HIGH
**Estimated Time:** 6-8 hours
**Status:** NOT STARTED

#### Section 1.1: Comments Block
**Files:** index.html, form.html, form.js, server.js, landing-data.json, user-config.json

**Template Analysis:**
```html
<!-- From original template -->
<section class="comments">
  <div class="swiper comments-slider">
    <div class="swiper-slide comment-slide">
      <div class="comment-text">{{commentText}}</div>
      <div class="comment-author">{{commentAuthor}}</div>
      <div class="comment-rating">★★★★★</div>
    </div>
  </div>
</section>
```

**Config Structure:**
```json
{
  "enableComments": true,
  "comments": [
    {
      "id": 1,
      "text": "Чудова футболка!",
      "author": "Олена К.",
      "rating": 5,
      "enabled": true
    }
  ]
}
```

**Implementation Steps:**
1. Add to landing-data.json & user-config.json
2. Wrap in HTML: `<!--comments-->...<!--/comments-->`
3. Add form controls: checkbox + dynamic list editor
4. Add to form.js: array management
5. Add to server.js: generateHTML() replacement logic
6. Test: enable/disable, add/remove items

**Estimated Time:** 1.5 hours

#### Section 1.2: FAQ Block
**Similar pattern to Comments**

**Config Structure:**
```json
{
  "enableFAQ": true,
  "faqItems": [
    {
      "id": 1,
      "question": "Які розміри є в наявності?",
      "answer": "Від S до 5XL",
      "enabled": true
    }
  ]
}
```

**Estimated Time:** 1.5 hours

#### Section 1.3: How to Buy Block
**Estimated Time:** 1 hour

#### Section 1.4: Request Form
**Estimated Time:** 2 hours
**Note:** Includes form submission logic

#### Section 1.5: Footer
**Estimated Time:** 1 hour

#### Git Checkpoints
After each section:
```bash
git add .
git commit -m "feat: add [section name] block

- Implement config structure
- Add form controls
- Add HTML template placeholders
- Add server-side replacement logic
- Tests passing
"
git push
```

**Delegation:** Each section is independent and can be delegated separately

---

### PHASE 2: REFACTORING & OPTIMIZATION
**Priority:** MEDIUM
**Estimated Time:** 4-6 hours
**Status:** NOT STARTED

#### Task 2.1: Centralize Image Processing
**Create:** `constructor/utils/image-processor.js`

**Purpose:** DRY - Don't Repeat Yourself. All 11 upload endpoints use same logic.

**Implementation:**
```javascript
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGE_CONFIGS = {
  hero: {
    desktop: { width: 1200, height: 600, fit: 'cover', quality: 85 },
    mobile: { width: 600, height: 400, fit: 'cover', quality: 80 }
  },
  product: {
    desktop: { width: null, height: null, fit: 'inside', quality: 90 },
    mobile: { width: 640, height: null, fit: 'inside', quality: 80 }
  },
  thumbnail: {
    desktop: { width: null, height: null, fit: 'inside', quality: 90 },
    mobile: { width: 640, height: null, fit: 'inside', quality: 80 }
  },
  sizeChart: {
    desktop: { width: null, height: null, fit: 'inside', quality: 90 },
    mobile: { width: 640, height: null, fit: 'inside', quality: 80 }
  }
};

async function processImage(uploadedPath, outputDir, basename, type = 'product') {
  const config = IMAGE_CONFIGS[type];

  if (!config) throw new Error(`Unknown image type: ${type}`);

  // Desktop
  const desktopPath = path.join(outputDir, `${basename}.jpg`);
  await sharp(uploadedPath)
    .resize(config.desktop.width, config.desktop.height, { fit: config.desktop.fit })
    .jpeg({ quality: config.desktop.quality })
    .toFile(desktopPath);

  // Mobile
  const mobilePath = path.join(outputDir, `${basename}_m.webp`);
  await sharp(uploadedPath)
    .resize(config.mobile.width, config.mobile.height, { fit: config.mobile.fit })
    .webp({ quality: config.mobile.quality })
    .toFile(mobilePath);

  // Cleanup
  if (fs.existsSync(uploadedPath)) {
    fs.unlinkSync(uploadedPath);
  }

  return {
    desktop: `${basename}.jpg`,
    mobile: `${basename}_m.webp`
  };
}

module.exports = { processImage, IMAGE_CONFIGS };
```

**Refactor Endpoints:**
```javascript
const { processImage } = require('./utils/image-processor');

app.post('/upload-hero-image', upload.single('heroImage'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });

    const basename = `hero-${Date.now()}`;
    await processImage(req.file.path, heroImageDir, basename, 'hero');

    res.json({
      success: true,
      filename: `/public/img/hero/${basename}.jpg`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

**Estimated Time:** 2 hours

#### Task 2.2: Centralize Path Processing
**Create:** `constructor/utils/path-helper.js`

```javascript
function cleanPath(filepath, mode = 'preview') {
  if (!filepath) return '';

  if (mode === 'preview') {
    // /public/img/hero/img.jpg → public/img/hero/img.jpg
    return filepath.replace(/^\//, '');
  } else if (mode === 'export') {
    // /public/img/hero/img.jpg → img/hero/img.jpg
    return filepath.replace(/^\/public\//, '');
  }

  return filepath;
}

function generateMobilePath(desktopPath) {
  // img/hero/hero-123.jpg → img/hero/hero-123_m.webp
  return desktopPath.replace(/\.jpg$/, '_m.webp');
}

module.exports = { cleanPath, generateMobilePath };
```

**Estimated Time:** 1 hour

#### Task 2.3: Add Validation Layer
**Create:** `constructor/utils/validator.js`

```javascript
const fs = require('fs');

function validateImagePair(basePath, baseDir) {
  const desktop = basePath;
  const mobile = basePath.replace(/\.jpg$/, '_m.webp');

  const desktopExists = fs.existsSync(path.join(baseDir, path.basename(desktop)));
  const mobileExists = fs.existsSync(path.join(baseDir, path.basename(mobile)));

  if (!desktopExists) {
    throw new Error(`Missing desktop image: ${desktop}`);
  }

  if (!mobileExists) {
    console.warn(`⚠️  Missing mobile image: ${mobile}`);
    // Don't throw - allow fallback
  }

  return { desktop, mobile, valid: desktopExists && mobileExists };
}

function validateConfig(config, schema) {
  // Validate config structure matches schema
  const errors = [];

  for (const key of Object.keys(schema)) {
    if (!(key in config)) {
      errors.push(`Missing required field: ${key}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Config validation failed:\n${errors.join('\n')}`);
  }

  return true;
}

module.exports = { validateImagePair, validateConfig };
```

**Estimated Time:** 1 hour

#### Task 2.4: Error Handling Improvements
- Add try/catch to all async operations
- Return consistent error format
- Log errors with timestamps
- Add error boundary for generateHTML()

**Estimated Time:** 1 hour

#### Git Checkpoint
```bash
git add constructor/utils/
git add constructor/server.js
git commit -m "refactor: centralize image processing and path handling

- Create utils/image-processor.js for DRY image processing
- Create utils/path-helper.js for consistent path cleaning
- Create utils/validator.js for config/image validation
- Improve error handling across endpoints
- Reduce code duplication from 1200 lines to ~400 lines
"
git push
```

---

### PHASE 3: TESTING & QUALITY ASSURANCE
**Priority:** MEDIUM
**Estimated Time:** 3-4 hours
**Status:** NOT STARTED

#### Task 3.1: Create Automated Tests
**Create:** `constructor/tests/`

**Structure:**
```
tests/
├── unit/
│   ├── image-processor.test.js
│   ├── path-helper.test.js
│   └── validator.test.js
├── integration/
│   ├── upload-endpoints.test.js
│   ├── generate-html.test.js
│   └── export-zip.test.js
└── e2e/
    ├── full-workflow.test.js
    └── mobile-preview.test.js
```

**Example Test:**
```javascript
// tests/unit/image-processor.test.js
const { processImage } = require('../utils/image-processor');
const fs = require('fs');
const path = require('path');

describe('Image Processor', () => {
  test('creates desktop and mobile versions', async () => {
    const testInput = path.join(__dirname, 'fixtures', 'test-image.jpg');
    const outputDir = path.join(__dirname, 'temp');

    const result = await processImage(testInput, outputDir, 'test', 'product');

    expect(fs.existsSync(path.join(outputDir, 'test.jpg'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'test_m.webp'))).toBe(true);

    // Cleanup
    fs.unlinkSync(path.join(outputDir, 'test.jpg'));
    fs.unlinkSync(path.join(outputDir, 'test_m.webp'));
  });

  test('deletes original after processing', async () => {
    const testInput = path.join(__dirname, 'fixtures', 'test-image.jpg');
    fs.copyFileSync(testInput, path.join(__dirname, 'temp', 'original.jpg'));

    const originalPath = path.join(__dirname, 'temp', 'original.jpg');
    await processImage(originalPath, __dirname + '/temp', 'test', 'product');

    expect(fs.existsSync(originalPath)).toBe(false);
  });
});
```

**package.json scripts:**
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "jest tests/e2e",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Estimated Time:** 2 hours

#### Task 3.2: Performance Testing
- Measure image processing time
- Measure HTML generation time
- Measure ZIP creation time
- Set performance budgets

**Create:** `constructor/tests/performance.test.js`

**Estimated Time:** 1 hour

#### Task 3.3: Browser Compatibility Testing
- Chrome (desktop + mobile)
- Firefox
- Safari (iOS)
- Edge

**Manual Testing Checklist:**
- [ ] All images load
- [ ] Forms submit correctly
- [ ] Preview updates in real-time
- [ ] ZIP downloads and works
- [ ] Mobile responsive

**Estimated Time:** 1 hour

#### Git Checkpoint
```bash
git add constructor/tests/
git add package.json
git commit -m "test: add comprehensive test suite

- Unit tests for utils modules
- Integration tests for endpoints
- E2E tests for full workflow
- Performance benchmarks
- Browser compatibility checklist
"
git push
```

---

### PHASE 4: FINAL POLISH & DOCUMENTATION
**Priority:** LOW
**Estimated Time:** 2-3 hours
**Status:** NOT STARTED

#### Task 4.1: Code Documentation
- Add JSDoc comments to all functions
- Document API endpoints
- Update CONSTRUCTOR-ARCHITECTURE.md

#### Task 4.2: User Documentation
**Create:** `constructor/USER-GUIDE.md`
- How to use the constructor
- Step-by-step tutorial
- Troubleshooting guide

#### Task 4.3: Developer Documentation
**Create:** `constructor/DEVELOPER-GUIDE.md`
- How to add new sections
- Code structure explanation
- Deployment instructions

#### Task 4.4: Cleanup
- Remove console.logs (keep only important ones)
- Remove commented code
- Fix formatting
- Run linter

---

## 🔄 Continuation Strategy

### If Context Lost
1. Read this ROADMAP.md
2. Check last Git commit to see phase status
3. Read MOBILE_FIRST_PROBLEM.md for critical issues
4. Read CONSTRUCTOR-ARCHITECTURE.md for patterns
5. Continue from last incomplete task

### Phase Status Tracking
Update this section after each phase:

```
PHASE 0: [ ] NOT STARTED | [ ] IN PROGRESS | [ ] COMPLETED
PHASE 1: [ ] NOT STARTED | [ ] IN PROGRESS | [ ] COMPLETED
PHASE 2: [ ] NOT STARTED | [ ] IN PROGRESS | [ ] COMPLETED
PHASE 3: [ ] NOT STARTED | [ ] IN PROGRESS | [ ] COMPLETED
PHASE 4: [ ] NOT STARTED | [ ] IN PROGRESS | [ ] COMPLETED
```

### Git Tags
After each phase:
```bash
git tag -a "phase-0-complete" -m "Mobile-first fixes completed"
git tag -a "phase-1-complete" -m "All sections implemented"
git tag -a "phase-2-complete" -m "Refactoring completed"
git tag -a "phase-3-complete" -m "Tests added"
git tag -a "phase-4-complete" -m "Production ready"
git push --tags
```

---

## 📋 Quick Start Checklist

### For Immediate Ad Launch (Next 2-3 hours)
- [ ] Complete PHASE 0, Task 0.1 (Fix product uploads)
- [ ] Complete PHASE 0, Task 0.2 (Fix generateSlides)
- [ ] Complete PHASE 0, Task 0.3 (Regenerate existing images)
- [ ] Complete PHASE 0, Task 0.4 (Export ZIP)
- [ ] Run Phase 0 tests
- [ ] Git commit + push
- [ ] Deploy to staging
- [ ] Test on mobile device
- [ ] Launch ads! 🚀

### For Complete Constructor (Next 2 weeks)
- [ ] Complete PHASE 0 (Day 1)
- [ ] Complete PHASE 1 (Days 2-3)
- [ ] Complete PHASE 2 (Day 4)
- [ ] Complete PHASE 3 (Day 5)
- [ ] Complete PHASE 4 (Day 6-7)
- [ ] Final review + deployment

---

## 🤝 Delegation Guide

### For Another Developer
1. Share files:
   - ROADMAP.md (this file)
   - MOBILE_FIRST_PROBLEM.md
   - CONSTRUCTOR-ARCHITECTURE.md

2. Assign specific phase or section

3. Provide access to:
   - Git repository
   - Testing credentials
   - Deployment access

### For Each Phase
Include in handoff:
- Phase objective
- Files to modify
- Implementation template
- Testing checklist
- Git commit format

---

## 📊 Progress Tracking

### Current Sprint (to be updated)
```
Sprint: [Current Date]
Phase: PHASE 0
Task: Not Started
Blocker: None
ETA: 2-3 hours
```

### Time Log (to be updated)
```
Date       | Phase  | Task      | Time Spent | Status
-----------|--------|-----------|------------|--------
2025-11-09 | PLAN   | Roadmap   | 1h         | DONE
           |        |           |            |
```

---

**Last Updated:** 2025-11-09
**Next Review:** After PHASE 0 completion
