import type { Plugin } from '../types.js';
/** Explicit compatibility escape hatch: mutating operations preserve instance identity. */
const badMutable: Plugin = (_option, Temday) => {
  for (const name of ['add', 'subtract', 'startOf', 'endOf', 'set']) {
    const original = Temday.prototype[name]; Temday.prototype[name] = function mutable(this: any, ...args: unknown[]) { return this.$m(original.apply(this, args)); };
  }
  const clone = Temday.prototype.clone; Temday.prototype.clone = function mutableClone(this: any) { clone.call(this); return this; };
};
export default badMutable;
