import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const artifacts = [
  ['core', 'temday'],
  ['context', 'temday-context'],
  ['polyfill', 'temday-polyfill'],
  ['full', 'temday-full'],
];

for (const [entry, name] of artifacts) {
  const file = new URL(`../dist/umd/${entry}.umd.min.js`, import.meta.url);
  const banner = `/*! ${name} v${version} | https://github.com/pk111and222/temday */\n`;
  const content = readFileSync(file, 'utf8');
  writeFileSync(file, content.startsWith(banner) ? content : `${banner}${content}`);
  copyFileSync(file, new URL(`../dist/umd/${entry}-${version}.umd.min.js`, import.meta.url));
}
