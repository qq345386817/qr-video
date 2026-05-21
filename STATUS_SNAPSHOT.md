# qr-video Website Status Snapshot

_Last updated: 2026-05-20 11:40 Asia/Shanghai_

This is the durable handoff snapshot for the standalone git subproject:

- `/Users/mac/Documents/Projects/QRVideoMessage/qr-video`
- Remote: `https://github.com/qq345386817/qr-video.git`
- Branch: `main`

This subproject contains the public website / support pages for **Secret Video Message / 视频密信**:

- Product/support landing page
- Help documentation
- Privacy policy
- Favicon / web manifest
- SEO files (`robots.txt`, `sitemap.xml`)

---

## Current Page Structure

Static HTML only; no build step currently required.

Main pages:

- `index.html` — product landing page
- `help.html` — help / support / FAQ
- `support.html` — support/contact page
- `privacy-policy.html` — privacy policy

Localized pages:

- `zh-Hans/index.html`
- `zh-Hans/help.html`
- `zh-Hans/support.html`
- `zh-Hans/privacy-policy.html`
- `zh-Hant/index.html`
- `zh-Hant/help.html`
- `zh-Hant/support.html`
- `zh-Hant/privacy-policy.html`

English SEO guide pages:

- `hide-message-in-video.html`
- `reveal-hidden-message-video.html`
- `private-video-message-app.html`

Shared styling:

- `style/base.css`

Media:

- No standalone landing-page video assets are currently used.

Favicon / manifest:

- `favicon/favicon.ico`
- `favicon/favicon-16x16.png`
- `favicon/favicon-32x32.png`
- `favicon/apple-touch-icon.png`
- `favicon/android-chrome-192x192.png`
- `favicon/android-chrome-512x512.png`
- `favicon/site.webmanifest`

SEO:

- `robots.txt`
- `sitemap.xml`

---

## Work Completed In This Round

### 1. Language display bug fixed

Problem:

- `privacy-policy.html` language sections used both `lang-section` and `policy-page`.
- `style/base.css` previously had `.policy-page { display: block; }`, causing all three language sections to show at once.

Fix:

- Removed display control from `.policy-page`.
- Language visibility is now controlled by `.lang-section` and `.lang-section.active` only.

### 2. Dedicated language paths added

Affected pages:

- `index.html`
- `help.html`
- `support.html`
- `privacy-policy.html`

Behavior now:

1. English pages live at the site root.
2. Simplified Chinese pages live under `/zh-Hans/`.
3. Traditional Chinese pages live under `/zh-Hant/`.
4. Language switchers navigate to real page paths instead of `?lang=` URLs.

This matches the QR Tools-style SEO structure: each locale has its own URL, canonical URL, and hreflang alternates.

### 3. Sitemap expanded for language URLs

`sitemap.xml` now contains 15 URLs:

- 4 English core pages
- 4 Simplified Chinese core pages
- 4 Traditional Chinese core pages
- 3 English SEO guide pages

Validated with Python XML parser.

### 3a. Domain migrated

Public URLs are now based on:

- `https://qr-video.luopeike.com`

Old references to:

- `http://luopeike.com/qr-video`
- `https://luopeike.com/qr-video`

were replaced in the website, app About links, and Fastlane metadata.

### 4. Outdated landing-page video removed

The old landing-page video asset and embedded video players were removed because the video content no longer reflects the current app.

Removed:

- `videos/iPad-en-1600_1200.mp4`

`index.html` no longer embeds a demo video.

### 5. Unused video styling removed

The shared `style/base.css` image reset no longer includes a global `video` selector.

### 6. Unused `style/help.css` removed

Confirmed no pages reference `style/help.css`, then removed it.

### 7. Website favicon synced to current app icon

Favicon files were regenerated from the current main app icon:

- Source app icon:
  - `/Users/mac/Documents/Projects/QRVideoMessage/QRVideoMessage/Main/Assets.xcassets/AppIcon.appiconset/icon-1024.png`

Generated/replaced:

- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png`
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

### 8. Manifest updated

`favicon/site.webmanifest` now has:

- `name`: `Secret Video Message`
- `short_name`: `Secret Video`
- relative icon paths, suitable for deployment under `/qr-video/`
- `theme_color`: `#6270c7`
- `background_color`: `#f6f5fb`

Important: icon paths are intentionally relative to the manifest file, not root-relative.

### 9. Website theme colors synced to app color system

Main app colors inspected from Xcode asset catalog:

- Accent light: `#6c67c9`
- Accent dark: `#a895e0`
- Main light: `#6270c7`
- Main dark: `#beb2f0`
- Content background light: `#f6f5fb`
- Content background dark: `#120f22`

Website now uses matching CSS variables in `style/base.css`:

Light:

- `--bg-color: #f6f5fb`
- `--accent-color: #6270c7`
- `--accent-strong: #6c67c9`

Dark:

- `--bg-color: #120f22`
- `--accent-color: #beb2f0`
- `--accent-strong: #a895e0`

The core HTML pages now have separate light/dark `theme-color` meta tags:

```html
<meta name="theme-color" content="#6270c7" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#120f22" media="(prefers-color-scheme: dark)">
```

### 10. Page width unified

Problem:

- `index.html` used `.page` width `1040px`.
- `help.html` and `privacy-policy.html` used `.wrapper` width `860px`.
- Switching pages caused visible width jump.

Fix:

- `style/base.css` `.wrapper` now uses:

```css
width: min(1040px, calc(100% - 32px));
```

Now the three pages have consistent main content width.

---

## Validation Already Done

Checked during this round:

- Local HTML resource links: no missing local refs.
- Duplicate HTML IDs: none found.
- Language switchers point to real locale paths.
- Localized core pages exist under `zh-Hans/` and `zh-Hant/`.
- `sitemap.xml` parses as XML.
- `favicon/site.webmanifest` parses as JSON.
- Manifest icon paths exist.
- Favicon output dimensions are correct:
  - 16 × 16
  - 32 × 32
  - 180 × 180
  - 192 × 192
  - 512 × 512
- New MP4 probes successfully as H.264/AAC, 1600 × 1200.
- Removed stale references to:
  - old `.mov` file
  - `autoplay`
  - `style/help.css`
  - old purple/orange theme tokens such as `#7a55ff`, `#ff9a3c`

---

## Current Git Status Notes

As of this snapshot, expect the standalone `qr-video` git status to include:

Modified:

- `favicon/android-chrome-192x192.png`
- `favicon/android-chrome-512x512.png`
- `favicon/apple-touch-icon.png`
- `favicon/favicon-16x16.png`
- `favicon/favicon-32x32.png`
- `favicon/favicon.ico`
- `favicon/site.webmanifest`
- `help.html`
- `index.html`
- `privacy-policy.html`
- `style/base.css`

Deleted:

- `style/help.css`
- `videos/iPad-en-1600_1200.mov`
- `videos/iPad-en-1600_1200.mp4`

Untracked / should be added if publishing this update:

- `STATUS_SNAPSHOT.md`
- `hide-message-in-video.html`
- `private-video-message-app.html`
- `reveal-hidden-message-video.html`
- `support.html`
- `zh-Hans/`
- `zh-Hant/`

Do **not** assume these are committed yet.

---

## Remaining Optional Improvements

Not blockers for current release:

1. **Visual browser screenshot pass**

   A final manual/browser visual pass in light and dark mode would still be useful before publishing.

2. **Commit in standalone repo**

   If user approves, commit/push should happen from inside:

   ```bash
   cd /Users/mac/Documents/Projects/QRVideoMessage/qr-video
   ```

   Remember this is a standalone git project, not just a normal folder in the parent app repo.
