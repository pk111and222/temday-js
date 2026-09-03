import type { DateState, Plugin } from '../types.js';

export interface PreParsePostFormatOptions { preparse?(input: string): string; postformat?(output: string): string; }
const invalid = (timeZone: string): DateState => ({ value: null, valid: false, timeZone });
/** Locale-oriented input/output transforms; transformed input re-enters the active parser chain. */
const preParsePostFormat: Plugin = (option, Temday, factory, runtime) => {
  const config = (option ?? {}) as PreParsePostFormatOptions; const pre = config.preparse ?? ((value: string) => value); const post = config.postformat ?? ((value: string) => value); const previous = Temday.prototype.format;
  Temday.prototype.format = function format(pattern?: string) { return post(previous.call(this, pattern)); };
  runtime.addParser((input, format, locale, strict, timeZone = 'UTC') => {
    if (typeof input !== 'string') return undefined; const transformed = pre(input); if (transformed === input) return undefined;
    try { const value = (factory as any)(transformed, format, locale, strict); const T = (globalThis as any).Temporal; return value.isValid() ? { value: T.Instant.fromEpochMilliseconds(value.valueOf()).toZonedDateTimeISO(timeZone), valid: true, timeZone } : invalid(timeZone); } catch { return invalid(timeZone); }
  });
};
export default preParsePostFormat;
