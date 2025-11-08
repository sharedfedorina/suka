# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a static website mirror created by HTTrack Website Copier. It's a local offline copy of the oversized.kopo.ua website (a Ukrainian fashion brand selling oversized t-shirts).

**Project Structure:**
- `Target/` - Root directory containing the mirrored website
  - `index.html` - HTTrack index page listing available mirrors
  - `Landing/` - Main mirrored website content
    - `oversized.kopo.ua/` - The actual website content (HTML, CSS, JS, images)
    - `connect.facebook.net/` - Cached Facebook integration scripts
    - `hts-cache/` - HTTrack cache files
    - `hts-log.txt` - HTTrack operation log

## Technology Stack

- **HTML5** - Static markup
- **CSS** - Styling (inline and external stylesheets)
- **JavaScript** - Client-side interactivity (vanilla JS)
- **Images** - GIF format assets (backblue.gif, fade.gif)

## Development

Since this is a static website mirror, there is no build process, package manager, or test suite.

**Viewing the website:**
- Open `Target/Landing/oversized.kopo.ua/index.html` in a web browser to view the mirrored site
- Or open `Target/index.html` to see the HTTrack project index

**Editing content:**
- HTML files can be edited directly in any text editor
- CSS changes should be made in referenced stylesheet files within `oversized.kopo.ua/`
- JavaScript logic is in `oversized.kopo.ua/js/` directory

## Important Notes

- This is a **static mirror**, not a live development project
- All external resources (images, scripts from cdn.facebook.com, etc.) are cached locally
- HTTrack logs and cache files should generally not be modified
- Links within the site are relative and should continue to work locally

---

## Landing Page Constructor (`constructor/`)

### Architecture Principle
**ONE CODE - DIFFERENT CONFIG FILES**

All code logic is identical regardless of which config is loaded. The only difference is the data source:

```
🔄 Оригінал        📂 Збережене
     ↓                    ↓
landing-data.json   user-config.json
     ↓                    ↓
  (identical structure, different values)
     ↓                    ↓
→→→ Single Code Logic ←←←
```

### Config Structure
Both `landing-data.json` and `user-config.json` have **identical structure**, only values differ:

```json
{
  "headerText": "text",
  "heroTitle": "text",
  "enableTimer": true/false,
  "enableStock": true/false,
  "heroImage": "img/start/start-1_m.webp",
  "page": {...},
  "header": {...},
  "hero": {...},
  "advantages": [...],
  "products": [...],
  "info": {...},
  "tabs": {...},
  "comments": {...},
  "faq": {...},
  "how_to_buy": {...},
  "request": {...},
  "footer": {...}
}
```

### Key Rules
1. **NO IF/ELSE logic** based on data source
2. **NO hardcoded paths** - all paths in config files
3. **Only replacements** - simple string replacements with values from config
4. **One function for all** - same code handles original and saved versions

### Template Replacement Pattern
```javascript
html = html.replace('{{heroTitle}}', formData.heroTitle);
html = html.replace('{{heroImage}}', formData.heroImage);
```

No parsing, no logic, just placeholder → value replacement.
