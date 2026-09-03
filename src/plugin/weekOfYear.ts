import type { Plugin } from '../types.js';

const day = 86_400_000;
const week = (value: any): number => {
  const locale = value.localeData?.(); const first = locale?.firstDayOfWeek?.() ?? 0; const start = locale?.yearStart?.() ?? 1;
  const number = (year: number, month: number, date: number): number => {
    const time = Date.UTC(year, month, date); const weekStart = time - ((new Date(time).getUTCDay() - first + 7) % 7) * day;
    if (month === 11 && date > 25 && Date.UTC(year + 1, 0, start) < weekStart + 7 * day) return 1;
    const firstWeek = Date.UTC(year, 0, start); const firstStart = firstWeek - ((new Date(firstWeek).getUTCDay() - first + 7) % 7) * day;
    const result = Math.floor((time - firstStart) / (7 * day)) + 1;
    return result < 1 ? number(year - 1, 11, 31) : result;
  };
  return number(value.year(), value.month(), value.date());
};

const weekOfYear: Plugin = (_option, Temday) => {
  Temday.prototype.week = function weekValue(value?: number) { return value === undefined ? week(this) : this.add((value - week(this)) * 7, 'day'); };
  Temday.prototype.weeksInYear = function weeksInYear() { const last = this.month(11).date(31); return week(last) === 1 ? week(last.subtract(7, 'day')) : week(last); };
};

export default weekOfYear;
declare module '../core/instance.js' { interface Temday { week(): number; week(value: number): this; weeksInYear(): number; } }
