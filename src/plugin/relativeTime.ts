import type { Plugin } from '../types.js';

const steps: readonly [string, number][] = [['year', 31536e6], ['month', 2628e6], ['week', 6048e5], ['day', 864e5], ['hour', 36e5], ['minute', 6e4], ['second', 1e3]];
const select = (milliseconds: number): [string, number] => { for (const [unit, size] of steps) if (Math.abs(milliseconds) >= size) return [unit, Math.round(milliseconds / size)]; return ['second', Math.round(milliseconds / 1e3)]; };
const english = { future: 'in %s', past: '%s ago', s: 'a few seconds', m: 'a minute', mm: '%d minutes', h: 'an hour', hh: '%d hours', d: 'a day', dd: '%d days', M: 'a month', MM: '%d months', y: 'a year', yy: '%d years' };
const thresholds: readonly [keyof typeof english, number | undefined, number?][] = [['s', 44, 1e3], ['m', 89], ['mm', 44, 6e4], ['h', 89], ['hh', 21, 36e5], ['d', 35], ['dd', 25, 864e5], ['M', 45], ['MM', 10, 2628e6], ['y', 17], ['yy', undefined, 31536e6]];
const englishRelative = (milliseconds: number, withoutSuffix: boolean): string => {
  let value = milliseconds;
  for (let index = 0; index < thresholds.length; index += 1) {
    let [key, limit, divisor] = thresholds[index]!; if (divisor) value = milliseconds / divisor;
    const amount = Math.round(Math.abs(value));
    if (limit === undefined || amount <= limit) {
      if (amount <= 1 && index) [key] = thresholds[index - 1]!;
      const text = english[key].replace('%d', String(amount));
      return withoutSuffix ? text : (milliseconds > 0 ? english.future : english.past).replace('%s', text);
    }
  }
  /* c8 ignore next -- the final open-ended `yy` threshold always returns. */
  return english.s;
};

/** Human relative time with native Intl.RelativeTimeFormat locale output. */
const relativeTime: Plugin = (_option, Temday, factory) => {
  const relative = (self: any, other: any, withoutSuffix = false, invert = false) => {
    const locale = typeof self.locale === 'function' ? self.locale() : 'en';
    const milliseconds = invert ? other.valueOf() - self.valueOf() : self.valueOf() - other.valueOf();
    if (/^en(?:-|$)/i.test(locale)) return englishRelative(milliseconds, withoutSuffix);
    const [unit, amount] = select(milliseconds);
    if (withoutSuffix) return `${Math.abs(amount)} ${unit}${Math.abs(amount) === 1 ? '' : 's'}`;
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(amount, unit as Intl.RelativeTimeFormatUnit);
  };
  Temday.prototype.from = function from(input: unknown, withoutSuffix?: boolean) { return relative(this, (factory as any)(input), withoutSuffix); };
  Temday.prototype.to = function to(input: unknown, withoutSuffix?: boolean) { return relative(this, (factory as any)(input), withoutSuffix, true); };
  Temday.prototype.fromNow = function fromNow(withoutSuffix?: boolean) { return relative(this, (factory as any)(), withoutSuffix); };
  Temday.prototype.toNow = function toNow(withoutSuffix?: boolean) { return relative(this, (factory as any)(), withoutSuffix, true); };
};

export default relativeTime;

declare module '../core/instance.js' {
  interface Temday {
    from(input: unknown, withoutSuffix?: boolean): string;
    to(input: unknown, withoutSuffix?: boolean): string;
    fromNow(withoutSuffix?: boolean): string;
    toNow(withoutSuffix?: boolean): string;
  }
}
