import type { Plugin } from '../types.js';

export interface TokenCodec { token: string; format(value: any, locale?: unknown): string; }
type Host = { addToken?: (codec: TokenCodec) => void; };
const quote = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Dynamic, factory-local formatter-token registry. */
const tokenRegistry: Plugin = (_option, Temday, factory) => {
  const codecs = new Map<string, TokenCodec>(); let scanner = /$^/g; const previous = Temday.prototype.format;
  (factory as unknown as Host).addToken = (codec) => {
    codecs.set(codec.token, codec);
    scanner = new RegExp(`\\[([^\\]]*)]|${[...codecs.keys()].sort((a, b) => b.length - a.length).map(quote).join('|')}`, 'g');
  };
  Temday.prototype.format = function format(pattern = 'YYYY-MM-DDTHH:mm:ssZ') {
    return previous.call(this, pattern.replace(scanner, (match: string, literal: string | undefined) => literal === undefined ? `[${codecs.get(match)?.format(this, (this as any).localeData?.()) ?? match}]` : match));
  };
};

export default tokenRegistry;

declare module '../index.js' {
  interface TemdayFactory {
    addToken(codec: TokenCodec): void;
  }
}
