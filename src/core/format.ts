import type { ZonedDateTime } from '../types.js';

const token = /\[([^\]]*)]|YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|SSS|ZZ|Z|A|a/g;
const pad = (value: number, width = 2) => (value + '').padStart(width, '0');

/** Native RegExp replacement is the compact, allocation-light core token scanner. */
export function format(value: ZonedDateTime, pattern: string): string {
  return pattern.replace(token, (match: string, literal: string | undefined) => literal ?? (
    match === 'YYYY' ? pad(value.year, 4) : match === 'YY' ? (value.year + '').slice(-2) :
    match === 'M' ? String(value.month) : match === 'MM' ? pad(value.month) :
    match === 'D' ? String(value.day) : match === 'DD' ? pad(value.day) :
    match === 'H' ? String(value.hour) : match === 'HH' ? pad(value.hour) :
    match === 'h' ? String(value.hour % 12 || 12) : match === 'hh' ? pad(value.hour % 12 || 12) :
    match === 'm' ? String(value.minute) : match === 'mm' ? pad(value.minute) :
    match === 's' ? String(value.second) : match === 'ss' ? pad(value.second) :
    match === 'SSS' ? pad(value.millisecond, 3) : match === 'Z' ? value.offset :
    match === 'ZZ' ? value.offset.replace(':', '') : match === 'A' ? (value.hour < 12 ? 'AM' : 'PM') : (value.hour < 12 ? 'am' : 'pm')
  ));
}
