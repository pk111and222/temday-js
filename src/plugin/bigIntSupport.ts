import type { DateState, Plugin } from '../types.js';
const invalid = (timeZone: string): DateState => ({ value: null, valid: false, timeZone });
/** Accepts safe bigint epoch-millisecond input. */
const bigIntSupport: Plugin = (_option, _Temday, factory, runtime) => {
  runtime.addParser((input, _format, _locale, _strict, timeZone = 'UTC') => {
    if (typeof input !== 'bigint') return undefined;
    try { const value = Number(input); const T = (globalThis as any).Temporal; return Number.isSafeInteger(value) ? { value: T.Instant.fromEpochMilliseconds(value).toZonedDateTimeISO(timeZone), valid: true, timeZone } : invalid(timeZone); } catch { return invalid(timeZone); }
  });
  const unix = (factory as any).unix;
  (factory as any).unix = (seconds: number | bigint) => typeof seconds === 'bigint' ? (factory as any)(seconds * 1_000n) : unix(seconds);
};
export default bigIntSupport;
