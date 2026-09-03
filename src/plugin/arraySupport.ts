import type { DateState, Plugin } from '../types.js';
const invalid = (timeZone: string): DateState => ({ value: null, valid: false, timeZone });
/** Parses `[year, monthIndex, date, hour, minute, second, millisecond]` input. */
const arraySupport: Plugin = (_option, _Temday, _factory, runtime) => {
  runtime.addParser((input, _format, _locale, _strict, timeZone = 'UTC') => {
    if (!Array.isArray(input)) return undefined;
    try { const T = (globalThis as any).Temporal; return { value: T.ZonedDateTime.from({ year: Number(input[0]), month: Number(input[1] ?? 0) + 1, day: Number(input[2] ?? 1), hour: Number(input[3] ?? 0), minute: Number(input[4] ?? 0), second: Number(input[5] ?? 0), millisecond: Number(input[6] ?? 0), timeZone }, { overflow: 'reject' }), valid: true, timeZone }; } catch { return invalid(timeZone); }
  });
};
export default arraySupport;
