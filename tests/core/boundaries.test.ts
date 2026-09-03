import { describe, expect, it } from '@rstest/core';
import { Temporal } from '@js-temporal/polyfill';
import { createTemday } from '../../src/context.js';
import { configure } from '../../src/core/temporal.js';
import { format } from '../../src/core/format.js';
import { parse } from '../../src/core/parse.js';
import { normalizeUnit } from '../../src/core/units.js';

const utc = () => createTemday({ timeZone: 'UTC' });

describe('core boundary matrix', () => {
  it('covers every compact formatter token at both meridiems', () => {
    const morning = Temporal.ZonedDateTime.from('2024-01-02T00:03:04.005+00:00[UTC]');
    expect(format(morning, 'YYYY YY M MM D DD H HH h hh m mm s ss SSS Z ZZ A a')).toBe(
      '2024 24 1 01 2 02 0 00 12 12 3 03 4 04 005 +00:00 +0000 AM am',
    );
    expect(format(Temporal.ZonedDateTime.from('2024-12-31T12:00+00:00[UTC]'), '[literal] A a')).toBe('literal PM pm');
  });

  it('parses every supported Temporal input and rejects unsupported input', () => {
    const now = parse(undefined, 'UTC');
    expect(now.valid).toBe(true);
    const d = utc()('2024-01-02T03:04:05Z');
    expect(parse(d, 'UTC').valid).toBe(true);
    expect(parse(Temporal.Instant.from('2024-01-02T03:04:05Z'), 'UTC').valid).toBe(true);
    expect(parse(Temporal.ZonedDateTime.from('2024-01-02T03:04:05+08:00[Asia/Shanghai]'), 'UTC').value?.timeZoneId).toBe('UTC');
    expect(parse(Temporal.PlainDateTime.from('2024-01-02T03:04:05'), 'UTC').valid).toBe(true);
    expect(parse(Temporal.PlainDate.from('2024-01-02'), 'UTC').valid).toBe(true);
    expect(parse(true, 'UTC').valid).toBe(false);
    expect(parse('2024-01-02T03:04:05+0800', 'UTC').valid).toBe(true);
    expect(parse('2024-01-02T03:04:05', 'UTC').valid).toBe(true);
    expect(parse(new Date(Number.NaN), 'UTC').valid).toBe(false);
  });

  it('normalizes each unit discriminator and rejects unknown units', () => {
    for (const [input, output] of Object.entries({ years: 'year', M: 'month', weeks: 'week', D: 'day', hours: 'hour', minutes: 'minute', milliseconds: 'millisecond', seconds: 'second' })) {
      expect(normalizeUnit(input)).toBe(output);
    }
    expect(normalizeUnit('m')).toBe('minute');
    expect(() => normalizeUnit('fortnight')).toThrow(RangeError);
  });

  it('covers invalid state and calendar branches in instance methods', () => {
    const date = utc(); const invalid = date('invalid'); const value = date('2024-06-12T13:14:15.016');
    expect(invalid.startOf('day')).not.toBe(invalid);
    expect(invalid.set('year', 2025)).not.toBe(invalid);
    expect(invalid.get('year')).toBeNaN();
    expect(invalid.get('day')).toBeNaN();
    expect(value.get('week')).toBeNaN();
    expect(invalid.diff(value)).toBeNaN();
    expect(invalid.isBefore(value)).toBe(false);
    expect(invalid.isAfter(value)).toBe(false);
    expect(value.isBefore('invalid')).toBe(false);
    expect(value.isAfter('invalid')).toBe(false);
    expect(value.startOf('minute').format('ss.SSS')).toBe('00.000');
    expect(value.startOf('second').format('SSS')).toBe('000');
    expect(value.startOf('millisecond').format('SSS')).toBe('016');
    expect(value.endOf('week').format('HH:mm:ss.SSS')).toBe('23:59:59.999');
    expect(value.set('day', 0).day()).toBe(0);
    expect(value.set('unknown', 1).isValid()).toBe(false);
  });

  it('covers month and year diff anchors in both directions', () => {
    const date = utc(); const early = date('2024-01-15'); const late = date('2024-03-20');
    expect(late.diff(early, 'month', true)).toBeGreaterThan(2);
    expect(early.diff(late, 'month', true)).toBeLessThan(-2);
    expect(late.diff(early, 'year', true)).toBeGreaterThan(0);
  });

  it('validates configuration input while leaving configured Temporal usable', () => {
    expect(() => configure({ Temporal: undefined as never })).toThrow(TypeError);
    configure({ Temporal });
    expect(utc()('2024-01-01').isValid()).toBe(true);
  });
});
