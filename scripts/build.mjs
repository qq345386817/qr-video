import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFile(path.join(root, file), 'utf8');
const copy = JSON.parse(await read('content/home.json'));
const tokens = JSON.parse(await read('design-system/tokens.json'));
const locales = Object.keys(copy);
const localeNames = ['English', '简体中文', '繁體中文', 'Deutsch', 'Español', 'Русский', 'العربية', 'हिन्दी'];
const routeFor = (locale, file = 'index.html') => `${locale === 'en' ? '/' : `/${locale}/`}${file === 'index.html' ? '' : file.replace(/\.html$/, '')}`;
const e = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const icon = (kind) => {
  const lines = {
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    note: '<path d="M7 3h8l4 4v14H5V3h2Zm8 0v5h5M8 12h8m-8 4h6"/>',
    gift: '<path d="M3 8h18v4H3Zm2 4v9h14v-9M12 8v13m0-13H8a3 3 0 1 1 3-3l1 3Zm0 0h4a3 3 0 1 0-3-3l-1 3Z"/>',
    clue: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M7 10h6m-3-3v6"/>',
    heart: '<path d="M20 5c-3-3-7-1-8 1-1-2-5-4-8-1-4 4 0 9 8 15 8-6 12-11 8-15Z"/>'
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${lines[kind]}</svg>`;
};

const themeRules = (theme) => tokens.color.tokens.map((token) => {
  const value = typeof token.value === 'string' ? token.value : token.value[theme];
  return `--${token.name}:${value.replace(/^\{(.+)\}$/, 'var(--$1)')};`;
}).join('');
let generated = `/* Generated from design-system/tokens.json and style/base.css. */\n:root{${themeRules('light')}--font-sans:${tokens.type.families.sans};`;
for (const family of ['spacing', 'radius']) {
  for (const token of tokens[family].tokens) generated += `--${token.name}:${token.value};`;
}
generated += `}\n@media(prefers-color-scheme:dark){:root{${themeRules('dark')}}}\n${await read('style/base.css')}`;
const fingerprint = (source) => createHash('sha256').update(source).digest('hex').slice(0, 12);
const imageVersions = new Map();
for (const locale of locales) {
  for (const scene of ['create', 'reveal', 'history']) {
    const image = `/images/app/${locale}-${scene}.webp`;
    imageVersions.set(image, fingerprint(await readFile(path.join(root, image))));
  }
}
const cssFile = `style/site.${fingerprint(generated)}.css`;
const js = await read('script/site.js');
const jsFile = `script/site.${fingerprint(js)}.js`;
await writeFile(path.join(root, cssFile), generated);
await writeFile(path.join(root, jsFile), js);

function header(locale, current = 'index.html', guide = false) {
  const text = copy[locale];
  const pages = ['index.html', 'help.html', 'support.html', 'privacy-policy.html'];
  return `<a class="skip-link" href="#content">${e(text.skip)}</a>
  <header class="topbar">
    <a class="brand" href="${routeFor(locale)}"><img src="/favicon/android-chrome-192x192.png" alt="" width="40" height="40"><span>${e(text.brand)}</span></a>
    <nav class="site-nav" aria-label="${e(text.nav[0])}">${pages.map((file, i) => `<a${file === current ? ' class="active" aria-current="page"' : ''} href="${routeFor(locale, file)}">${e(text.nav[i])}</a>`).join('')}</nav>
    <div class="language-switcher"><select class="lang-select" aria-label="${e(text.language)}" onchange="if(this.value)window.location.href=this.value">${locales.map((lang, i) => `<option value="${routeFor(lang, guide ? 'index.html' : current)}"${lang === locale ? ' selected' : ''}>${localeNames[i]}</option>`).join('')}</select></div>
  </header>`;
}

function footer(locale) {
  const text = copy[locale];
  return `<footer class="footer-bar"><span class="footer-note">${e(text.footer)}</span><nav class="footer-links" aria-label="${e(text.nav[2])}"><a href="${routeFor(locale, 'help.html')}">${e(text.nav[1])}</a><a href="${routeFor(locale, 'support.html')}">${e(text.nav[2])}</a><a href="${routeFor(locale, 'privacy-policy.html')}">${e(text.nav[3])}</a><a href="mailto:cameoshell09@gmail.com">cameoshell09@gmail.com</a></nav></footer>`;
}

function home(locale) {
  const text = copy[locale];
  const shot = (scene) => {
    const image = `/images/app/${locale}-${scene}.webp`;
    return `${image}?v=${imageVersions.get(image)}`;
  };
  const download = `<a class="button primary" href="https://apps.apple.com/app/id6504264474" target="_blank" rel="noopener noreferrer">${e(text.download)}${icon('arrow')}</a>`;
  return `<body class="home"><div class="wrapper">
  ${header(locale)}
  <main id="content">
    <section class="home-hero" aria-labelledby="hero-title">
      <div class="hero-copy"><p class="eyebrow">${e(text.eyebrow)}</p><h1 id="hero-title">${e(text.title)}<span>${e(text.accent)}</span></h1><p class="hero-lead">${e(text.lead)}</p>
        <div class="actions">${download}<a class="text-link" href="#how-it-works">${e(text.how)}${icon('arrow')}</a></div>
        <div class="compatibility"><span>${icon('check')}${e(text.noAccount)}</span><span dir="ltr">${e(text.platforms)}</span></div>
      </div>
      <figure class="hero-stage" aria-label="${e(text.screenLabel)}"><span class="stage-label">${e(text.screenLabel)}</span><div class="hero-shot" dir="ltr"><img src="${shot('create')}" alt="${e(text.screenAlt)}" width="660" height="1434" fetchpriority="high" decoding="async"></div><div class="note-card">${icon('note')}<p class="note-label">${e(text.noteLabel)}</p><p>${e(text.noteText)}</p></div></figure>
    </section>
    <section class="section-block" id="how-it-works" aria-labelledby="steps-title"><div class="section-heading"><h2 id="steps-title">${e(text.stepsTitle)}</h2><p>${e(text.stepsLead)}</p></div><ol class="workflow">${text.steps.map(([title, body], i) => `<li><span class="step-number" aria-hidden="true">0${i + 1} /</span><h3>${e(title)}</h3><p>${e(body)}</p></li>`).join('')}</ol></section>
    <section class="app-tour" aria-labelledby="preview-title"><div class="tour-copy"><p class="section-kicker">${e(text.brand)}</p><h2 id="preview-title">${e(text.previewTitle)}</h2><p>${e(text.previewLead)}</p><div class="preview-controls" role="group" aria-label="${e(text.screenLabel)}">${text.tabs.map((label, i) => `<button type="button" data-preview-button data-preview-src="${shot(['create', 'reveal', 'history'][i])}" data-preview-alt="${e(text.previewAlt + ' · ' + label)}" aria-pressed="${i === 0}" aria-controls="app-preview">${e(label)}</button>`).join('')}</div><p class="preview-note">${e(text.previewNote)}</p></div><figure class="preview-figure"><img id="app-preview" src="${shot('create')}" alt="${e(text.previewAlt + ' · ' + text.tabs[0])}" width="660" height="1434" loading="lazy" decoding="async"><figcaption id="preview-status" aria-live="polite">${e(text.tabs[0])}</figcaption></figure></section>
    <section class="use-cases" aria-labelledby="uses-title"><h2 id="uses-title">${e(text.usesTitle)}</h2><div class="use-grid">${text.uses.map(([title, body], i) => `<article class="use-card">${icon(['gift', 'heart', 'clue'][i])}<h3>${e(title)}</h3><p>${e(body)}</p></article>`).join('')}</div></section>
    <section class="faq" aria-labelledby="faq-title"><h2 id="faq-title">${e(text.faqTitle)}</h2><div>${text.faqs.map(([q, a]) => `<details><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join('')}</div></section>
    ${locale === 'en' ? '<nav class="guide-links" aria-label="Message video guides"><a href="/hide-message-in-video">How to hide a message in a video</a><a href="/reveal-hidden-message-video">How to reveal a hidden message</a><a href="/private-video-message-app">Ideas for message videos</a></nav>' : ''}
    <section class="download-panel"><div><h2>${e(text.ctaTitle)}</h2><p>${e(text.ctaLead)}</p></div>${download}</section>
  </main>${footer(locale)}</div><script src="/${jsFile}" defer></script></body>`;
}

function matchingTagEnd(html, start, tag) {
  const pattern = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
  pattern.lastIndex = start;
  let depth = 0;
  for (let match; (match = pattern.exec(html));) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (!depth) return pattern.lastIndex;
  }
  throw new Error(`Unclosed ${tag}`);
}

const files = (await readdir(root)).filter((name) => name.endsWith('.html') && !name.startsWith('google') && name !== '404.html');
for (const locale of locales.filter((item) => item !== 'en')) {
  for (const file of await readdir(path.join(root, locale))) if (file.endsWith('.html')) files.push(`${locale}/${file}`);
}
for (const file of files) {
  const locale = file.includes('/') ? file.split('/')[0] : 'en';
  const basename = path.basename(file);
  let html = await read(file);
  html = html.replace(/<style>[\s\S]*?<\/style>\s*/g, '');
  html = html.replace(/<link rel="stylesheet" href="[^"]+">/, `<link rel="stylesheet" href="/${cssFile}">`);
  html = html.replace(/(<meta name="theme-color" content=")[^"]+(" media="\(prefers-color-scheme: light\)">)/, '$1#4f6f9f$2');
  html = html.replace(/(<meta name="theme-color" content=")[^"]+(" media="\(prefers-color-scheme: dark\)">)/, '$1#0f1218$2');
  if (basename === 'index.html') {
    html = html.slice(0, html.indexOf('<body')) + home(locale) + '\n</html>\n';
  } else {
    for (const hidden of ['zh-Hans', 'zh-Hant']) {
      const start = html.indexOf(`<div id="${hidden}" class="lang-section`);
      if (start !== -1) html = html.slice(0, start) + html.slice(matchingTagEnd(html, start, 'div'));
    }
    const headerStart = html.search(/<(?:div|header) class="topbar">/);
    if (headerStart !== -1) {
      const tag = html.startsWith('<header', headerStart) ? 'header' : 'div';
      // The generated skip link belongs to the same header block on subsequent builds.
      const skipStart = html.lastIndexOf('<a class="skip-link"', headerStart);
      const start = skipStart !== -1 && html.slice(skipStart, headerStart).trim().endsWith('</a>') ? skipStart : headerStart;
      html = html.slice(0, start) + header(locale, basename, !['help.html', 'support.html', 'privacy-policy.html'].includes(basename)) + html.slice(matchingTagEnd(html, headerStart, tag));
    }
    if (html.includes('<main')) html = html.replace(/<main(?![^>]*\bid=)/, '<main id="content"');
    else {
      const start = html.indexOf('<div id="en" class="lang-section active');
      if (start !== -1) {
        const end = matchingTagEnd(html, start, 'div');
        html = html.slice(0, start) + html.slice(start, end).replace(/^<div id="en"/, '<main id="content"').replace(/<\/div>$/, '</main>') + html.slice(end);
      }
    }
  }
  await writeFile(path.join(root, file), html.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n');
}

let notFound = await read('404.html');
notFound = notFound.replace(/href="\/style\/[^"]+"/, `href="/${cssFile}"`);
await writeFile(path.join(root, '404.html'), notFound);
for (const directory of ['style', 'script']) {
  for (const file of await readdir(path.join(root, directory))) {
    if (/^site\.[0-9a-f]{12}\.(css|js)$/.test(file) && ![cssFile, jsFile].includes(`${directory}/${file}`)) await unlink(path.join(root, directory, file));
  }
}
console.log(`Built ${files.length} pages with ${cssFile} and ${jsFile}.`);
