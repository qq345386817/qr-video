import { access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = process.argv[2];
if (!source) throw new Error('Pass the directory containing freshly rendered localized App Store screenshots.');
const locales = ['en', 'zh-Hans', 'zh-Hant', 'de-DE', 'es-ES', 'ru', 'ar', 'hi'];
const scenes = { create: '01-create-qr-video.png', reveal: '02-reveal-message.png', history: '04-message-history.png' };
const jobs = [];
for (const locale of locales) {
  for (const [scene, filename] of Object.entries(scenes)) {
    const input = path.resolve(source, locale === 'en' ? 'en-US' : locale, filename);
    await access(input);
    jobs.push([input, path.join(root, `images/app/${locale}-${scene}.webp`)]);
  }
}
// Validate the complete input set before replacing any current website images.
for (const [input, output] of jobs) {
  execFileSync('magick', [input, '-resize', '660x', '-strip', '-quality', '82', output]);
}
console.log(`Updated ${jobs.length} localized screenshot assets. Run npm run build and npm run check before publishing.`);
