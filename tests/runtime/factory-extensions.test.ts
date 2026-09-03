import { describe, expect, it } from '@rstest/core';
import type { Plugin } from '../../src/index.js';
import { createTemday } from '../../src/context.js';

describe('runtime and plugin contracts', () => {
  it('isolates time-zone runtimes', () => {
    const cn = createTemday({ timeZone: 'Asia/Shanghai' });
    const en = createTemday({ timeZone: 'UTC' });
    expect(cn('2024-01-01T00:00:00').format('Z')).toBe('+08:00');
    expect(en('2024-01-01T00:00:00').format('Z')).toBe('+00:00');
  });

  it('installs each plugin only once and isolates prototype extensions', () => {
    let calls = 0;
    const plugin: Plugin = (_option, Temday, factory) => {
      calls += 1;
      (Temday.prototype as Record<string, unknown>).stamp = function stamp(this: { format: (pattern: string) => string }) { return this.format('YYYY'); };
      (factory as unknown as Record<string, unknown>).answer = 42;
    };
    const first = createTemday({ timeZone: 'UTC' });
    const second = createTemday({ timeZone: 'UTC' });
    first.extend(plugin).extend(plugin);
    expect(calls).toBe(1);
    expect((first('2024-01-01') as unknown as { stamp: () => string }).stamp()).toBe('2024');
    expect((first as unknown as { answer: number }).answer).toBe(42);
    expect('stamp' in second('2024-01-01')).toBe(false);
  });

});
