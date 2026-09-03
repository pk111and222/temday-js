import type { CanonicalUnit, Unit } from '../types.js';

export function normalizeUnit(unit: Unit | string): CanonicalUnit {
  switch (unit[0]) {
    case 'y': return 'year'; case 'M': return 'month'; case 'w': return 'week';
    case 'd': case 'D': return 'day'; case 'h': return 'hour'; case 's': return 'second';
    case 'm': return unit[1] === 'o' ? 'month' : unit[1] === 's' || unit.startsWith('milli') ? 'millisecond' : 'minute';
    default: throw new RangeError('unit');
  }
}
