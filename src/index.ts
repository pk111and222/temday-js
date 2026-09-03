import { Temday } from './core/instance.js';
import { parse } from './core/parse.js';
import { configure, defaultTimeZone } from './core/temporal.js';
import type { DateInput, ParseFormat, Parser, Plugin, PluginRuntime } from './types.js';

export { Temday, configure };
export type { CanonicalUnit, DateInput, ParseFormat, Parser, Plugin, PluginRuntime, Unit } from './types.js';

export interface TemdayFactory {
  (input?: DateInput, format?: ParseFormat, locale?: string | boolean, strict?: boolean): Temday;
  extend(plugin: Plugin, option?: unknown): TemdayFactory;
  isTemday(value: unknown): value is Temday;
  unix(seconds: number): Temday;
}

const installed = new WeakSet<object>();
const parsers: Parser[] = [];
const temday = ((input?: DateInput, format?: ParseFormat, locale?: string | boolean, strict?: boolean) => {
  const zone = defaultTimeZone();
  let state;
  for (let index = 0; index < parsers.length; index += 1) {
    const parser = parsers[index];
    if (parser) state = parser(input, format, locale, strict, zone);
    if (state !== undefined) break;
  }
  return new Temday(state ?? parse(input, zone), temday);
}) as TemdayFactory;
const runtime: PluginRuntime = { addParser(parser) { parsers.push(parser); } };

temday.extend = (plugin: Plugin, option?: unknown): TemdayFactory => {
  if (typeof plugin !== 'function') throw new TypeError('plugin');
  if (!installed.has(plugin)) { installed.add(plugin); plugin(option, Temday, temday, runtime); }
  return temday;
};
temday.isTemday = (value: unknown): value is Temday => value instanceof Temday;
temday.unix = (seconds: number): Temday => temday(seconds * 1_000);
export default temday;
