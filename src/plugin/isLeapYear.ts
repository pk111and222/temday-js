import type { Plugin } from '../types.js';
const isLeapYear: Plugin = (_option, Temday) => { Temday.prototype.isLeapYear = function isLeapYearValue() { const year = this.year(); return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0; }; };
export default isLeapYear;
declare module '../core/instance.js' { interface Temday { isLeapYear(): boolean; } }
