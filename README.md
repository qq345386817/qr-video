# Secret Video Message Website

Production: https://qr-video.luopeike.com/

This is the independent `qr-video` Git repository. The native App lives in the parent repository.

## Editing and Building

No packages need to be installed. Node 20 or newer is sufficient.

```sh
npm run build
npm run check
npm run dev
```

The local server listens on `http://127.0.0.1:4173` and supports the same extensionless content routes as Cloudflare Pages.

- `content/home.json`: complete homepage copy for English, Simplified Chinese, Traditional Chinese, German, Spanish, Russian, Arabic and Hindi.
- `design-system/README.md` and `design-system/tokens.json`: brand rules, light/dark colors, type, spacing and radii.
- `style/base.css`: responsive website layout.
- `script/site.js`: progressive screenshot switching. FAQ disclosures use native HTML and work without JavaScript.
- `scripts/build.mjs`: generates homepages, shares navigation across 35 canonical pages, and fingerprints runtime CSS/JavaScript. It preserves document copy and existing SEO metadata.
- `scripts/validate.mjs`: validates tokens, text/control contrast, all sitemap routes, local links, canonical tags, reciprocal hreflang and JSON-LD.

Commit generated HTML and fingerprinted runtime assets alongside their source. The existing Cloudflare Pages project serves this repository as a static website, so a deployment does not require a new build configuration.

## Images and Fonts

The 24 WebP images in `images/app/` come from the native App's 1.6.0 localized App Store captures: Create, Reveal and History in all 8 languages. They retain the original content and are downsampled to 660px wide at WebP quality 82. The hero uses CSS cropping to show the phone portion of the Create image. No interface is fabricated. Each image URL includes its content fingerprint so browsers do not retain an older App interface after an update.

After generating and visually checking fresh native store screenshots, run `node scripts/update-app-screenshots.mjs ../fastlane/screenshots`, then build and check again. All 24 inputs are required before any website image is replaced.

Manrope is self-hosted in `design-system/fonts/` with its SIL Open Font License. No third-party font request is required by the production website. Chinese, Arabic and Hindi use platform fallback fonts.

## Publishing

The Cloudflare Pages project is `qr-video`, linked to this repository's `main` branch. Check locally, commit/push from this Git root, and verify the new production deployment and its live HTML, CSS and routes. An uploaded or pushed commit alone does not establish that the custom domain is current.

The 35 existing canonical URLs remain unchanged. Keep `sitemap.xml` lastmod dates aligned with real page changes. `404.html` ensures unknown paths return a real 404 instead of an App-style fallback. Development material has `X-Robots-Tag: noindex` headers.

Local browser screenshots, logs, browser dependencies and Cloudflare authentication/cache data are not committed.
