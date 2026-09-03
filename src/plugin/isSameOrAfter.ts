import type { Plugin, Unit } from '../types.js';
const isSameOrAfter: Plugin = (_option, Temday) => { Temday.prototype.isSameOrAfter = function isSameOrAfter(value: unknown, unit?: Unit | string) { return this.isSame(value, unit) || this.isAfter(value, unit); }; };
export default isSameOrAfter;
declare module '../core/instance.js' { interface Temday { isSameOrAfter(value: unknown, unit?: Unit | string): boolean; } }
