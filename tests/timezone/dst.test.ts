import { describe, expect, it } from '@rstest/core';
import { createTemday } from '../../src/context.js';

describe('Temporal time-zone semantics', () => {
  const newYork = createTemday({ timeZone: 'America/New_York' });

  it('skips the missing spring-forward hour and preserves the instant', () => {
    const before = newYork('2024-03-10T01:30:00');
    const after = before.add(1, 'hour');
    expect(before.format('YYYY-MM-DD HH:mm Z')).toBe('2024-03-10 01:30 -05:00');
    expect(after.format('YYYY-MM-DD HH:mm Z')).toBe('2024-03-10 03:30 -04:00');
    expect(after.diff(before, 'hour')).toBe(1);
  });

  it('uses calendar days across a DST boundary', () => {
    const before = newYork('2024-03-09T12:00:00');
    const after = before.add(1, 'day');
    expect(after.format('YYYY-MM-DD HH:mm Z')).toBe('2024-03-10 12:00 -04:00');
    expect(after.valueOf() - before.valueOf()).toBe(23 * 60 * 60 * 1000);
  });
});
