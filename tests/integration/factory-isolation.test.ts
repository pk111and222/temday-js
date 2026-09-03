import { describe, expect, it } from '@rstest/core';
import customParseFormat from '../../src/plugin/customParseFormat.js';
import localeData from '../../src/plugin/localeData.js';
import relativeTime from '../../src/plugin/relativeTime.js';
import timezone from '../../src/plugin/timezone.js';
import badMutable from '../../src/plugin/badMutable.js';
import type { Plugin } from '../../src/index.js';
import { createTemday } from '../../src/context.js';

describe('factory isolation scenarios', () => {
  it('keeps wall-clock parsing, plugin state, and static state local to each factory', () => {
    const utc = createTemday({ timeZone: 'UTC' }).extend(customParseFormat).extend(localeData, { locale: 'en-US' });
    const shanghai = createTemday({ timeZone: 'Asia/Shanghai' }).extend(localeData, { locale: 'zh-CN' });
    const plain = createTemday({ timeZone: 'UTC' });

    expect(utc('2026-08-31T12:00').format('Z')).toBe('+00:00');
    expect(shanghai('2026-08-31T12:00').format('Z')).toBe('+08:00');
    expect(utc('31/08/2026', 'DD/MM/YYYY').isValid()).toBe(true);
    expect(plain('31/08/2026', 'DD/MM/YYYY').isValid()).toBe(false);
    expect(utc('2026-08-31').format('MMMM')).toContain('August');
    expect(shanghai('2026-08-31').format('MMMM')).toContain('月');

    utc.locale('fr-FR');
    expect(utc.locale()).toBe('fr-FR');
    expect(shanghai.locale()).toBe('zh-CN');
    expect((plain as any).locale).toBeUndefined();
  });

  it('installs the same plugin once per factory, while allowing independent installation elsewhere', () => {
    let calls = 0;
    const plugin: Plugin = (_option, Temday, factory) => {
      calls += 1;
      (Temday.prototype as any).factoryId = () => (factory as any).id;
    };
    const first = createTemday({ timeZone: 'UTC' }) as any;
    const second = createTemday({ timeZone: 'UTC' }) as any;
    first.id = 'first';
    second.id = 'second';

    first.extend(plugin).extend(plugin);
    second.extend(plugin);

    expect(calls).toBe(2);
    expect(first('2026-08-31').factoryId()).toBe('first');
    expect(second('2026-08-31').factoryId()).toBe('second');
  });

  it('does not leak prototype extensions or mutation behavior between concurrent contexts', () => {
    const mutable = createTemday({ timeZone: 'UTC' }).extend(badMutable).extend(relativeTime);
    const immutable = createTemday({ timeZone: 'UTC' });
    const mutableValue = mutable('2026-08-31');
    const immutableValue = immutable('2026-08-31');

    expect(mutableValue.add(1, 'day')).toBe(mutableValue);
    expect(mutableValue.format('YYYY-MM-DD')).toBe('2026-09-01');
    expect(immutableValue.add(1, 'day')).not.toBe(immutableValue);
    expect(immutableValue.format('YYYY-MM-DD')).toBe('2026-08-31');
    expect(typeof (mutableValue as any).fromNow).toBe('function');
    expect((immutableValue as any).fromNow).toBeUndefined();
  });

  it('keeps timezone plugin defaults and conversion state isolated across factories', () => {
    const asia = createTemday({ timeZone: 'UTC' }).extend(timezone) as any;
    const utc = createTemday({ timeZone: 'UTC' }).extend(timezone) as any;
    asia.tz.setDefault('Asia/Shanghai');
    utc.tz.setDefault('UTC');

    expect(asia.tz('2026-08-31T12:00').format('Z')).toBe('+08:00');
    expect(utc.tz('2026-08-31T12:00').format('Z')).toBe('+00:00');
    expect(asia('2026-08-31T12:00:00Z').tz('UTC').valueOf()).toBe(utc('2026-08-31T12:00:00Z').valueOf());
  });
});
