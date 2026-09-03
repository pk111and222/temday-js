import type { Plugin } from '../types.js';

const temporal = () => (globalThis as any).Temporal;
const invalid = (timeZone: string) => ({ value: null, valid: false, timeZone });
const fromEpoch = (Temday: any, factory: Function, milliseconds: number, timeZone: string): any => {
  try { return new Temday({ value: temporal().Instant.fromEpochMilliseconds(milliseconds).toZonedDateTimeISO(timeZone), valid: true, timeZone }, factory); } catch { return new Temday(invalid(timeZone), factory); }
};
const fromWall = (Temday: any, factory: Function, value: any, timeZone: string): any => {
  try { return new Temday({ value: temporal().ZonedDateTime.from({ year: value.year(), month: value.month() + 1, day: value.date(), hour: value.hour(), minute: value.minute(), second: value.second(), millisecond: value.millisecond(), timeZone }), valid: true, timeZone }, factory); } catch { return new Temday(invalid(timeZone), factory); }
};
const hasOffset = (value: unknown): boolean => typeof value === 'string' && /(?:T|\s)\d{1,2}:\d\d(?::\d\d(?:\.\d+)?)?(?:Z|[+-]\d\d:?\d\d)(?:\[[^\]]+])?$/i.test(value);

interface TzFactory {
  (input?: unknown, timeZone?: string): any;
  (input: unknown, format: any, timeZone: string): any;
  guess(): string;
  setDefault(timeZone?: string): void;
}

/** IANA timezone conversion built directly on Temporal.ZonedDateTime. */
const timezone: Plugin = (_option, Temday, factory) => {
  let fallback: string | undefined;
  const at = (milliseconds: number, zone: string) => fromEpoch(Temday, factory, milliseconds, zone);
  Temday.prototype.tz = function tz(timeZone?: string, keepLocalTime = false) {
    const zone = timeZone ?? fallback ?? (globalThis as any).Temporal.Now.timeZoneId();
    return keepLocalTime ? fromWall(Temday, factory, this, zone) : at(this.valueOf(), zone);
  };
  const create = ((input?: unknown, formatOrZone?: any, explicitZone?: string) => {
    const format = explicitZone === undefined ? undefined : formatOrZone;
    const zone = explicitZone ?? formatOrZone ?? fallback ?? (globalThis as any).Temporal.Now.timeZoneId();
    const value = (factory as any)(input, format);
    if (!value.isValid()) return value;
    return hasOffset(input) ? at(value.valueOf(), zone) : fromWall(Temday, factory, value, zone);
  }) as TzFactory;
  create.guess = () => (globalThis as any).Temporal.Now.timeZoneId();
  create.setDefault = (timeZone?: string) => { fallback = timeZone; };
  (factory as any).tz = create;
};

export default timezone;

declare module '../core/instance.js' {
  interface Temday { tz(timeZone?: string, keepLocalTime?: boolean): this; }
}
declare module '../index.js' {
  interface TemdayFactory { tz: TzFactory; }
}
