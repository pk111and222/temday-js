import type { Plugin } from '../types.js';
const isYesterday: Plugin = (_option, Temday, factory) => { Temday.prototype.isYesterday = function isYesterdayValue() { return this.isSame((factory as any)().subtract(1, 'day'), 'day'); }; };
export default isYesterday;
declare module '../core/instance.js' { interface Temday { isYesterday(): boolean; } }
