import type { DateInput, DateState, ParseFormat, Plugin } from '../types.js';

export interface ParseContext {
  input: DateInput;
  format?: ParseFormat | undefined;
  locale?: string | boolean | undefined;
  strict?: boolean | undefined;
  timeZone: string;
}
export type ParserMiddleware = (context: ParseContext, next: () => DateState | undefined) => DateState | undefined;
type Host = { addParser?: (parser: ParserMiddleware) => void; };

/** Optional onion parser runtime for plugins that need pre/post parsing hooks. */
const parserPipeline: Plugin = (_option, _Temday, factory, runtime) => {
  const middleware: ParserMiddleware[] = [];
  (factory as unknown as Host).addParser = (parser) => { middleware.push(parser); };
  runtime.addParser((input, format, locale, strict, timeZone = 'UTC') => {
    const context: ParseContext = { input, format, locale, strict, timeZone };
    const run = (index: number): DateState | undefined => middleware[index]?.(context, () => run(index + 1));
    return run(0);
  });
};

export default parserPipeline;

declare module '../index.js' {
  interface TemdayFactory {
    addParser(parser: ParserMiddleware): void;
  }
}
