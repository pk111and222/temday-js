import { temporal } from './temporal.js';
import type { DateInput, DateState } from '../types.js';
import { Temday } from './instance.js';

function invalid(timeZone: string): DateState {
  return { value: null, valid: false, timeZone };
}

function parseDefault(input: DateInput, timeZone: string): DateState {
  const T = temporal();
  try {
    if (input === undefined) return { value: T.Now.instant().toZonedDateTimeISO(timeZone), valid: true, timeZone };
    if (input === null || input === '') return invalid(timeZone);
    if (input instanceof Temday) return { value: T.Instant.fromEpochMilliseconds(input.valueOf()).toZonedDateTimeISO(timeZone), valid: input.isValid(), timeZone };
    if (typeof input === 'number') return { value: T.Instant.fromEpochMilliseconds(input).toZonedDateTimeISO(timeZone), valid: true, timeZone };
    if (input instanceof Date) return Number.isNaN(input.valueOf()) ? invalid(timeZone) : { value: T.Instant.fromEpochMilliseconds(input.valueOf()).toZonedDateTimeISO(timeZone), valid: true, timeZone };
    if (input instanceof T.Instant) return { value: (input as any).toZonedDateTimeISO(timeZone), valid: true, timeZone };
    if (input instanceof T.ZonedDateTime) return { value: (input as any).withTimeZone(timeZone), valid: true, timeZone };
    if (input instanceof T.PlainDateTime) return { value: (input as any).toZonedDateTime(timeZone), valid: true, timeZone };
    if (input instanceof T.PlainDate) return { value: (input as any).toPlainDateTime().toZonedDateTime(timeZone), valid: true, timeZone };
    if (typeof input !== 'string') return invalid(timeZone);
    if (/(?:Z|[+-]\d\d:?\d\d)(?:\[[^\]]+\])?$/i.test(input)) {
      return { value: T.Instant.from(input).toZonedDateTimeISO(timeZone), valid: true, timeZone };
    }
    return { value: T.PlainDateTime.from(input).toZonedDateTime(timeZone), valid: true, timeZone };
  } catch {
    return invalid(timeZone);
  }
}

export const parse = (input: DateInput, timeZone: string): DateState => parseDefault(input, timeZone);
