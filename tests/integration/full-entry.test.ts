import { describe, expect, it, rs } from '@rstest/core';

describe('full entry', () => {
  it('installs the published non-mutating plugin set', async () => {
    rs.resetModules();
    const { default: full } = await import('../../src/full.js');
    const value = full('31/08/2026', 'DD/MM/YYYY');

    expect(value.format('Do Q')).toBe('31st 3');
    expect(value.toArray()).toEqual([2026, 7, 31, 0, 0, 0, 0]);
    expect(value.isBetween('2026-08-01', '2026-09-01')).toBe(true);
    expect(full.duration(1000).humanize()).toBe('1 second');
    expect(full('2026-08-31').add(1, 'day')).not.toBe(value);
  });
});
