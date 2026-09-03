/** Runtime shape intentionally stays structural: the Temporal polyfill is not bundled. */
export type TemporalNamespace = any;
export type ZonedDateTime = any;

export type Unit =
  | 'year' | 'month' | 'week' | 'day' | 'date'
  | 'hour' | 'minute' | 'second' | 'millisecond'
  | 'y' | 'M' | 'w' | 'd' | 'D' | 'h' | 'm' | 's' | 'ms'
  | 'years' | 'months' | 'weeks' | 'days' | 'dates'
  | 'hours' | 'minutes' | 'seconds' | 'milliseconds';

export type CanonicalUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
export type DateInput = unknown;
export type ParseFormat = string | readonly string[];

export interface CreateTemdayOptions {
  timeZone?: string;
}

export interface DateState {
  value: ZonedDateTime | null;
  valid: boolean;
  timeZone: string;
}

/** A parser returns `undefined` when it does not recognise the requested format. */
export type Parser = (
  input: DateInput,
  format?: ParseFormat,
  locale?: string | boolean,
  strict?: boolean,
  timeZone?: string,
) => DateState | undefined;

/** Per-factory extension surface. It is never shared between `temday` contexts. */
export interface PluginRuntime {
  addParser(parser: Parser): void;
}

export type Plugin = (option: unknown, Temday: Function, factory: Function, runtime: PluginRuntime) => void;
