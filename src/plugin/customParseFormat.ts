import type { DateInput, DateState, ParseFormat, Parser, Plugin } from '../types.js';

const parts = /\[([^\]]*)]|YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|SSS|ss|s|ZZ|Z|A|a/g;
const numeric: Record<string, string> = {
  YYYY: '(\\d{4})', YY: '(\\d{2})', M: '(\\d{1,2})', MM: '(\\d{2})',
  D: '(\\d{1,2})', DD: '(\\d{2})', H: '(\\d{1,2})', HH: '(\\d{2})',
  h: '(\\d{1,2})', hh: '(\\d{2})', m: '(\\d{1,2})', mm: '(\\d{2})',
  s: '(\\d{1,2})', ss: '(\\d{2})', SSS: '(\\d{1,3})', Z: '([+-][0-9][0-9]:[0-9][0-9]|Z)', ZZ: '([+-][0-9]{4}|Z)',
  A: '(AM|PM)', a: '(am|pm)',
};
const quote = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const invalid = (timeZone: string): DateState => ({ value: null, valid: false, timeZone });

function one(input: string, format: string, strict: boolean, timeZone: string): DateState {
  let source = '^'; let index = 0; let found: RegExpExecArray | null; const keys: string[] = [];
  parts.lastIndex = 0;
  while ((found = parts.exec(format))) {
    source += quote(format.slice(index, found.index)); index = parts.lastIndex;
    if (found[1] !== undefined) source += quote(found[1]);
    else { const key = found[0]; keys.push(key); source += numeric[key]!; }
  }
  const result = new RegExp(source + quote(format.slice(index)) + '$', strict ? '' : 'i').exec(input);
  if (!result) return invalid(timeZone);
  const now = new Date(); let year = now.getFullYear(); let month = 1; let day = 1; let hour = 0; let minute = 0; let second = 0; let millisecond = 0; let meridiem = ''; let offset = '';
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]!; const value = result[i + 1]!; const number = +value;
    if (key === 'YYYY') year = number;
    else if (key === 'YY') year = number + (number > 68 ? 1900 : 2000);
    else if (key === 'M' || key === 'MM') month = number;
    else if (key === 'D' || key === 'DD') day = number;
    else if (key === 'H' || key === 'HH' || key === 'h' || key === 'hh') hour = number;
    else if (key === 'm' || key === 'mm') minute = number;
    else if (key === 's' || key === 'ss') second = number;
    else if (key === 'SSS') millisecond = number * (value.length === 1 ? 100 : value.length === 2 ? 10 : 1);
    else if (key === 'A' || key === 'a') meridiem = value;
    else offset = value === 'Z' ? '+00:00' : value.replace(/^([+-]\d\d)(\d\d)$/, '$1:$2');
  }
  if (meridiem) hour = hour % 12 + (/p/i.test(meridiem) ? 12 : 0);
  if (offset) { const zone = /^([+-])(\d\d):?(\d\d)$/.exec(offset); if (zone && (+zone[2]! > 23 || +zone[3]! > 59)) return invalid(timeZone); }
  try {
    const T = (globalThis as any).Temporal;
    const value = T.ZonedDateTime.from({ year, month, day, hour, minute, second, millisecond, timeZone: offset || timeZone }).withTimeZone(timeZone);
    return { value, valid: true, timeZone };
  } catch { return invalid(timeZone); }
}

const parser: Parser = (input: DateInput, format?: ParseFormat, locale?: string | boolean, strict?: boolean, timeZone = 'UTC') => {
  if (typeof input !== 'string' || !format) return undefined;
  const isStrict = typeof locale === 'boolean' ? locale : !!strict;
  const formats = typeof format === 'string' ? [format] : format;
  let value: DateState = invalid(timeZone);
  for (const candidate of formats) { value = one(input, candidate, isStrict, timeZone); if (value.valid) break; }
  return value;
};

/** temday-compatible numeric custom format parser; locale-name tokens remain a locale plugin concern. */
const customParseFormat: Plugin = (_option, _Temday, _factory, runtime) => { runtime.addParser(parser); };

export default customParseFormat;
