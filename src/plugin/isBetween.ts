import type { Plugin, Unit } from '../types.js';

/** Inclusive/exclusive range comparison compatible with temday `isBetween`. */
const isBetween: Plugin = (_option, Temday, factory) => {
  Temday.prototype.isBetween = function isBetween(left: unknown, right: unknown, unit?: Unit | string, inclusivity = '()') {
    const a = (factory as any)(left); const b = (factory as any)(right); if (!this.isValid() || !a.isValid() || !b.isValid()) return false;
    const start = inclusivity[0] === '[' ? (value: any, edge: any) => !value.isBefore(edge, unit) : (value: any, edge: any) => value.isAfter(edge, unit);
    const end = inclusivity[1] === ']' ? (value: any, edge: any) => !value.isAfter(edge, unit) : (value: any, edge: any) => value.isBefore(edge, unit);
    return start(this, a) && end(this, b) || start(this, b) && end(this, a);
  };
};
export default isBetween;
declare module '../core/instance.js' { interface Temday { isBetween(left: unknown, right: unknown, unit?: Unit | string, inclusivity?: string): boolean; } }
