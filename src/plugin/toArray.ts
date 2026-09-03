import type { Plugin } from '../types.js';
const toArray: Plugin = (_option, Temday) => { Temday.prototype.toArray = function toArrayValue() { return [this.year(), this.month(), this.date(), this.hour(), this.minute(), this.second(), this.millisecond()]; }; };
export default toArray;
declare module '../core/instance.js' { interface Temday { toArray(): number[]; } }
