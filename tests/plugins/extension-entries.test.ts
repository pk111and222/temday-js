import { describe, expect, it } from '@rstest/core';
import arraySupport from '../../src/plugin/arraySupport.js';
import badMutable from '../../src/plugin/badMutable.js';
import bigIntSupport from '../../src/plugin/bigIntSupport.js';
import isBetween from '../../src/plugin/isBetween.js';
import isSameOrAfter from '../../src/plugin/isSameOrAfter.js';
import isSameOrBefore from '../../src/plugin/isSameOrBefore.js';
import localeData from '../../src/plugin/localeData.js';
import minMax from '../../src/plugin/minMax.js';
import objectSupport from '../../src/plugin/objectSupport.js';
import preParsePostFormat from '../../src/plugin/preParsePostFormat.js';
import toArray from '../../src/plugin/toArray.js';
import toObject from '../../src/plugin/toObject.js';
import updateLocale from '../../src/plugin/updateLocale.js';
import weekOfYear from '../../src/plugin/weekOfYear.js';
import weekYear from '../../src/plugin/weekYear.js';
import weekday from '../../src/plugin/weekday.js';
import { createTemday } from '../../src/context.js';

describe('compatibility and projection plugins', () => {
  it('adds temday range comparisons, weekday, and week-year APIs', () => {
    const date = createTemday({ timeZone: 'UTC' }).extend(isBetween).extend(isSameOrAfter).extend(isSameOrBefore).extend(weekday).extend(weekOfYear).extend(weekYear);
    const value = date('2026-08-31');
    expect(value.isBetween('2026-08-31', '2026-09-01')).toBe(false);
    expect(value.isBetween('2026-08-31', '2026-09-01', undefined, '[]')).toBe(true);
    expect(value.isBetween('2026-09-01', '2026-08-31', undefined, '[)')).toBe(true);
    expect(value.isBetween('bad', '2026-09-01')).toBe(false);
    expect(value.isSameOrAfter('2026-08-31')).toBe(true);
    expect(value.isSameOrAfter('2026-09-01')).toBe(false);
    expect(value.isSameOrBefore('2026-08-31')).toBe(true);
    expect(value.isSameOrBefore('2026-08-30')).toBe(false);
    expect(value.weekday()).toBe(1);
    expect(value.weekday(0).format('YYYY-MM-DD')).toBe('2026-08-30');
    expect(date('2026-08-31').weekYear()).toBe(2026);
    expect(date('2018-12-30').week()).toBe(1);
    expect(date('2018-12-30').weekYear()).toBe(2019);
    expect(date('2020-12-31').weekYear()).toBe(2021);
  });

  it('keeps locale week rules isolated between factories', () => {
    const us = createTemday({ timeZone: 'UTC' }).extend(localeData, { locale: 'en' }).extend(updateLocale).extend(weekOfYear).extend(weekYear);
    const international = createTemday({ timeZone: 'UTC' }).extend(localeData, { locale: 'en' }).extend(updateLocale).extend(weekOfYear).extend(weekYear);
    us.updateLocale('en', { weekStart: 0, yearStart: 1 });
    international.updateLocale('en', { weekStart: 1, yearStart: 4 });
    expect(us('2021-01-01').weekYear()).toBe(2021);
    expect(international('2021-01-01').week()).toBe(53);
    expect(international('2021-01-01').weekYear()).toBe(2020);
  });

  it('accepts object, array, and safe bigint input only after explicit plugins', () => {
    const date = createTemday({ timeZone: 'UTC' }).extend(objectSupport).extend(arraySupport).extend(bigIntSupport);
    expect(date({ year: 2026, month: 7, date: 31, hour: 12 }).format('YYYY-MM-DD HH')).toBe('2026-08-31 12');
    expect(date([2026, 7, 31, 12]).format('YYYY-MM-DD HH')).toBe('2026-08-31 12');
    expect(date(1_000n).valueOf()).toBe(1_000);
    expect((date as any).unix(1n).valueOf()).toBe(1_000);
    expect(date.unix(1).valueOf()).toBe(1_000);
    expect((date as any)('2026-08-31').set({ years: 2027, months: 0 }).format('YYYY-MM-DD')).toBe('2027-01-31');
    expect((date as any)('2026-08-31').add({ days: 1 }).format('YYYY-MM-DD')).toBe('2026-09-01');
    expect((date as any)('2026-08-31').subtract({ days: 1 }).format('YYYY-MM-DD')).toBe('2026-08-30');
    expect(date('2026-08-31').set('year', 2027).format('YYYY-MM-DD')).toBe('2027-08-31');
    expect((date as any)('2026-08-31').set({ unknown: 1 }).isValid()).toBe(false);
    expect(date({ hour: 12 }).hour()).toBe(12);
    expect(date(9_007_199_254_740_992n).isValid()).toBe(false);
    expect(date({ year: 2026, month: 15, day: 1 }).isValid()).toBe(false);
    expect(date('2026-08-31').isValid()).toBe(true);
  });

  it('provides min/max, array/object projection, and locale patching', () => {
    const date = createTemday({ timeZone: 'UTC' }).extend(localeData, { locale: 'en' }).extend(minMax).extend(toArray).extend(toObject).extend(updateLocale);
    expect(date.min('2026-08-31', '2026-08-30').format('YYYY-MM-DD')).toBe('2026-08-30');
    expect(date.max([date('2026-08-31'), date('2026-09-01')]).format('YYYY-MM-DD')).toBe('2026-09-01');
    expect(date('2026-08-31T12:34:56.789').toArray()).toEqual([2026, 7, 31, 12, 34, 56, 789]);
    expect(date('2026-08-31T12:34:56.789').toObject()).toMatchObject({ years: 2026, months: 7, date: 31, hours: 12, milliseconds: 789 });
    date.updateLocale('en', { months: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'AUG', 'S', 'O', 'N', 'D'] });
    expect(date('2026-08-31').format('MMMM')).toBe('AUG');
    date.updateLocale('en', { weekdays: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'], weekStart: 1 });
    expect(date('2026-08-31').format('dddd')).toBe('MON');
  });

  it('runs pre/post transforms and supports explicit mutability', () => {
    const transformed = createTemday({ timeZone: 'UTC' }).extend(preParsePostFormat, { preparse: (value: string) => value.replaceAll('/', '-'), postformat: (value: string) => `@${value}` });
    expect(transformed('2026/08/31').format('YYYY-MM-DD')).toBe('@2026-08-31');
    expect(transformed('2026-08-31').format('YYYY')).toBe('@2026');
    const mutable = createTemday({ timeZone: 'UTC' }).extend(badMutable); const value = mutable('2026-08-31');
    expect(value.add(1, 'day')).toBe(value);
    expect(value.format('YYYY-MM-DD')).toBe('2026-09-01');
    expect(value.month(0)).toBe(value);
    expect(value.format('YYYY-MM-DD')).toBe('2026-01-01');
    expect(value.clone()).toBe(value);
  });
});
