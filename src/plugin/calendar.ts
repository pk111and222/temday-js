import type { Plugin } from '../types.js';

type CalendarFormat = string | ((value: any) => string);
type CalendarOptions = Partial<Record<'sameDay' | 'nextDay' | 'nextWeek' | 'lastDay' | 'lastWeek' | 'sameElse', CalendarFormat>>;
const defaults: Required<CalendarOptions> = { sameDay: '[Today at] h:mm A', nextDay: '[Tomorrow at] h:mm A', nextWeek: 'dddd [at] h:mm A', lastDay: '[Yesterday at] h:mm A', lastWeek: '[Last] dddd [at] h:mm A', sameElse: 'MM/DD/YYYY' };

/** temday-like calendar labels relative to a supplied date or now. */
const calendar: Plugin = (_option, Temday, factory) => {
  Temday.prototype.calendar = function calendarValue(reference?: unknown, formats?: CalendarOptions) {
    const base = reference == null ? (factory as any)() : (factory as any)(reference); const days = Math.round((this.startOf('day').valueOf() - base.startOf('day').valueOf()) / 864e5);
    const key = days < -6 ? 'sameElse' : days < -1 ? 'lastWeek' : days === -1 ? 'lastDay' : days === 0 ? 'sameDay' : days === 1 ? 'nextDay' : days < 7 ? 'nextWeek' : 'sameElse';
    const value = formats?.[key] ?? defaults[key]; return typeof value === 'function' ? value.call(this, base) : this.format(value);
  };
};

export default calendar;

declare module '../core/instance.js' { interface Temday { calendar(reference?: unknown, formats?: CalendarOptions): string; } }
