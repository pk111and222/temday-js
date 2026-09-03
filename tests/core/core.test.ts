import { describe, expect, it } from '@rstest/core';
import temday from '../../src/index.js';
import { createTemday } from '../../src/context.js';

const utc = createTemday({ timeZone: 'UTC' });

describe('Temporal-native core', () => {
  it('creates calendar values, timestamps, Date values, and invalid values', () => {
    expect(utc('2026-08-31').format()).toBe('2026-08-31T00:00:00+00:00');
    expect(utc(0).toISOString()).toBe('1970-01-01T00:00:00.000Z');
    expect(utc(new Date('2020-01-02T03:04:05Z')).valueOf()).toBe(1577934245000);
    expect(utc('2020-01-02T03:04:05Z').format('Z')).toBe('+00:00');
    expect(utc(null).isValid()).toBe(false);
    expect(utc('').format()).toBe('Invalid Date');
    expect(utc('not a date').valueOf()).toBeNaN();
    expect(() => utc('not a date').toISOString()).toThrow(RangeError);
  });

  it('is immutable and performs calendar-correct arithmetic', () => {
    const original = utc('2024-01-31T10:00:00');
    const changed = original.add(1, 'month');
    expect(original.format('YYYY-MM-DD')).toBe('2024-01-31');
    expect(changed).not.toBe(original);
    expect(original.clone()).not.toBe(original);
    expect(utc('not a date').add(1, 'day').isValid()).toBe(false);
    expect(changed.format('YYYY-MM-DD')).toBe('2024-02-29');
    expect(utc('2024-02-29').add(1, 'year').format('YYYY-MM-DD')).toBe('2025-02-28');
    expect(utc('2024-03-01').subtract(1, 'day').format('YYYY-MM-DD')).toBe('2024-02-29');
    expect(utc().add(Number.NaN, 'day').isValid()).toBe(false);
  });

  it('handles starts, ends, reads, writes, and temday month indexing', () => {
    const value = utc('2024-06-15T13:14:15.123');
    expect(value.startOf('year').format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2024-01-01 00:00:00.000');
    expect(value.startOf('week').format('YYYY-MM-DD')).toBe('2024-06-09');
    expect(value.endOf('month').format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2024-06-30 23:59:59.999');
    expect(value.get('month')).toBe(5);
    expect(value.startOf('hour').format('mm:ss.SSS')).toBe('00:00.000');
    expect(value.month(0).date(31).hour(0).minute(0).second(0).millisecond(0).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2024-01-31 00:00:00.000');
  });

  it('formats the compact core tokens, literals, and offsets', () => {
    const value = utc('2024-08-05T13:04:09.007');
    expect(value.format('YYYY YY M MM D DD H HH h hh m mm s ss SSS Z ZZ A a')).toBe(
      '2024 24 8 08 5 05 13 13 1 01 4 04 9 09 007 +00:00 +0000 PM pm',
    );
    expect(value.format('[Today is] YYYY')).toBe('Today is 2024');
  });

  it('compares and diffs values with integer and floating semantics', () => {
    const a = utc('2024-01-01T00:00:00');
    const b = utc('2024-01-02T12:00:00');
    expect(b.diff(a, 'day')).toBe(1);
    expect(b.diff(a, 'day', true)).toBe(1.5);
    expect(a.diff(b, 'day')).toBe(-1);
    expect(a.isBefore(b)).toBe(true);
    expect(b.isAfter(a, 'day')).toBe(true);
    expect(a.isSame('2024-01-01T23:00:00', 'day')).toBe(true);
    expect(a.isSame('2024-01-01T00:00:00')).toBe(true);
    expect(a.isSame('invalid')).toBe(false);
  });

  it('converts consistently and supports temday static helpers', () => {
    const value = utc('1970-01-01T00:00:01.999');
    expect(value.valueOf()).toBe(1999);
    expect(value.unix()).toBe(1);
    expect(value.toDate().toISOString()).toBe('1970-01-01T00:00:01.999Z');
    expect(utc.unix(-1).valueOf()).toBe(-1000);
    expect(temday.isTemday(value)).toBe(true);
    expect(temday.isTemday({})).toBe(false);
  });

  it('matches the remaining temday core display and day-of-week APIs', () => {
    const value = utc('2024-02-15T12:34:56.789');
    expect(value.day()).toBe(4);
    expect(value.day(0).format('YYYY-MM-DD')).toBe('2024-02-11');
    expect(value.daysInMonth()).toBe(29);
    expect(value.toJSON()).toBe('2024-02-15T12:34:56.789Z');
    expect(value.toString()).toBe('Thu, 15 Feb 2024 12:34:56 GMT');
    expect(utc('invalid').toJSON()).toBeNull();
  });

  it('keeps the default factory small but fully usable', () => {
    expect(temday('2024-01-02T03:04:05Z').isValid()).toBe(true);
    expect(temday.unix(1).valueOf()).toBe(1_000);
    let installs = 0;
    const plugin = () => { installs += 1; };
    expect(temday.extend(plugin).extend(plugin)).toBe(temday);
    expect(installs).toBe(1);
    expect(() => temday.extend(null as unknown as never)).toThrow(TypeError);
  });
});
