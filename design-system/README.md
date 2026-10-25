# Secret Video Message

Small words. A little anticipation. A real message.

## Content Fundamentals

Explain the product as text encoded into a QR video, shared as an original video file, then imported into the app to reveal the text. Use concrete verbs: write, create, share, import, reveal. Keep the former names QR Video and QR Video Message in factual product context where helpful. Avoid promises of encryption, anonymous delivery, automatic timed unlocking, or support for decoding arbitrary videos. Recipients need the app. Recompression and editing may damage QR frames.

## Visual Foundations

The source inventory contains 10 color tokens across light and dark themes, 6 typography styles, 4 spacing tokens, 3 radii, and 3 self-hosted Manrope font subsets. The native app's Main, ContentBK and pale-orange assets provide the exact brand, background and warm values. Supporting neutrals are new website choices, not an extraction of old CSS. Every listed token is implemented. There is no JavaScript component library to copy.

Use `bg` for the canvas, `surface` for paper, `ink` for primary text and `muted` for supporting copy. Use `brand` with `on-brand` for primary actions. Use `warm` for the personal-note panel and `tint` for quieter brand panels. `line` is decorative; use `control-line` or a filled state to identify controls. Avoid gradients behind the website layout. Real App screenshots may contain the App's own gradients.

Use the `display`, `section-title`, `heading`, `body`, `small` and `label` typography styles. Manrope covers Latin and Cyrillic; Chinese, Arabic and Hindi use native platform fallback fonts. Keep reading text at 16px or larger and touch targets at least 44px. Use `space-2`, `space-4`, `space-8` and `space-16` for the underlying rhythm. Use `radius-sm` for controls, `radius-md` for notes and `radius-lg` for the hero stage.

## Iconography and Imagery

Use the existing app icon from `favicon/` unchanged. Use inline, decorative stroke SVGs for arrows and simple action symbols, never emoji as interface icons. Website screenshots are compressed copies of the real 1.5.3 App Store captures, not invented interfaces. Their visible phone framing is cropped with CSS. No new logo is drawn, and no original screenshot pixels are retouched.

## Consuming This System

Read this file, then `tokens.json`. It is the source of truth. `node scripts/build.mjs` emits the website's fingerprinted CSS from the tokens and `style/base.css`, and updates page references. Font files are in `fonts/` and are licensed under SIL OFL 1.1; see `fonts/OFL.txt`. No bundle or global component namespace is required. The design canvas installs a copy of tokens and this guide. It uses the same named values and native font fallbacks because asset-import tools are unavailable in this session.

## Validation

Official design_system_check is unavailable in this environment. The website validator checks token shape, every theme, contrast for text/control pairs, design canvas structure, links, canonical URLs, hreflang, structured data and sitemap coverage. Browser QA checks the actual website separately.
