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
  run(['--input-type=module', '--eval', "import 'temday-js/polyfill'; import temday from 'temday-js'; if(temday('2026-08-31').add(1,'day').format('YYYY-MM-DD')!=='2026-09-01') throw Error('ESM smoke failed')"]);
  run(['--eval', "require('temday-js/polyfill'); const temday=require('temday-js'); if(typeof temday!=='function'||temday.default!==temday||typeof temday.configure!=='function'||temday('2026-08-31').add(1,'day').format('YYYY-MM-DD')!=='2026-09-01') throw Error('CJS smoke failed')"]);
  run(['--input-type=module', '--eval', "import 'temday-js/polyfill'; import temday from 'temday-js'; import customParseFormat from 'temday-js/plugin/customParseFormat'; import advancedFormat from 'temday-js/plugin/advancedFormat'; temday.extend(customParseFormat).extend(advancedFormat); if(temday('31/08/2026','DD/MM/YYYY').format('Do Q')!=='31st 3') throw Error('plugin ESM smoke failed')"]);
  run(['--eval', "require('temday-js/polyfill'); const temday=require('temday-js'); const customParseFormat=require('temday-js/plugin/customParseFormat'); if(typeof customParseFormat!=='function'||temday.extend(customParseFormat)('31/08/2026','DD/MM/YYYY').format('YYYY-MM-DD')!=='2026-08-31') throw Error('plugin CJS smoke failed')"]);
  run(['--input-type=module', '--eval', "import 'temday-js/polyfill'; import full from 'temday-js/full'; const value=full('31/08/2026','DD/MM/YYYY'); if(value.format('Do Q')!=='31st 3'||!value.isBetween('2026-08-01','2026-09-01')||full.duration(1000).humanize()!=='1 second') throw Error('full ESM smoke failed')"]);
  run(['--eval', "require('temday-js/polyfill'); const full=require('temday-js/full'); if(typeof full!=='function'||full('31/08/2026','DD/MM/YYYY').format('Do Q')!=='31st 3') throw Error('full CJS smoke failed')"]);
  run(['--eval', "for(const path of ['temday-js/plugin/localeData','temday-js/plugin/localizedFormat','temday-js/plugin/advancedFormat','temday-js/plugin/parserPipeline','temday-js/plugin/tokenRegistry','temday-js/plugin/utc','temday-js/plugin/timezone','temday-js/plugin/relativeTime','temday-js/plugin/duration','temday-js/plugin/calendar','temday-js/plugin/weekOfYear','temday-js/plugin/isoWeek','temday-js/plugin/quarterOfYear','temday-js/plugin/isBetween','temday-js/plugin/isSameOrAfter','temday-js/plugin/isSameOrBefore','temday-js/plugin/weekday','temday-js/plugin/weekYear','temday-js/plugin/objectSupport','temday-js/plugin/arraySupport','temday-js/plugin/bigIntSupport','temday-js/plugin/minMax','temday-js/plugin/toArray','temday-js/plugin/toObject','temday-js/plugin/updateLocale','temday-js/plugin/preParsePostFormat','temday-js/plugin/badMutable','temday-js/plugin/isLeapYear','temday-js/plugin/dayOfYear','temday-js/plugin/isToday','temday-js/plugin/isTomorrow','temday-js/plugin/isYesterday','temday-js/plugin/pluralGetSet','temday-js/plugin/buddhistEra','temday-js/plugin/negativeYear','temday-js/locale/intl']) if(typeof require(path)!=='function') throw Error('plugin CJS entry failed: '+path)"]);
  const browser = { console, Intl, Date, Math, Object, Array, String, Number, Boolean, RegExp, Error, TypeError, RangeError, SyntaxError, Symbol, Set, Map, WeakMap, WeakSet, JSON, Promise, Reflect, Proxy, BigInt, Uint8Array, ArrayBuffer, DataView, TextEncoder, TextDecoder };
  browser.self = browser; browser.globalThis = browser;
  vm.createContext(browser);
  const umd = join(consumer, 'node_modules', 'temday-js', 'dist', 'umd');
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
