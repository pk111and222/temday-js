import { describe, expect, it } from '@rstest/core';
import arraySupport from '../../src/plugin/arraySupport.js';
import bigIntSupport from '../../src/plugin/bigIntSupport.js';
import isBetween from '../../src/plugin/isBetween.js';
import minMax from '../../src/plugin/minMax.js';
import objectSupport from '../../src/plugin/objectSupport.js';
import timezone from '../../src/plugin/timezone.js';
import { createTemday } from '../../src/context.js';

describe('edge behavior scenarios', () => {
  const utc = createTemday({ timeZone: 'UTC' });

  it('keeps invalid values invalid across transformations and makes failure modes explicit', () => {
    const invalid = utc('not-a-date');
    const valid = utc('2026-08-31');

    expect(invalid.clone().isValid()).toBe(false);
    expect(invalid.add(1, 'day').isValid()).toBe(false);
    expect(invalid.startOf('month').isValid()).toBe(false);
    expect(invalid.endOf('month').isValid()).toBe(false);
    expect(invalid.set('month', 0).isValid()).toBe(false);
    expect(invalid.diff(valid)).toBeNaN();
    expect(invalid.isBefore(valid)).toBe(false);
    expect(invalid.isAfter(valid)).toBe(false);
    expect(invalid.isSame(valid)).toBe(false);
    expect(invalid.toJSON()).toBeNull();
    expect(() => invalid.toISOString()).toThrow(RangeError);
  });

  it('distinguishes invalid-returning unit APIs from unit APIs that throw', () => {
    const value = utc('2026-08-31T12:00');

    expect(value.add(1, 'banana').isValid()).toBe(false);
    expect(value.subtract(1, 'banana').isValid()).toBe(false);
    expect(value.set('banana', 1).isValid()).toBe(false);
    expect(() => value.get('banana')).toThrow(RangeError);
    expect(() => value.startOf('banana')).toThrow(RangeError);
    expect(() => value.endOf('banana')).toThrow(RangeError);
    expect(() => value.diff('2026-08-01', 'banana')).toThrow(RangeError);
  });

  it('documents Temporal field-constrain semantics separately from calendar arithmetic', () => {
    const value = utc('2026-08-31T12:00:00.000');

    expect(value.hour(24).hour()).toBe(23);
    expect(value.minute(60).minute()).toBe(59);
    expect(value.second(60).second()).toBe(59);
    expect(value.millisecond(1_000).millisecond()).toBe(999);
    expect(value.month(-1).isValid()).toBe(false);
    expect(value.date(0).isValid()).toBe(false);
    expect(value.add(1, 'month').format('YYYY-MM-DD')).toBe('2026-09-30');
  });

  it('requires opt-in parsing plugins and rejects invalid object, array, and bigint inputs', () => {
    const configured = createTemday({ timeZone: 'UTC' }).extend(objectSupport).extend(arraySupport).extend(bigIntSupport);
    const plain = createTemday({ timeZone: 'UTC' });

    expect(plain({ year: 2026, month: 7, date: 31 }).isValid()).toBe(false);
    expect(plain([2026, 7, 31]).isValid()).toBe(false);
    expect(configured({ year: 2026, month: 7, date: 31 }).format('YYYY-MM-DD')).toBe('2026-08-31');
    expect(configured({ year: 2026, month: 12, date: 1 }).isValid()).toBe(false);
    expect(configured([2026, 7, 31, 23, 59, 59, 999]).format('HH:mm:ss.SSS')).toBe('23:59:59.999');
    expect(configured([2026, 12, 1]).isValid()).toBe(false);
    expect(configured(9_007_199_254_740_992n).isValid()).toBe(false);
  });

  it('preserves instants by default and changes them only for explicit wall-time timezone conversion', () => {
    const date = createTemday({ timeZone: 'UTC' }).extend(timezone) as any;
    const instant = date('2026-08-31T12:00:00Z');
    const viewed = instant.tz('Asia/Shanghai');
    const wallTime = instant.tz('Asia/Shanghai', true);

    expect(viewed.valueOf()).toBe(instant.valueOf());
    expect(viewed.format('HH:mm Z')).toBe('20:00 +08:00');
    expect(wallTime.valueOf()).not.toBe(instant.valueOf());
    expect(wallTime.format('HH:mm Z')).toBe('12:00 +08:00');
    expect(instant.tz('Not/AZone').isValid()).toBe(false);
  });

  it('handles range boundaries and collection inputs without mutating source values', () => {
    const date = createTemday({ timeZone: 'UTC' }).extend(isBetween).extend(minMax) as any;
    const left = date('2026-08-31T00:00:00');
    const right = date('2026-09-01T00:00:00');
    const source = [right, left, date('invalid')];

    expect(left.isBetween(left, right)).toBe(false);
    expect(left.isBetween(left, right, undefined, '[]')).toBe(true);
    expect(right.isBetween(left, right, undefined, '[)')).toBe(false);
    expect(date.min(source).valueOf()).toBe(left.valueOf());
    expect(date.max(source).valueOf()).toBe(right.valueOf());
    expect(source).toHaveLength(3);
    expect(date.min([]).isValid()).toBe(false);
  });
});
