import type { Plugin } from '../types.js';
const toObject: Plugin = (_option, Temday) => { Temday.prototype.toObject = function toObjectValue() { return { years: this.year(), months: this.month(), date: this.date(), hours: this.hour(), minutes: this.minute(), seconds: this.second(), milliseconds: this.millisecond() }; }; };
export default toObject;
declare module '../core/instance.js' { interface Temday { toObject(): { years: number; months: number; date: number; hours: number; minutes: number; seconds: number; milliseconds: number; }; } }
