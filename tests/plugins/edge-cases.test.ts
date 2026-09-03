import { describe, expect, it, rs } from '@rstest/core';
import { Temporal } from '@js-temporal/polyfill';
import temday from '../../src/index.js';
import { createTemday } from '../../src/context.js';
import { createIntlLocaleProvider } from '../../src/locale/intl.js';
import advancedFormat from '../../src/plugin/advancedFormat.js';
import arraySupport from '../../src/plugin/arraySupport.js';
import bigIntSupport from '../../src/plugin/bigIntSupport.js';
import calendar from '../../src/plugin/calendar.js';
import customParseFormat from '../../src/plugin/customParseFormat.js';
import duration from '../../src/plugin/duration.js';
import localeData from '../../src/plugin/localeData.js';
import localizedFormat from '../../src/plugin/localizedFormat.js';
import negativeYear from '../../src/plugin/negativeYear.js';
import objectSupport from '../../src/plugin/objectSupport.js';
import preParsePostFormat from '../../src/plugin/preParsePostFormat.js';
import relativeTime from '../../src/plugin/relativeTime.js';
import timezone from '../../src/plugin/timezone.js';
import tokenRegistry from '../../src/plugin/tokenRegistry.js';
import updateLocale from '../../src/plugin/updateLocale.js';
import utc from '../../src/plugin/utc.js';
import { Temday } from '../../src/core/instance.js';

const factory = () => createTemday({ timeZone: 'UTC' });

describe('remaining production branches', () => {
  it('covers root and context plugin parser control flow', () => {
    const local = createTemday();
    expect(() => local.extend(null as never)).toThrow(TypeError);
    local.extend((_o, _D, _f, runtime) => runtime.addParser(() => undefined));
    local.extend((_o, _D, _f, runtime) => runtime.addParser(undefined as never));
    local.extend((_o, _D, _f, runtime) => runtime.addParser(() => null as never));
    expect(local('2024-01-02').isValid()).toBe(true);
    expect(local.isTemday(local())).toBe(true);
    expect(local.isTemday({})).toBe(false);
    const rootPlugin = (_o: unknown, _D: Function, _f: Function, runtime: any) => runtime.addParser((input: unknown, _format: unknown, _locale: unknown, _strict: unknown, zone: string) => input === 'covered-root' ? { value: Temporal.Now.instant().toZonedDateTimeISO(zone), valid: true, timeZone: zone } : undefined);
    temday.extend(rootPlugin as never);
    temday.extend((_o: unknown, _D: Function, _f: Function, runtime: any) => runtime.addParser(undefined));
    expect(temday('covered-root').isValid()).toBe(true);
    expect(temday('2024-01-02').isValid()).toBe(true);
  });

  it('covers Temporal-unavailable failure and global fallback in an isolated module', async () => {
    const original = (globalThis as any).Temporal;
    rs.resetModules(); delete (globalThis as any).Temporal;
    const isolated = await import('../../src/core/temporal.js');
    expect(() => isolated.temporal()).toThrow('Temporal unavailable');
    (globalThis as any).Temporal = Temporal;
    expect(isolated.defaultTimeZone()).toBeTruthy();
    (globalThis as any).Temporal = original;
  });

  it('covers Intl locale strings, ordinal fallbacks and first-day fallbacks', () => {
    const en = createIntlLocaleProvider('en'); const fr = createIntlLocaleProvider('fr');
    expect(en.month(0, true)).toBe('Jan');
    expect(en.weekday(1, true)).toBeTruthy();
    expect(en.weekday(1, false, true)).toBeTruthy();
    expect(en.ordinal(11)).toBe('11th'); expect(en.ordinal(12)).toBe('12th'); expect(en.ordinal(13)).toBe('13th'); expect(en.ordinal(21)).toBe('21st'); expect(en.ordinal(22)).toBe('22nd'); expect(en.ordinal(23)).toBe('23rd'); expect(en.ordinal(24)).toBe('24th'); expect(en.ordinal(25)).toBe('25th');
    expect(fr.ordinal(2)).toBe('2');
    expect(en.meridiem(0)).toBe('AM'); expect(en.meridiem(0, true)).toBe('am'); expect(en.meridiem(12)).toBe('PM'); expect(en.meridiem(12, true)).toBe('pm');
    expect(en.format(new Date(Date.UTC(2024, 0, 2)), 'unknown')).toBeTruthy();
    expect(en.firstDayOfWeek()).toBeGreaterThanOrEqual(0); expect(fr.firstDayOfWeek()).toBeGreaterThanOrEqual(0); expect(en.yearStart?.()).toBeGreaterThanOrEqual(1);
    rs.stubGlobal('Intl', { ...Intl, Locale: class { getWeekInfo() { return { firstDay: 7, minimalDays: 4 }; } } });
    try { expect(createIntlLocaleProvider('en').firstDayOfWeek()).toBe(0); expect(createIntlLocaleProvider('fr').firstDayOfWeek()).toBe(0); expect(createIntlLocaleProvider('en').yearStart?.()).toBe(4); } finally { rs.unstubAllGlobals(); }
  });

  it('covers plugin error handling and omitted option branches', () => {
    const badArray = factory().extend(arraySupport); const oldTemporal = (globalThis as any).Temporal; delete (globalThis as any).Temporal;
    expect(badArray([2024, 0, 1]).isValid()).toBe(false); (globalThis as any).Temporal = oldTemporal;
    const badBigInt = factory().extend(bigIntSupport); delete (globalThis as any).Temporal;
    expect(badBigInt(1n).isValid()).toBe(false); (globalThis as any).Temporal = oldTemporal;
    const badNegative = factory().extend(negativeYear); delete (globalThis as any).Temporal;
    expect(badNegative('-1-01-01').isValid()).toBe(false); (globalThis as any).Temporal = oldTemporal;
    expect(factory().extend(arraySupport)([2024]).format('YYYY-MM-DD')).toBe('2024-01-01');
    const noLocale = factory().extend(advancedFormat); expect(noLocale('2024-01-04').format('Do')).toBe('4th');
    const date = factory().extend(calendar); expect(date('2024-06-10').calendar()).toBeTruthy();
    let negativeParser: any;
    negativeYear(undefined, null as never, null as never, { addParser(parser) { negativeParser = parser; } });
    const brokenTemporal = (globalThis as any).Temporal; (globalThis as any).Temporal = { ZonedDateTime: { from() { throw new Error('broken'); } } };
    try { expect(negativeParser('-1-01-01').valid).toBe(false); } finally { (globalThis as any).Temporal = brokenTemporal; }
    expect(negativeParser(1)).toBeUndefined();
    expect(negativeParser('-bad')).toBeUndefined();
    expect(negativeParser('-1-01-01T01:02:03.0').valid).toBe(true);
  });

  it('covers remaining custom parsing paths and all duration branches', () => {
    const parser = factory().extend(customParseFormat);
    expect(parser(3 as never, 'YYYY').isValid()).toBe(true);
    expect(parser('2024-01-02', '' as never).isValid()).toBe(true);
    expect(parser('2024-1-2', 'YYYY-MM-DD', true).isValid()).toBe(false);
    expect(parser('2024-01-02 03:04', 'YYYY-MM-DD HH:mm', 'en', false).isValid()).toBe(true);
    expect(parser('2024-01-02', '[prefix]YYYY-MM-DD').isValid()).toBe(false);
    expect(parser('2024-01-02', 'YYYY-MM-DD', undefined, undefined).isValid()).toBe(true);
    expect(parser('2024-01-02T03:04:05.07+08:00', 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid()).toBe(true);
    expect(parser('2024-01-02T03:04:05.07+99:99', 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid()).toBe(false);
    expect(parser('2024-01-02T03:04:05.07Z', 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid()).toBe(true);
    expect(parser('2024-01-02T03:04:05.700Z', 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid()).toBe(true);
    expect(parser('2024-99-99', 'YYYY-MM-DD').isValid()).toBe(true);
    let customParser: any;
    customParseFormat(undefined, null as never, null as never, { addParser(handler) { customParser = handler; } });
    const brokenTemporal = (globalThis as any).Temporal; (globalThis as any).Temporal = { ZonedDateTime: { from() { throw new Error('broken'); } } };
    try { expect(customParser('2024-01-02', 'YYYY-MM-DD').valid).toBe(false); } finally { (globalThis as any).Temporal = brokenTemporal; }
    const date = factory().extend(duration) as any;
    const detailed = date.duration({ years: 1, months: 2, weeks: 1, days: 3, hours: 4, minutes: 5, seconds: 6, milliseconds: 7 });
    expect([detailed.years(), detailed.months(), detailed.weeks(), detailed.days(), detailed.hours(), detailed.minutes(), detailed.seconds(), detailed.milliseconds()]).toEqual([1, 2, 62, 3, 4, 5, 6, 7]);
    expect(detailed.format('YYYY-YY-Y MM-M DD-D HH-H mm-m ss-s SSS [fixed]')).toContain('fixed');
    expect(date.isDuration(detailed)).toBe(true);
    expect(date.isDuration({})).toBe(false);
    expect(date.duration(detailed).valueOf()).toBe(detailed.valueOf());
    expect(date.duration(1, 'unknown').milliseconds()).toBe(0);
    expect(date.duration({ seconds: undefined }).milliseconds()).toBe(0);
    expect(date.duration(1).as('unknown')).toBeNaN();
    expect(date.duration(1).get('unknown')).toBe(0);
    expect(date.duration(0).humanize()).toBe('0 seconds');
    expect(date.duration(1000).humanize(true)).toBeTruthy();
    expect(date.duration(60000).humanize()).toBe('1 minute');
    expect(date.duration(3600000).humanize()).toBe('1 hour');
    expect(date.duration(86400000).humanize()).toBe('1 day');
    expect(date.duration(604800000).humanize()).toBe('7 days');
    expect(date.duration(2628000000).humanize()).toBe('1 month');
    expect(date.duration(31536000000).humanize()).toBe('1 year');
    expect(date('2024-01-01').diff('2024-01-01', 'month', true)).toBe(0);
  });

  it('covers locale setup alternatives, formatter literals, and locale patch fallbacks', () => {
    const customProvider = (code: string) => ({ ...createIntlLocaleProvider(code), month: (index: number, short?: boolean) => short ? `s${index}` : `m${index}`, weekday: (index: number, short?: boolean, narrow?: boolean) => narrow ? `n${index}` : short ? `s${index}` : `w${index}` });
    const withString = factory().extend(localeData, 'en') as any;
    expect(withString('2024-01-01').format('[MMMM] MMMM')).toBe('MMMM January');
    withString.extend((_o: unknown, D: Function, f: Function, runtime: any) => localeData(undefined, D, f, runtime));
    expect(withString('2024-01-01').format('MMMM')).toBe('January');
    const custom = factory().extend(localeData, { locale: 'xx', provider: customProvider }).extend(updateLocale) as any;
    expect(custom('2024-01-01').format('MMMM MMM dddd ddd dd')).toBe('m0 s0 w1 s1 n1');
    expect(custom.updateLocale('other', {}).code).toBe('xx');
    expect(custom.updateLocale('xx', { month: (i: number) => `x${i}`, weekday: (i: number) => `y${i}`, firstDayOfWeek: () => 5 }).firstDayOfWeek()).toBe(5);
    expect(custom('2024-01-01').format('MMMM dddd')).toBe('x0 y1');
    expect(() => (factory() as any).extend(updateLocale).updateLocale('en', {})).toThrow('localeData required');
    const arrays = factory().extend(localeData).extend(updateLocale) as any;
    arrays.updateLocale('en', { months: ['jan'], monthsShort: ['j'], weekdays: ['sun'], weekdaysShort: ['s'] });
    expect(arrays('2024-02-04').format('MMMM MMM dddd ddd dd')).toMatch(/February|Feb|Sunday|Sun/);
    const defaults = factory().extend(localeData).extend(updateLocale) as any;
    defaults.updateLocale('en', {}); expect(defaults('2024-01-01').localeData().weekday(1)).toBeTruthy(); expect(defaults('2024-01-01').localeData().firstDayOfWeek()).toBeGreaterThanOrEqual(0);
    const noYearStartProvider = (code: string) => { const { yearStart: _yearStart, ...provider } = createIntlLocaleProvider(code); return provider; };
    const noYearStart = factory().extend(localeData, { locale: 'plain', provider: noYearStartProvider }).extend(updateLocale) as any;
    expect(noYearStart.updateLocale('plain', {}).yearStart).toBeUndefined();
    const standalone = factory().extend(localizedFormat, 'fr');
    expect(standalone('2024-01-02').format('[L] L')).toContain('L');
    expect(factory().extend(localizedFormat)('2024-01-02').format('L')).toBeTruthy();
  });

  it('covers transform no-op/error, token fallback, and every relative time unit', () => {
    const identity = factory().extend(preParsePostFormat, null); expect(identity('2024-01-01').format()).toBeTruthy();
    const invalidTransform = factory().extend(preParsePostFormat, { preparse: () => 'not-a-date' }); expect(invalidTransform('x').isValid()).toBe(false);
    const throwing = factory().extend(preParsePostFormat, { preparse: () => 'changed' }).extend((_o, _D, _f, runtime) => runtime.addParser(() => { throw new Error('bad'); }));
    expect(throwing('x').isValid()).toBe(false);
    const tokens = factory().extend(tokenRegistry) as any; expect(tokens('2024-01-01').format('UNKNOWN')).toBe('UNKNOWN'); tokens.addToken({ token: 'ZED', format: () => 'z' }); tokens.addToken({ token: 'VOID', format: () => undefined }); expect(tokens('2024-01-01').format('ZED VOID')).toBe('z VOID');
    const date = factory().extend(relativeTime) as any; const start = date('2024-01-01');
    expect(start.add(1000, 'millisecond').from(start, true)).toBe('a few seconds');
    for (const [amount, expected] of [[31536000000, 'year'], [2628000000, 'month'], [604800000, 'day'], [86400000, 'day'], [3600000, 'hour'], [60000, 'minute']]) expect(start.add(amount, 'millisecond').from(start, true)).toContain(expected);
    expect(start.from(start, false)).toBeTruthy();
    const localizedRelative = factory().extend(localeData).extend(relativeTime) as any;
    expect(localizedRelative('2024-01-01').locale('fr').from(localizedRelative('2024-01-02'))).toBeTruthy();
    const frenchStart = localizedRelative('2024-01-01').locale('fr');
    expect(frenchStart.from(frenchStart, true)).toBe('0 seconds');
    expect(localizedRelative('2024-01-01T00:00:01').locale('fr').from(frenchStart, true)).toBe('1 second');
    expect(localizedRelative('2024-01-01T00:00:02').locale('fr').from(frenchStart, true)).toBe('2 seconds');
    expect(start.add(89_500, 'millisecond').from(start, true)).toBe('a minute');
  });

  it('covers timezone and UTC factory fallbacks plus malformed offsets', () => {
    const date = factory().extend(timezone).extend(utc) as any;
    expect(date.tz('invalid', 'UTC').isValid()).toBe(false);
    expect(date.tz('2024-01-02', 'YYYY-MM-DD', 'Asia/Shanghai').isValid()).toBe(true);
    expect(date('2024-01-01').tz(undefined).isValid()).toBe(true);
    date.tz.setDefault(undefined); expect(date.tz('2024-01-01').isValid()).toBe(true);
    expect(date('2024-01-01').utcOffset('invalid').isValid()).toBe(false);
    expect(date('2024-01-01').utcOffset(20).format('Z')).toBe('+00:20');
    expect(date.utc('invalid').isValid()).toBe(false);
    expect(date.utc('2024-01-01T00:00:00Z').isUTC()).toBe(true);
    expect(date('2024-01-01T00:00:00').utc(true).isUTC()).toBe(true);
    expect(date('2024-01-01').local().isValid()).toBe(true);
    expect(date('invalid').utcOffset()).toBeNaN();
    expect(date('2024-01-01').utcOffset(-8).utcOffset()).toBe(-480);
    expect(date('2024-01-01').utcOffset('bad-zone', true).isValid()).toBe(false);
    expect(date('2024-01-01').tz('bad-zone', true).isValid()).toBe(false);
    const broken = new Temday({ value: { with() { throw new Error('broken'); } } as never, valid: true, timeZone: 'UTC' }, date as never);
    expect(broken.startOf('year').isValid()).toBe(false);
    const directInvalid = new Temday({ value: null, valid: false, timeZone: 'UTC' }, date as never);
    expect(() => directInvalid.toISOString()).toThrow(RangeError);
    expect(date('2024-01-01').year(2025).month(1).date(2).day(3).hour(4).minute(5).second(6).millisecond(7).isValid()).toBe(true);
  });
});
