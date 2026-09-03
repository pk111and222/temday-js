import type { Plugin } from '../types.js';
const isToday: Plugin = (_option, Temday, factory) => { Temday.prototype.isToday = function isTodayValue() { return this.isSame((factory as any)(), 'day'); }; };
export default isToday;
declare module '../core/instance.js' { interface Temday { isToday(): boolean; } }
