import { Temday } from './core/instance.js';
import { parse } from './core/parse.js';
import { defaultTimeZone } from './core/temporal.js';
import type { CreateTemdayOptions, DateInput, ParseFormat, Parser, Plugin, PluginRuntime } from './types.js';
import type { TemdayFactory } from './index.js';

/** Isolated context runtime with its own time zone and plugin state. */
export function createTemday(options: CreateTemdayOptions = {}): TemdayFactory {
  const zone = options.timeZone;
  const installed = new WeakSet<object>();
  const parsers: Parser[] = [];
  class ContextTemday extends Temday {}
  const factory = ((input?: DateInput, format?: ParseFormat, locale?: string | boolean, strict?: boolean) => {
    const timeZone = zone ?? defaultTimeZone();
    let state;
    for (let index = 0; index < parsers.length; index += 1) {
      const parser = parsers[index];
      if (parser) state = parser(input, format, locale, strict, timeZone);
      if (state !== undefined) break;
    }
    return new ContextTemday(state ?? parse(input, timeZone), factory as TemdayFactory);
  }) as TemdayFactory;
  const runtime: PluginRuntime = { addParser(parser) { parsers.push(parser); } };
  factory.extend = (plugin: Plugin, option?: unknown): TemdayFactory => {
    if (typeof plugin !== 'function') throw new TypeError('plugin');
    if (!installed.has(plugin)) { installed.add(plugin); plugin(option, ContextTemday, factory, runtime); }
    return factory;
  };
  factory.isTemday = (value: unknown): value is Temday => value instanceof Temday;
  factory.unix = (seconds: number): Temday => factory(seconds * 1_000);
  return factory;
}
