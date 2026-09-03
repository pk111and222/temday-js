import { describe, expect, it } from '@rstest/core';
import advancedFormat from '../../src/plugin/advancedFormat.js';
import customParseFormat from '../../src/plugin/customParseFormat.js';
import localeData from '../../src/plugin/localeData.js';
import localizedFormat from '../../src/plugin/localizedFormat.js';
import parserPipeline from '../../src/plugin/parserPipeline.js';
import tokenRegistry from '../../src/plugin/tokenRegistry.js';
import { createTemday } from '../../src/context.js';

describe('parsing and localization plugins', () => {
  it('parses numeric formats, format arrays, strict widths, meridiem, and offsets', () => {
    const utc = createTemday({ timeZone: 'UTC' }).extend(customParseFormat);
    expect(utc('31/08/2026', 'DD/MM/YYYY').format('YYYY-MM-DD')).toBe('2026-08-31');
    expect(utc('2026.08.31', ['DD/MM/YYYY', 'YYYY.MM.DD']).format('YYYY-MM-DD')).toBe('2026-08-31');
    expect(utc('2026-8-1 1:02 pm', 'YYYY-M-D h:mm a').format('HH:mm')).toBe('13:02');
    expect(utc('2026-8-1', 'YYYY-MM-DD', true).isValid()).toBe(false);
    expect(utc('2026-08-31 08:00 +0800', 'YYYY-MM-DD HH:mm ZZ').format('YYYY-MM-DD HH:mm Z')).toBe('2026-08-31 00:00 +00:00');
  });

  it('keeps parser pipelines local to each context factory', () => {
    const configured = createTemday({ timeZone: 'UTC' }).extend(customParseFormat);
    const plain = createTemday({ timeZone: 'UTC' });
    expect(configured('31/08/2026', 'DD/MM/YYYY').isValid()).toBe(true);
    expect(plain('31/08/2026', 'DD/MM/YYYY').isValid()).toBe(false);
  });

  it('runs optional parser middleware as an onion and keeps dynamic token codecs local', () => {
    const events: string[] = []; const utc = createTemday({ timeZone: 'UTC' }).extend(parserPipeline).extend(tokenRegistry);
    utc.addParser((_context, next) => { events.push('before'); const value = next(); events.push('after'); return value; });
    utc.addParser((context) => {
      events.push('terminal');
      if (context.input !== 'release') return undefined;
      return { value: (globalThis as any).Temporal.ZonedDateTime.from({ year: 2026, month: 8, day: 31, timeZone: context.timeZone }), valid: true, timeZone: context.timeZone };
    });
    utc.addToken({ token: 'FY', format: (value) => `FY${value.year()}` });
    expect(utc('release').format('FY YYYY')).toBe('FY2026 2026');
    expect(events).toEqual(['before', 'terminal', 'after']);
    expect(createTemday({ timeZone: 'UTC' })('release').isValid()).toBe(false);
  });

  it('supplies native Intl locale data and immutable instance locales', () => {
    const utc = createTemday({ timeZone: 'UTC' }).extend(localeData, { locale: 'en' });
    const value = utc('2026-08-31T13:04:00');
    expect(value.format('MMMM dddd')).toContain('August');
    expect(value.localeData().code).toBe('en');
    const chinese = value.locale('zh-CN');
    expect(chinese).not.toBe(value);
    expect(value.locale()).toBe('en');
    expect(chinese.locale()).toBe('zh-CN');
    expect(chinese.format('MMMM')).toContain('月');
    expect(utc.locale('zh-CN')).toBe('zh-CN');
  });

  it('expands localized aliases and advanced display tokens without changing the core', () => {
    const utc = createTemday({ timeZone: 'UTC' }).extend(localeData, { locale: 'en' }).extend(localizedFormat).extend(advancedFormat);
    const value = utc('2026-08-31T13:04:05.006');
    expect(value.format('Do Q k kk X x')).toBe('31st 3 13 13 1788181445 1788181445006');
    expect(value.format('L')).toContain('2026');
    expect(value.format('LLLL')).toContain('August');
  });
});
