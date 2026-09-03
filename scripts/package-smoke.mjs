import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const workspace = mkdtempSync(join(tmpdir(), 'temday-package-'));
const consumer = join(workspace, 'consumer');
const run = (args, options = {}) => execFileSync(process.execPath, args, { cwd: consumer, stdio: 'inherit', ...options });

try {
  execFileSync('pnpm', ['pack', '--pack-destination', workspace], { cwd: root, stdio: 'inherit' });
  const archive = join(workspace, readdirSync(workspace).find((file) => file.endsWith('.tgz')) ?? '');
  assert.ok(archive.endsWith('.tgz'), 'pnpm pack did not produce an archive');
  mkdirSync(consumer);
  execFileSync('npm', ['install', '--ignore-scripts', '--no-package-lock', '--no-save', archive], { cwd: consumer, stdio: 'inherit' });
  run(['--input-type=module', '--eval', "import 'temday/polyfill'; import temday from 'temday'; if(temday('2026-08-31').add(1,'day').format('YYYY-MM-DD')!=='2026-09-01') throw Error('ESM smoke failed')"]);
  run(['--eval', "require('temday/polyfill'); const temday=require('temday'); if(typeof temday!=='function'||temday.default!==temday||typeof temday.configure!=='function'||temday('2026-08-31').add(1,'day').format('YYYY-MM-DD')!=='2026-09-01') throw Error('CJS smoke failed')"]);
  run(['--input-type=module', '--eval', "import 'temday/polyfill'; import temday from 'temday'; import customParseFormat from 'temday/plugin/customParseFormat'; import advancedFormat from 'temday/plugin/advancedFormat'; temday.extend(customParseFormat).extend(advancedFormat); if(temday('31/08/2026','DD/MM/YYYY').format('Do Q')!=='31st 3') throw Error('plugin ESM smoke failed')"]);
  run(['--eval', "require('temday/polyfill'); const temday=require('temday'); const customParseFormat=require('temday/plugin/customParseFormat'); if(typeof customParseFormat!=='function'||temday.extend(customParseFormat)('31/08/2026','DD/MM/YYYY').format('YYYY-MM-DD')!=='2026-08-31') throw Error('plugin CJS smoke failed')"]);
  run(['--input-type=module', '--eval', "import 'temday/polyfill'; import full from 'temday/full'; const value=full('31/08/2026','DD/MM/YYYY'); if(value.format('Do Q')!=='31st 3'||!value.isBetween('2026-08-01','2026-09-01')||full.duration(1000).humanize()!=='1 second') throw Error('full ESM smoke failed')"]);
  run(['--eval', "require('temday/polyfill'); const full=require('temday/full'); if(typeof full!=='function'||full('31/08/2026','DD/MM/YYYY').format('Do Q')!=='31st 3') throw Error('full CJS smoke failed')"]);
  run(['--eval', "for(const path of ['temday/plugin/localeData','temday/plugin/localizedFormat','temday/plugin/advancedFormat','temday/plugin/parserPipeline','temday/plugin/tokenRegistry','temday/plugin/utc','temday/plugin/timezone','temday/plugin/relativeTime','temday/plugin/duration','temday/plugin/calendar','temday/plugin/weekOfYear','temday/plugin/isoWeek','temday/plugin/quarterOfYear','temday/plugin/isBetween','temday/plugin/isSameOrAfter','temday/plugin/isSameOrBefore','temday/plugin/weekday','temday/plugin/weekYear','temday/plugin/objectSupport','temday/plugin/arraySupport','temday/plugin/bigIntSupport','temday/plugin/minMax','temday/plugin/toArray','temday/plugin/toObject','temday/plugin/updateLocale','temday/plugin/preParsePostFormat','temday/plugin/badMutable','temday/plugin/isLeapYear','temday/plugin/dayOfYear','temday/plugin/isToday','temday/plugin/isTomorrow','temday/plugin/isYesterday','temday/plugin/pluralGetSet','temday/plugin/buddhistEra','temday/plugin/negativeYear','temday/locale/intl']) if(typeof require(path)!=='function') throw Error('plugin CJS entry failed: '+path)"]);
  const browser = { console, Intl, Date, Math, Object, Array, String, Number, Boolean, RegExp, Error, TypeError, RangeError, SyntaxError, Symbol, Set, Map, WeakMap, WeakSet, JSON, Promise, Reflect, Proxy, BigInt, Uint8Array, ArrayBuffer, DataView, TextEncoder, TextDecoder };
  browser.self = browser; browser.globalThis = browser;
  vm.createContext(browser);
  const umd = join(consumer, 'node_modules', 'temday', 'dist', 'umd');
  const files = ['core.umd.min.js', 'context.umd.min.js', 'polyfill.umd.min.js', 'full.umd.min.js'];
  for (const file of files) assert.ok(readdirSync(umd).includes(file), `UMD artifact is missing: ${file}`);
  vm.runInContext(readFileSync(join(umd, 'polyfill.umd.min.js'), 'utf8'), browser);
  assert.equal(typeof browser.temdayPolyfill, 'object', 'UMD polyfill did not expose temdayPolyfill');
  vm.runInContext(readFileSync(join(umd, 'core.umd.min.js'), 'utf8'), browser);
  assert.equal(typeof browser.temday, 'function', 'UMD root did not expose window.temday');
  assert.equal(browser.temday('2026-08-31').add(1, 'day').format('YYYY-MM-DD'), '2026-09-01', 'UMD browser global failed');
  vm.runInContext(readFileSync(join(umd, 'context.umd.min.js'), 'utf8'), browser);
  assert.equal(typeof browser.temdayContext.createTemday, 'function', 'UMD context did not expose createTemday');
  vm.runInContext(readFileSync(join(umd, 'full.umd.min.js'), 'utf8'), browser);
  assert.equal(browser.temday('31/08/2026', 'DD/MM/YYYY').format('Do Q'), '31st 3', 'UMD full entry did not install plugins');
} finally {
  rmSync(workspace, { recursive: true, force: true });
}

console.log('packed ESM/CJS/UMD smoke test passed');
