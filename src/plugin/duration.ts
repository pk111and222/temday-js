import type { Plugin, Unit } from '../types.js';

type DurationInput = number | string | Partial<Record<string, number>> | Duration;
type Part = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
type Parts = Record<`${Part}s`, number>;

const size: Record<`${Part}s`, number> = { milliseconds: 1, seconds: 1e3, minutes: 6e4, hours: 36e5, days: 864e5, weeks: 6048e5, months: 2628e6, years: 31536e6 };
const aliases: Record<string, `${Part}s`> = { ms: 'milliseconds', millisecond: 'milliseconds', s: 'seconds', second: 'seconds', m: 'minutes', minute: 'minutes', h: 'hours', hour: 'hours', d: 'days', day: 'days', w: 'weeks', week: 'weeks', M: 'months', month: 'months', y: 'years', year: 'years' };
const name = (unit: string = 'millisecond'): `${Part}s` => aliases[unit] ?? `${unit.replace(/s$/, '')}s` as `${Part}s`;
const zero = (): Parts => ({ years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
const total = (parts: Parts): number => (Object.keys(parts) as (keyof Parts)[]).reduce((value, key) => value + parts[key] * size[key], 0);
const trunc = (value: number): number => value < 0 ? Math.ceil(value) : Math.floor(value);
const pad = (value: number, width = 2): string => String(Math.abs(value)).padStart(width, '0');
const bubble = (input: number): Parts => {
  const parts = zero(); let value = input;
  for (const key of ['years', 'months', 'days', 'hours', 'minutes', 'seconds'] as const) { parts[key] = trunc(value / size[key]); value %= size[key]; }
  parts.milliseconds = value;
  return parts;
};
const parseIso = (input: string): Parts | undefined => {
  const match = /^(-|\+)?P(?:([-+]?\d+(?:\.\d+)?)Y)?(?:([-+]?\d+(?:\.\d+)?)M)?(?:([-+]?\d+(?:\.\d+)?)W)?(?:([-+]?\d+(?:\.\d+)?)D)?(?:T(?:([-+]?\d+(?:\.\d+)?)H)?(?:([-+]?\d+(?:\.\d+)?)M)?(?:([-+]?\d+(?:\.\d+)?)S)?)?$/.exec(input);
  if (!match) return undefined;
  const sign = match[1] === '-' ? -1 : 1; const values = match.slice(2).map((value) => sign * +(value?.replace(/[A-Z]$/, '') ?? 0)); const parts = zero();
  [parts.years, parts.months, parts.weeks, parts.days, parts.hours, parts.minutes, parts.seconds] = values as [number, number, number, number, number, number, number];
  return parts;
};
const from = (input: DurationInput = 0, unit?: string): { ms: number; parts: Parts } => {
  if (input instanceof Duration) return { ms: input.valueOf(), parts: bubble(input.valueOf()) };
  if (typeof input === 'number') { const ms = input * size[name(unit)]; return { ms, parts: bubble(ms) }; }
  if (typeof input === 'string') { const parts = parseIso(input); return parts ? { ms: total(parts), parts } : { ms: Number.NaN, parts: zero() }; }
  const parts = zero(); for (const [key, value] of Object.entries(input)) { const target = name(key); if (target in parts) parts[target] += value ?? 0; }
  return { ms: total(parts), parts };
};

export class Duration {
  #ms: number;
  #parts: Parts;
  constructor(input: DurationInput = 0, unit?: string) { const value = from(input, unit); this.#ms = value.ms; this.#parts = value.parts; }
  as(unit: Unit | string): number { return this.#ms / size[name(unit)]; }
  get(unit: Unit | string): number { const target = name(unit); return target === 'milliseconds' ? this.#ms % 1e3 || 0 : target === 'weeks' ? trunc(this.#ms / size.weeks) : this.#parts[target] || 0; }
  milliseconds(): number { return this.get('millisecond'); }
  seconds(): number { return this.get('second'); }
  minutes(): number { return this.get('minute'); }
  hours(): number { return this.get('hour'); }
  days(): number { return this.get('day'); }
  weeks(): number { return this.get('week'); }
  months(): number { return this.get('month'); }
  years(): number { return this.get('year'); }
  asMilliseconds(): number { return this.as('millisecond'); }
  asSeconds(): number { return this.as('second'); }
  asMinutes(): number { return this.as('minute'); }
  asHours(): number { return this.as('hour'); }
  asDays(): number { return this.as('day'); }
  asWeeks(): number { return this.as('week'); }
  asMonths(): number { return this.as('month'); }
  asYears(): number { return this.as('year'); }
  valueOf(): number { return this.#ms; }
  add(input: DurationInput, unit?: string): Duration { return new Duration(this.#ms + from(input, unit).ms); }
  subtract(input: DurationInput, unit?: string): Duration { return new Duration(this.#ms - from(input, unit).ms); }
  format(pattern = 'YYYY-MM-DDTHH:mm:ss'): string {
    const values: Record<string, string> = { Y: String(this.years()), YY: pad(this.years()), YYYY: pad(this.years(), 4), M: String(this.months()), MM: pad(this.months()), D: String(this.days()), DD: pad(this.days()), H: String(this.hours()), HH: pad(this.hours()), m: String(this.minutes()), mm: pad(this.minutes()), s: String(this.seconds()), ss: pad(this.seconds()), SSS: pad(this.milliseconds(), 3) };
    return pattern.replace(/\[([^\]]+)]|YYYY|YY|Y|MM|M|DD|D|HH|H|mm|m|ss|s|SSS/g, (match, literal) => literal ?? values[match]!);
  }
  humanize(withSuffix = false): string { const amount = this.#ms; const found = (Object.entries({ year: 31536e6, month: 2628e6, day: 864e5, hour: 36e5, minute: 6e4, second: 1e3 }) as [Intl.RelativeTimeFormatUnit, number][]).find(([, value]) => Math.abs(amount) >= value) ?? ['second', 1]; const [unit, value] = found; const count = Math.round(amount / value); return withSuffix ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(count, unit) : `${Math.abs(count)} ${unit}${Math.abs(count) === 1 ? '' : 's'}`; }
  toISOString(): string {
    const parts = this.#parts; const day = parts.days + parts.weeks * 7; const second = parts.seconds + parts.milliseconds / 1e3; const negative = [parts.years, parts.months, day, parts.hours, parts.minutes, second].some((value) => value < 0); const value = (amount: number, suffix: string) => amount ? `${Math.abs(amount)}${suffix}` : ''; const time = value(parts.hours, 'H') + value(parts.minutes, 'M') + value(second, 'S'); const output = `${negative ? '-' : ''}P${value(parts.years, 'Y')}${value(parts.months, 'M')}${value(day, 'D')}${time ? `T${time}` : ''}`; return output === 'P' || output === '-P' ? 'P0D' : output;
  }
  toJSON(): string { return this.toISOString(); }
}

const duration: Plugin = (_option, Temday, factory) => {
  (factory as any).duration = (input?: DurationInput, unit?: string) => new Duration(input, unit);
  (factory as any).isDuration = (input: unknown): input is Duration => input instanceof Duration;
  const add = Temday.prototype.add; const subtract = Temday.prototype.subtract;
  Temday.prototype.add = function addDuration(this: any, input: any, unit?: any) { return input instanceof Duration ? this.add(input.years(), 'year').add(input.months(), 'month').add(input.days(), 'day').add(input.hours(), 'hour').add(input.minutes(), 'minute').add(input.seconds(), 'second').add(input.milliseconds(), 'millisecond') : add.call(this, input, unit); } as any;
  Temday.prototype.subtract = function subtractDuration(this: any, input: any, unit?: any) { return input instanceof Duration ? this.subtract(input.years(), 'year').subtract(input.months(), 'month').subtract(input.days(), 'day').subtract(input.hours(), 'hour').subtract(input.minutes(), 'minute').subtract(input.seconds(), 'second').subtract(input.milliseconds(), 'millisecond') : subtract.call(this, input, unit); } as any;
};
export default duration;

declare module '../index.js' { interface TemdayFactory { duration(input?: DurationInput, unit?: string): Duration; isDuration(input: unknown): input is Duration; } }
