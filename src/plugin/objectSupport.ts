import type { DateState, Plugin } from '../types.js';

const invalid = (timeZone: string): DateState => ({ value: null, valid: false, timeZone });
const names: Record<string, string> = { y: 'year', years: 'year', M: 'month', months: 'month', D: 'date', d: 'date', days: 'date', dates: 'date', h: 'hour', hours: 'hour', m: 'minute', minutes: 'minute', s: 'second', seconds: 'second', ms: 'millisecond', milliseconds: 'millisecond' };
const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);
/** Parses temday-style object input without changing the default core parser. */
const objectSupport: Plugin = (_option, Temday, _factory, runtime) => {
  runtime.addParser((input, _format, _locale, _strict, timeZone = 'UTC') => {
    if (!input || typeof input !== 'object' || Array.isArray(input) || input instanceof Date || input instanceof (Temday as any)) return undefined;
    const value = input as Record<string, unknown>;
    if (!Object.keys(value).some((name) => name in names || ['year', 'month', 'date', 'day', 'hour', 'minute', 'second', 'millisecond'].includes(name))) return undefined;
    try {
      const T = (globalThis as any).Temporal; const now = T.Now.zonedDateTimeISO(timeZone);
      const year = Number(value.year ?? value.y ?? value.years ?? now.year); const month = Number(value.month ?? value.M ?? value.months ?? now.month - 1) + 1; const day = Number(value.date ?? value.day ?? value.D ?? value.d ?? value.days ?? value.dates ?? (value.year !== undefined || value.y !== undefined || value.years !== undefined || value.month !== undefined || value.M !== undefined || value.months !== undefined ? 1 : now.day));
      return { value: T.ZonedDateTime.from({ year, month, day, hour: Number(value.hour ?? value.h ?? value.hours ?? 0), minute: Number(value.minute ?? value.m ?? value.minutes ?? 0), second: Number(value.second ?? value.s ?? value.seconds ?? 0), millisecond: Number(value.millisecond ?? value.ms ?? value.milliseconds ?? 0), timeZone }, { overflow: 'reject' }), valid: true, timeZone };
    } catch { return invalid(timeZone); }
  });
  const set = Temday.prototype.set; const add = Temday.prototype.add; const subtract = Temday.prototype.subtract;
  const apply = (self: any, operation: Function, values: Record<string, unknown>, sign = 1) => Object.keys(values).reduce((result, name) => operation.call(result, Number(values[name]) * sign, names[name] ?? name), self);
  Temday.prototype.set = function setValue(this: any, unit: any, amount?: number) { return isObject(unit) ? Object.keys(unit).reduce((result: any, name) => set.call(result, names[name] ?? name, Number(unit[name])), this) : set.call(this, unit, amount); } as any;
  Temday.prototype.add = function addValue(this: any, amount: any, unit?: any) { return isObject(amount) ? apply(this, add, amount) : add.call(this, amount, unit); } as any;
  Temday.prototype.subtract = function subtractValue(this: any, amount: any, unit?: any) { return isObject(amount) ? apply(this, add, amount, -1) : subtract.call(this, amount, unit); } as any;
};
export default objectSupport;
