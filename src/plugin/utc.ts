import type { Plugin } from '../types.js';
import type { Temday as TemdayInstance } from '../core/instance.js';

const temporal = () => (globalThis as any).Temporal;
const invalid = (timeZone: string) => ({ value: null, valid: false, timeZone });
const fromEpoch = (Temday: any, factory: Function, milliseconds: number, timeZone: string, utc = false): any => {
  try { const result = new Temday({ value: temporal().Instant.fromEpochMilliseconds(milliseconds).toZonedDateTimeISO(timeZone), valid: true, timeZone }, factory); if (utc) result.$u = 1; return result; } catch { return new Temday(invalid(timeZone), factory); }
};
const fromWall = (Temday: any, factory: Function, value: any, timeZone: string, utc = false): any => {
  try { const result = new Temday({ value: temporal().ZonedDateTime.from({ year: value.year(), month: value.month() + 1, day: value.date(), hour: value.hour(), minute: value.minute(), second: value.second(), millisecond: value.millisecond(), timeZone }), valid: true, timeZone }, factory); if (utc) result.$u = 1; return result; } catch { return new Temday(invalid(timeZone), factory); }
};
const offset = (value: any): number => { const match = /([+-])(\d\d):?(\d\d)$/.exec(value.format('Z')); return match ? (+match[2]! * 60 + +match[3]!) * (match[1] === '-' ? -1 : 1) : Number.NaN; };
const offsetZone = (value: number | string): string => {
  if (typeof value === 'string') return value === 'Z' ? '+00:00' : /^[+-]\d\d:?\d\d$/.test(value) ? `${value.slice(0, 3)}:${value.slice(-2)}` : value;
  const minutes = Math.abs(Math.abs(value) <= 16 ? value * 60 : value); const sign = value < 0 ? '-' : '+';
  return `${sign}${String(Math.trunc(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
};
const hasOffset = (value: unknown): boolean => typeof value === 'string' && /(?:T|\s)\d{1,2}:\d\d(?::\d\d(?:\.\d+)?)?(?:Z|[+-]\d\d:?\d\d)(?:\[[^\]]+])?$/i.test(value);

/** temday-compatible UTC view and fixed-offset operations. */
const utc: Plugin = (_option, Temday, factory) => {
  const format = Temday.prototype.format;
  Temday.prototype.format = function formatUtc(pattern?: string) { return format.call(this, (this as any).$u ? (pattern ? pattern.replace(/Z/g, '[Z]') : 'YYYY-MM-DDTHH:mm:ss[Z]') : pattern); };
  const at = (milliseconds: number, zone: string, utc = false) => fromEpoch(Temday, factory, milliseconds, zone, utc);
  Temday.prototype.utc = function utcValue(keepLocalTime = false) { return keepLocalTime ? fromWall(Temday, factory, this, 'UTC', true) : at(this.valueOf(), 'UTC', true); };
  Temday.prototype.local = function localValue() { return at(this.valueOf(), (globalThis as any).Temporal.Now.timeZoneId()); };
  Temday.prototype.isUTC = function isUTC() { return !!(this as any).$u; };
  Temday.prototype.utcOffset = function utcOffset(value?: number | string, keepLocalTime = false) {
    if (value === undefined) return offset(this);
    const zone = offsetZone(value); return keepLocalTime ? fromWall(Temday, factory, this, zone) : at(this.valueOf(), zone);
  };
  (factory as any).utc = (input?: unknown, format?: any, locale?: any, strict?: boolean) => {
    const value = (factory as any)(input, format, locale, strict);
    return value.isValid() ? hasOffset(input) ? at(value.valueOf(), 'UTC', true) : fromWall(Temday, factory, value, 'UTC', true) : value;
  };
};

export default utc;

declare module '../core/instance.js' {
  interface Temday {
    utc(keepLocalTime?: boolean): this;
    local(): this;
    isUTC(): boolean;
    utcOffset(): number;
    utcOffset(value: number | string, keepLocalTime?: boolean): this;
  }
}
declare module '../index.js' {
  interface TemdayFactory { utc(input?: unknown, format?: any, locale?: any, strict?: boolean): TemdayInstance; }
}
