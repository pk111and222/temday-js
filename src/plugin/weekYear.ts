import type { Plugin } from '../types.js';

const weekYear: Plugin = (_option, Temday) => {
  Temday.prototype.weekYear = function weekYearValue() {
    const week = this.week(); const month = this.month(); const year = this.year();
    return week === 1 && month === 11 ? year + 1 : month === 0 && week >= 52 ? year - 1 : year;
  };
};
export default weekYear;
declare module '../core/instance.js' { interface Temday { weekYear(): number; } }
