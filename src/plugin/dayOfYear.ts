import type { Plugin } from '../types.js';
const dayOfYear: Plugin = (_option, Temday) => { Temday.prototype.dayOfYear = function dayOfYearValue(value?: number) { const current = this.startOf('day').diff(this.startOf('year'), 'day') + 1; return value === undefined ? current : this.add(value - current, 'day'); }; };
export default dayOfYear;
declare module '../core/instance.js' { interface Temday { dayOfYear(): number; dayOfYear(value: number): this; } }
