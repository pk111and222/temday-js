import { format as formatValue } from './format.js';
import { normalizeUnit } from './units.js';
import type { CanonicalUnit, DateInput, DateState, ParseFormat, Unit, ZonedDateTime } from '../types.js';

type Factory = (input?: DateInput, format?: ParseFormat, locale?: string | boolean, strict?: boolean) => Temday;
const divisor: Record<Exclude<CanonicalUnit, 'month' | 'year'>, number> = { millisecond: 1, second: 1e3, minute: 6e4, hour: 36e5, day: 864e5, week: 6048e5 };

const trunc = (value: number): number => Math.trunc(value) || 0;

export class Temday {
  #s: DateState;
  #f: Factory;
  public constructor(state: DateState, factory: Factory) { this.#s = state; this.#f = factory; }

  #n(value: ZonedDateTime | null): Temday {
    const next = new (this.constructor as any)({ ...this.#s, value, valid: !!value }, this.#f); (next as any).$u = (this as any).$u; return next;
  }
  #v(): ZonedDateTime | null { return this.#s.value; }
  #r(unit: CanonicalUnit): number {
    const value = this.#v();
    if (!value) return NaN;
    switch (unit) {
      case 'year': return value.year;
      case 'month': return value.month - 1;
      case 'week': return NaN;
      case 'day': return value.day;
      case 'hour': return value.hour;
      case 'minute': return value.minute;
      case 'second': return value.second;
      case 'millisecond': return value.millisecond;
    }
  }

  public isValid(): boolean { return this.#s.valid; }
  /** Internal mutation bridge used only by the opt-in BadMutable compatibility plugin. */
  public $m(other: Temday): Temday { this.#s = other.#s; return this; }
  public clone(): Temday { return new (this.constructor as any)(this.#s, this.#f); }
  public valueOf(): number { const value = this.#v(); return value ? +value.epochMilliseconds : NaN; }
  public unix(): number { return trunc(this.valueOf() / 1_000); }
  public toDate(): Date { return new Date(this.valueOf()); }
  public toISOString(): string {
    const value = this.#v();
    if (!value) {
      throw RangeError();
    }
    return this.toDate().toISOString();
  }
  public daysInMonth(): number { return this.endOf('month').date(); }
  public toJSON(): string | null { return this.isValid() ? this.toISOString() : null; }
  public toString(): string { return this.toDate().toUTCString(); }

  public add(amount: number, unit: Unit | string): Temday {
    const value = this.#v();
    if (!value) return this.clone();
    try { const normalized = normalizeUnit(unit); return this.#n(value.add({ [`${normalized}s`]: amount })); } catch { return this.#n(null); }
  }
  public subtract(amount: number, unit: Unit | string): Temday { return this.add(-amount, unit); }

  public startOf(unit: Unit | string): Temday {
    const value = this.#v();
    if (!value) return this.clone();
    const normalized = normalizeUnit(unit);
    try {
      if (normalized === 'week') return this.#n(value.subtract({ days: value.dayOfWeek % 7 }).with({ hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }));
      if (normalized === 'year') return this.#n(value.with({ month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }));
      if (normalized === 'month') return this.#n(value.with({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }));
      if (normalized === 'day') return this.#n(value.with({ hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }));
      if (normalized === 'hour') return this.#n(value.with({ minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }));
      if (normalized === 'minute') return this.#n(value.with({ second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }));
      if (normalized === 'second') return this.#n(value.with({ millisecond: 0, microsecond: 0, nanosecond: 0 }));
      return this.#n(value.with({ microsecond: 0, nanosecond: 0 }));
    } catch { return this.#n(null); }
  }
  public endOf(unit: Unit | string): Temday {
    const normalized = normalizeUnit(unit);
    return this.startOf(normalized).add(1, normalized).subtract(1, 'millisecond');
  }

  public get(unit: Unit | string): number {
    if (unit === 'day' || unit === 'days' || unit === 'd') { const value = this.#v(); return value ? value.dayOfWeek % 7 : NaN; }
    return this.#r(normalizeUnit(unit));
  }
  public set(unit: Unit | string, amount: number): Temday {
    const value = this.#v();
    if (!value) return this.clone();
    try {
      if (unit === 'day' || unit === 'days' || unit === 'd') return this.add(amount - (value.dayOfWeek % 7), 'day');
      const normalized = normalizeUnit(unit);
      const field = normalized === 'month' ? 'month' : normalized === 'day' ? 'day' : normalized;
      return this.#n(value.with({ [field]: normalized === 'month' ? amount + 1 : amount }));
    } catch { return this.#n(null); }
  }
  public format(pattern = 'YYYY-MM-DDTHH:mm:ssZ'): string { const value = this.#v(); return value ? formatValue(value, pattern) : 'Invalid Date'; }
  public isBefore(input: DateInput, unit?: Unit | string): boolean { return this.#c(input, unit, (a, b) => a < b); }
  public isAfter(input: DateInput, unit?: Unit | string): boolean { return this.#c(input, unit, (a, b) => a > b); }
  public isSame(input: DateInput, unit?: Unit | string): boolean {
    const other = this.#f(input); if (!this.isValid() || !other.isValid()) return false;
    if (!unit) return this.valueOf() === other.valueOf();
    return this.startOf(unit).valueOf() === other.startOf(unit).valueOf();
  }
  #c(input: DateInput, unit: Unit | string | undefined, predicate: (a: number, b: number) => boolean): boolean {
    const other = this.#f(input); if (!this.isValid() || !other.isValid()) return false;
    return predicate(unit ? this.startOf(unit).valueOf() : this.valueOf(), unit ? other.startOf(unit).valueOf() : other.valueOf());
  }
  public diff(input: DateInput, unit: Unit | string = 'millisecond', asFloat = false): number {
    const other = this.#f(input); if (!this.isValid() || !other.isValid()) return NaN;
    const normalized = normalizeUnit(unit);
    const milliseconds = this.valueOf() - other.valueOf();
    let result: number;
    if (normalized === 'month' || normalized === 'year') {
      const monthDiff = (a: Temday, b: Temday): number => {
        if (a.date() < b.date()) return -monthDiff(b, a);
        const wholeMonths = (b.year() - a.year()) * 12 + b.month() - a.month();
        const anchor = a.add(wholeMonths, 'month');
        const beforeAnchor = b.valueOf() - anchor.valueOf() < 0;
        const adjacent = a.add(wholeMonths + (beforeAnchor ? -1 : 1), 'month');
        return -(wholeMonths + (b.valueOf() - anchor.valueOf()) / (beforeAnchor ? anchor.valueOf() - adjacent.valueOf() : adjacent.valueOf() - anchor.valueOf())) || 0;
      };
      result = monthDiff(this, other);
      if (normalized === 'year') result /= 12;
    } else result = milliseconds / divisor[normalized];
    return asFloat ? result : trunc(result);
  }
}

export interface Temday {
  day(): number; day(value: number): Temday;
  year(): number; year(value: number): Temday;
  month(): number; month(value: number): Temday;
  date(): number; date(value: number): Temday;
  hour(): number; hour(value: number): Temday;
  minute(): number; minute(value: number): Temday;
  second(): number; second(value: number): Temday;
  millisecond(): number; millisecond(value: number): Temday;
}
for (const unit of ['year', 'month', 'date', 'day', 'hour', 'minute', 'second', 'millisecond']) {
  (Temday.prototype as any)[unit] = function (value?: number) { return value === undefined ? this.get(unit) : this.set(unit, value); };
}
