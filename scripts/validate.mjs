import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFile(path.join(root, file), 'utf8');
const tokens = JSON.parse(await read('design-system/tokens.json'));
const system = JSON.parse(await read('design-system/design-system.json'));
const copy = JSON.parse(await read('content/home.json'));
assert.equal(system.v, 3);
assert.ok(system.title && system.createdOnFiles && system.lastChange);
await access(path.join(root, 'design-system/README.md'));
await access(path.join(root, 'design-system/components/Cover/preview.html'));
const names = new Set();
for (const family of ['color', 'spacing', 'radius']) for (const token of tokens[family].tokens) {
  assert.match(token.name, /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/);
  assert.ok(!names.has(token.name), `Duplicate token ${token.name}`);
  names.add(token.name);
  assert.ok(token.usage);
}
for (const font of tokens.type.fonts) {
  const data = await readFile(path.join(root, 'design-system', font.file));
  assert.equal(data.subarray(0, 4).toString(), 'wOF2');
}
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map((n) => parseInt(n, 16) / 255).map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
}
for (const theme of tokens.color.themes) {
  const colors = Object.fromEntries(tokens.color.tokens.map((token) => [token.name, token.value[theme.id]]));
  for (const value of Object.values(colors)) assert.match(value, /^#[0-9a-f]{6}$/);
  for (const [foreground, background, min] of [['ink', 'bg', 4.5], ['ink', 'surface', 4.5], ['muted', 'bg', 4.5], ['muted', 'surface', 4.5], ['muted', 'warm', 4.5], ['brand', 'bg', 4.5], ['brand', 'tint', 4.5], ['on-brand', 'brand', 4.5], ['control-line', 'surface', 3]]) {
    const values = [luminance(colors[foreground]), luminance(colors[background])].sort((a, b) => b - a);
    const contrast = (values[0] + .05) / (values[1] + .05);
    assert.ok(contrast >= min, `${theme.id}: ${foreground}/${background} is ${contrast.toFixed(2)}, requires ${min}`);
  }
}

const sitemap = await read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(urls.length, 35);
assert.equal(new Set(urls).size, urls.length);
const domain = 'https://qr-video.luopeike.com';
const htmlFor = (pathname) => pathname.endsWith('/') ? `${pathname}index.html` : pathname + '.html';
const exists = async (file) => { try { return (await stat(file)).isFile(); } catch { return false; } };
let referenceCount = 0;
for (const url of urls) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, domain);
  assert.ok(!url.endsWith('.html'));
  const file = htmlFor(parsed.pathname).replace(/^\//, '');
  const html = await read(file);
  assert.ok(html.includes(`<link rel="canonical" href="${url}">`), `${file}: canonical`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: one h1`);
  assert.equal((html.match(/<main\b/g) || []).length, 1, `${file}: one main`);
  assert.ok(html.includes('id="content"'), `${file}: skip link target`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate ids`);
  assert.ok(!html.includes('lang-section"'), `${file}: inactive legacy language sections`);
  assert.ok(/<link rel="stylesheet" href="\/style\/site\.[0-9a-f]{12}\.css">/.test(html));
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
  for (const match of html.matchAll(/\b(?:href|src|value)="([^"]+)"/g)) {
    const reference = match[1].replaceAll('&amp;', '&');
    if (/^(mailto:|tel:|data:)/.test(reference)) continue;
    const target = new URL(reference, url);
    if (target.origin !== domain) continue;
    if (target.hash && target.pathname === parsed.pathname) assert.ok(ids.includes(decodeURIComponent(target.hash.slice(1))), `${file}: anchor ${reference}`);
    const pathname = decodeURIComponent(target.pathname);
    const destination = path.join(root, pathname);
    assert.ok(await exists(destination) || await exists(destination + '.html') || await exists(path.join(destination, 'index.html')), `${file}: missing ${reference}`);
    referenceCount++;
  }
  if (['index.html', 'help.html', 'support.html', 'privacy-policy.html'].includes(path.basename(file))) {
    const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)];
    assert.equal(alternates.length, 9, `${file}: all 8 locales and x-default`);
    for (const alternate of alternates) {
      assert.ok(urls.includes(alternate[2]), `${file}: alternate absent from sitemap`);
      const target = await read(htmlFor(new URL(alternate[2]).pathname).replace(/^\//, ''));
      assert.ok(target.includes(`href="${url}"`), `${file}: reciprocal hreflang`);
    }
  }
}
for (const locale of Object.keys(copy)) {
  const text = copy[locale];
  assert.equal(text.steps.length, 3);
  assert.equal(text.faqs.length, 3);
  assert.equal(text.tabs.length, 3);
  const home = await read(locale === 'en' ? 'index.html' : `${locale}/index.html`);
  for (const scene of ['create', 'reveal', 'history']) {
    const image = `images/app/${locale}-${scene}.webp`;
    const data = await readFile(path.join(root, image));
    const hash = createHash('sha256').update(data).digest('hex').slice(0, 12);
    assert.ok(home.includes(`/${image}?v=${hash}`), `${locale}: stale ${scene} image fingerprint`);
  }
}
const cssFile = (await readdir(path.join(root, 'style'))).find((file) => /^site\.[0-9a-f]{12}\.css$/.test(file));
const css = await read(`style/${cssFile}`);
for (const match of css.matchAll(/url\("([^"]+)"\)/g)) await access(path.resolve(root, 'style', match[1]));
const canvasRoot = path.resolve(root, '../website-design');
if (await exists(path.join(canvasRoot, 'canvas.json'))) {
  const canvas = JSON.parse(await readFile(path.join(canvasRoot, 'canvas.json'), 'utf8'));
  assert.ok(canvas.title && canvas.createdOnFiles && canvas.designSystems.length);
  for (const file of canvas.order) {
    const board = canvas.boards[file];
    assert.ok(board.w >= 40 && board.h >= 40 && board.expand === 'fill');
    const html = await readFile(path.join(canvasRoot, file), 'utf8');
    assert.ok(html.includes('<script src="./support.js"></script>') && html.includes('data-dc-script') && html.includes('<x-dc>'));
    assert.ok(!html.includes('data:'));
  }
  const installed = JSON.parse(await readFile(path.join(canvasRoot, 'ds/secret-video-message/tokens.json'), 'utf8'));
  assert.deepEqual(installed, tokens);
}
console.log(`Passed: design structure, tokens, both-theme contrast, ${urls.length} canonical pages, ${referenceCount} local references, JSON-LD, reciprocal hreflang, 8 locales and 24 screenshot assets.`);
