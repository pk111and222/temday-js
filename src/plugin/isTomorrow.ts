import type { Plugin } from '../types.js';
const isTomorrow: Plugin = (_option, Temday, factory) => { Temday.prototype.isTomorrow = function isTomorrowValue() { return this.isSame((factory as any)().add(1, 'day'), 'day'); }; };
export default isTomorrow;
declare module '../core/instance.js' { interface Temday { isTomorrow(): boolean; } }
