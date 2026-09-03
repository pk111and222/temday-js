import type { Plugin } from '../types.js';

const thursday = (value: any): Date => { const date = new Date(Date.UTC(value.year(), value.month(), value.date())); date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7)); return date; };
const number = (value: any): number => { const date = thursday(value); const start = Date.UTC(date.getUTCFullYear(), 0, 1); return Math.ceil(((date.valueOf() - start) / 864e5 + 1) / 7); };
const isoWeek: Plugin = (_option, Temday) => {
  Temday.prototype.isoWeekYear = function isoWeekYearValue() { return thursday(this).getUTCFullYear(); };
  Temday.prototype.isoWeek = function isoWeekValue(value?: number) { return value === undefined ? number(this) : this.add((value - number(this)) * 7, 'day'); };
  Temday.prototype.isoWeekday = function isoWeekday(value?: number) { const day = this.get('day') || 7; return value === undefined ? day : this.add(value - day, 'day'); };
  Temday.prototype.isoWeeksInYear = function isoWeeksInYear() { return number(this.month(11).date(28)); };
};
export default isoWeek;
declare module '../core/instance.js' { interface Temday { isoWeekYear(): number; isoWeek(): number; isoWeek(value: number): this; isoWeekday(): number; isoWeekday(value: number): this; isoWeeksInYear(): number; } }
