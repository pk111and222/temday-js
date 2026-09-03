import { describe, expect, it } from '@rstest/core';
import buddhistEra from '../../src/plugin/buddhistEra.js';
import dayOfYear from '../../src/plugin/dayOfYear.js';
import isLeapYear from '../../src/plugin/isLeapYear.js';
import isToday from '../../src/plugin/isToday.js';
import isTomorrow from '../../src/plugin/isTomorrow.js';
import isYesterday from '../../src/plugin/isYesterday.js';
import negativeYear from '../../src/plugin/negativeYear.js';
import pluralGetSet from '../../src/plugin/pluralGetSet.js';
import { createTemday } from '../../src/context.js';

describe('additional temday compatibility plugins', () => {
  it('adds leap-year, day-of-year, plural get/set, and Buddhist-era formatting', () => {
    const date = createTemday({ timeZone: 'UTC' }).extend(isLeapYear).extend(dayOfYear).extend(pluralGetSet).extend(buddhistEra);
    expect(date('2024-02-29').isLeapYear()).toBe(true);
    expect(date('2023-02-28').isLeapYear()).toBe(false);
    expect(date('2024-12-31').dayOfYear()).toBe(366);
    expect(date('2024-01-01').dayOfYear(60).format('YYYY-MM-DD')).toBe('2024-02-29');
    expect(date('2024-08-31').months()).toBe(7);
    expect(date('2024-08-31').months(0).format('YYYY-MM-DD')).toBe('2024-01-31');
    expect(date('2024-08-31').format('BBBB BB')).toBe('2567 67');
  });

  it('recognises today/tomorrow/yesterday, temday instances, and negative years', () => {
    const date = createTemday({ timeZone: 'UTC' }).extend(isToday).extend(isTomorrow).extend(isYesterday).extend(negativeYear);
    const now = date();
    expect(now.isToday()).toBe(true);
    expect(now.add(1, 'day').isTomorrow()).toBe(true);
    expect(now.subtract(1, 'day').isYesterday()).toBe(true);
    expect(date('-1-01-01').year()).toBe(-1);
  });
});
