import type { Plugin, Unit } from '../types.js';
const isSameOrBefore: Plugin = (_option, Temday) => { Temday.prototype.isSameOrBefore = function isSameOrBefore(value: unknown, unit?: Unit | string) { return this.isSame(value, unit) || this.isBefore(value, unit); }; };
export default isSameOrBefore;
declare module '../core/instance.js' { interface Temday { isSameOrBefore(value: unknown, unit?: Unit | string): boolean; } }
