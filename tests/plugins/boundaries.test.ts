import { describe, expect, it } from '@rstest/core';
import { createTemday } from '../../src/context.js';
import advancedFormat from '../../src/plugin/advancedFormat.js';
import arraySupport from '../../src/plugin/arraySupport.js';
import bigIntSupport from '../../src/plugin/bigIntSupport.js';
import buddhistEra from '../../src/plugin/buddhistEra.js';
import calendar from '../../src/plugin/calendar.js';
import customParseFormat from '../../src/plugin/customParseFormat.js';
import duration from '../../src/plugin/duration.js';
import isoWeek from '../../src/plugin/isoWeek.js';
import localeData from '../../src/plugin/localeData.js';
import localizedFormat from '../../src/plugin/localizedFormat.js';
import negativeYear from '../../src/plugin/negativeYear.js';
import objectSupport from '../../src/plugin/objectSupport.js';
import preParsePostFormat from '../../src/plugin/preParsePostFormat.js';
import relativeTime from '../../src/plugin/relativeTime.js';
import timezone from '../../src/plugin/timezone.js';
import tokenRegistry from '../../src/plugin/tokenRegistry.js';
import updateLocale from '../../src/plugin/updateLocale.js';
import weekOfYear from '../../src/plugin/weekOfYear.js';
import utc from '../../src/plugin/utc.js';
import weekYear from '../../src/plugin/weekYear.js';

const factory = () => createTemday({ timeZone: 'UTC' });

describe('plugin boundary matrix', () => {
  it('handles advanced tokens with native and injected locale data', () => {
    const plain = factory().extend(advancedFormat); const value = plain('2024-01-02T00:00:00.123');
    expect(value.format('Do Q k kk X x [kept]')).toBe('2nd 1 24 24 1704153600 1704153600123 kept');
    const local = factory().extend(localeData).extend(advancedFormat);
    expect(local('2024-01-01').format('Do')).toBe('1st');
  });

  it('supports parser plugin success, rejection, and unsupported input paths', () => {
    const date = factory().extend(arraySupport).extend(bigIntSupport).extend(objectSupport).extend(negativeYear);
    expect(date([2024, 1, 3, 4, 5, 6, 7]).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2024-02-03 04:05:06.007');
    expect(date([2024, 13]).isValid()).toBe(false);
    expect(date(1n).valueOf()).toBe(1);
    expect(date(BigInt(Number.MAX_SAFE_INTEGER) + 1n).isValid()).toBe(false);
    expect(date({ y: 2024, M: 1, D: 3, h: 4, m: 5, s: 6, ms: 7 }).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2024-02-03 04:05:06.007');
    expect(date({ year: 2024, month: 1, date: 3, hour: 4, minute: 5, second: 6, millisecond: 7 }).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2024-02-03 04:05:06.007');
    expect(date({ year: 2024 }).format('YYYY-MM-DD')).toMatch(/^2024-/);
    expect(date({ month: 0 }).isValid()).toBe(true);
    expect(date({}).isValid()).toBe(false);
    expect(date({ year: 2024, month: 99 }).isValid()).toBe(false);
    expect(date('-1-01-02T03:04:05.6').format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('00-1-01-02 03:04:05.600');
    expect(date('-1-13-02').isValid()).toBe(false);
    expect(date('2024-01-01').set('year', 2025).year()).toBe(2025);
    expect(date('2024-01-01').add(1, 'day').format('D')).toBe('2');
    expect(date('2024-01-02').subtract(1, 'day').format('D')).toBe('1');
    expect((date('2024-01-01') as any).add({ days: 2 }).format('D')).toBe('3');
    expect((date('2024-01-01') as any).add({ date: 1 }).format('D')).toBe('2');
    expect((date('2024-01-03') as any).subtract({ days: 2 }).format('D')).toBe('1');
  });

  it('covers strict, loose, alternate and offset custom format parsing', () => {
    const date = factory().extend(customParseFormat);
    expect(date('2024-2-3 4:5:6.7 pm', 'YYYY-M-D H:m:s.SSS a').format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2024-02-03 16:05:06.700');
    expect(date('69/01/02 12:03 AM +0800', 'YY/MM/DD hh:mm A ZZ').toISOString()).toBe('1969-01-01T16:03:00.000Z');
    expect(date('68-01-02T12:03:04Z', 'YY-MM-DDTHH:mm:ssZ').year()).toBe(2068);
    expect(date('2024-2-3', 'YYYY-MM-DD', true).isValid()).toBe(false);
    expect(date('2024-2-3', 'YYYY-MM-DD').isValid()).toBe(false);
    expect(date('03.02.2024', ['YYYY-MM-DD', 'DD.MM.YYYY'], true).format('YYYY-MM-DD')).toBe('2024-02-03');
    expect(date('bad', 'YYYY').isValid()).toBe(false);
  });

  it('covers duration units, ISO forms, arithmetic, output, and invalid input', () => {
    const date = factory().extend(duration) as any;
    expect(date.duration(2, 'ms').milliseconds()).toBe(2);
    expect(date.duration(2, 'millisecond').milliseconds()).toBe(2);
    expect(date.duration(1, 'm').as('second')).toBe(60);
    expect(date.duration('P1Y2M3W4DT5H6M7.5S').milliseconds()).toBeGreaterThan(0);
    expect(date.duration('-PT1.5S').milliseconds()).toBe(-500);
    expect(date.duration('garbage').milliseconds()).toBe(0);
    expect(date.duration({ years: 1, months: 2, weeks: 3, days: 4, hours: 5, minutes: 6, seconds: 7, milliseconds: 8, unknown: 9 }).milliseconds()).toBeGreaterThan(0);
    const value = date.duration('P1Y2M3W4DT5H6M7.5S');
    for (const unit of ['year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond']) expect(Number.isFinite(value.get(unit))).toBe(true);
    expect(value.add(1, 'day').subtract('PT24H').milliseconds()).toBe(value.milliseconds());
    expect(date.duration(0).toISOString()).toBe('P0D');
    expect(date.duration(86400000).toISOString()).toBe('P1D');
    expect(date.duration(3661000).toISOString()).toBe('PT1H1M1S');
    expect(date.duration(-1000).toJSON()).toBe('-PT1S');
    expect(date.duration(1000).humanize()).toBe('1 second');
    expect(date.duration(2000).humanize()).toBe('2 seconds');
    expect(date.duration(-86400000).humanize(true)).toContain('yesterday');
    const aliases = date.duration({ year: 1, month: 2, week: 3, day: 4, hour: 5, minute: 6, second: 7, millisecond: 8 });
    expect([aliases.asMilliseconds(), aliases.asSeconds(), aliases.asMinutes(), aliases.asHours(), aliases.asDays(), aliases.asWeeks(), aliases.asMonths(), aliases.asYears()]).toHaveLength(8);
    expect(date('2024-01-01').add(aliases).isValid()).toBe(true);
    expect(date('2026-01-01').subtract(aliases).isValid()).toBe(true);
  });

  it('selects every calendar bucket and custom function format', () => {
    const date = factory().extend(calendar); const reference = '2024-06-10T12:00:00';
    expect(date('2024-06-01').calendar(reference)).toBe('06/01/2024');
    expect(date('2024-06-05').calendar(reference)).toContain('Last');
    expect(date('2024-06-09').calendar(reference)).toContain('Yesterday');
    expect(date('2024-06-10').calendar(reference)).toContain('Today');
    expect(date('2024-06-11').calendar(reference)).toContain('Tomorrow');
    expect(date('2024-06-12').calendar(reference)).toContain('at');
    expect(date('2024-06-20').calendar(reference)).toBe('06/20/2024');
    expect(date('2024-06-10').calendar(reference, { sameDay(base) { return `base:${base.format('D')}`; } })).toBe('base:10');
  });

  it('covers locale data, localized aliases, locale overrides, and update fallbacks', () => {
    const date = factory().extend(localeData).extend(localizedFormat).extend(updateLocale) as any;
    const value = date('2024-02-04T13:14:15');
    expect(value.format('MMMM MMM dddd ddd dd')).toMatch(/February|Feb/);
    expect(value.format('L LT LTS LL LLL LLLL')).toContain('2024');
    expect(value.locale()).toBe('en');
    expect(value.locale('fr').locale()).toBe('fr');
    expect(date.locale('fr')).toBe('fr');
    expect(date.updateLocale('fr', { months: ['jan', 'feb'], monthsShort: ['j', 'f'], weekdays: ['sun'], weekdaysShort: ['s'], weekStart: 2 }).month(1)).toBe('feb');
    expect(value.locale('fr').format('MMMM MMM dddd ddd')).toContain('feb');
    expect(value.localeData().firstDayOfWeek()).toBeGreaterThanOrEqual(0);
  });

  it('covers ISO weeks, week-year edges and Buddhist format literals', () => {
    const date = factory().extend(isoWeek).extend(weekOfYear).extend(weekYear).extend(buddhistEra);
    const sunday = date('2024-01-07');
    expect(sunday.isoWeekday()).toBe(7);
    expect(sunday.isoWeekday(1).format('YYYY-MM-DD')).toBe('2024-01-01');
    expect(sunday.isoWeek()).toBe(1);
    expect(sunday.isoWeek(2).format('YYYY-MM-DD')).toBe('2024-01-14');
    expect(sunday.isoWeeksInYear()).toBeGreaterThanOrEqual(52);
    for (let year = 2000; year < 2030; year += 1) {
      expect(Number.isFinite(date(`${year}-01-01`).weekYear())).toBe(true);
      expect(Number.isFinite(date(`${year}-12-31`).weekYear())).toBe(true);
    }
    expect(date('2024-01-01').format('[BBBB] BBBB BB')).toBe('BBBB 2567 67');
  });

  it('covers pre/post parser transformations, token fallbacks and relative time paths', () => {
    const date = factory().extend(preParsePostFormat, { preparse: (v: string) => v.replace('x', '2024-01-02'), postformat: (v: string) => `#${v}` }).extend(tokenRegistry).extend(relativeTime) as any;
    expect(date('x').format('YYYY')).toBe('#2024');
    expect(date('2024-01-02').format('YYYY')).toBe('#2024');
    date.addToken({ token: 'QQ', format: () => 'token' });
    date.addToken({ token: 'Q', format: () => 'short' });
    expect(date('2024-01-02').format('QQ Q [QQ]')).toBe('#token short QQ');
    const base = date('2024-01-01'); const future = date('2024-01-01T00:00:02');
    expect(future.from(base, true)).toBe('a few seconds');
    expect(base.to(future, true)).toBe('a few seconds');
    expect(future.fromNow(true)).toBeTruthy();
    expect(base.toNow(true)).toBeTruthy();
  });

  it('covers UTC and timezone offset modes, invalid conversion and factory defaults', () => {
    const date = factory().extend(utc).extend(timezone) as any; const input = date('2024-01-02T03:04:05');
    expect(input.utc().isUTC()).toBe(true);
    expect(input.local().isValid()).toBe(true);
    expect(input.utcOffset()).toBe(0);
    expect(input.utcOffset(8).format('Z')).toBe('+08:00');
    expect(input.utcOffset(-330).format('Z')).toBe('-05:30');
    expect(input.utcOffset('Z').format('Z')).toBe('+00:00');
    expect(input.utcOffset('+0530', true).format('HH:mm')).toBe('03:04');
    expect(date.utc('2024-01-02T03:04:05+08:00').format('Z')).toBe('Z');
    expect(date.utc('2024-01-02T03:04:05').format('Z')).toBe('Z');
    date.tz.setDefault('Asia/Tokyo');
    expect(date.tz('2024-01-02T03:04:05').format('Z')).toBe('+09:00');
    expect(date.tz('2024-01-02T03:04:05Z', 'Asia/Shanghai').format('Z')).toBe('+08:00');
    expect(date.tz.guess()).toBeTruthy();
    expect(input.tz('bad-zone').isValid()).toBe(false);
  });
});
