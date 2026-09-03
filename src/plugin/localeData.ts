import { createIntlLocaleProvider, type LocaleProvider } from '../locale/intl.js';
import type { Plugin } from '../types.js';

export interface LocaleDataOptions { locale?: string; provider?: (locale: string) => LocaleProvider; }
type State = { code: string; provider: (locale: string) => LocaleProvider; data: LocaleProvider; values: WeakMap<object, string> };
type Host = { $locale?: State; locale?: (code?: string) => string; };
const token = /\[([^\]]*)]|MMMM|MMM|dddd|ddd|dd/g;
const host = (factory: Function): Host => factory as unknown as Host;

function setup(factory: Function, option: unknown): State {
  const target = host(factory); const config = typeof option === 'string' ? { locale: option } : (option ?? {}) as LocaleDataOptions;
  if (target.$locale) return target.$locale;
  const provider = config.provider ?? createIntlLocaleProvider; const code = config.locale ?? 'en';
  target.$locale = { code, provider, data: provider(code), values: new WeakMap() };
  target.locale = (next?: string) => {
    if (next) { target.$locale!.code = next; target.$locale!.data = provider(next); }
    return target.$locale!.code;
  };
  return target.$locale;
}

const localeData: Plugin = (option, Temday, factory) => {
  const state = setup(factory, option); const previous = Temday.prototype.format;
  Temday.prototype.format = function format(pattern = 'YYYY-MM-DDTHH:mm:ssZ') {
    const data = state.provider(state.values.get(this) ?? state.code); const weekday = this.get('day'); return previous.call(this, pattern.replace(token, (match: string, literal: string | undefined) => literal === undefined ? `[${match === 'MMMM' ? data.month(this.month()) : match === 'MMM' ? data.month(this.month(), true) : match === 'dddd' ? data.weekday(weekday) : match === 'ddd' ? data.weekday(weekday, true) : data.weekday(weekday, false, true)}]` : match));
  };
  Temday.prototype.locale = function locale(code?: string) {
    if (!code) return state.values.get(this) ?? state.code;
    const next = (factory as any)(this.valueOf()); state.values.set(next, code); return next;
  };
  Temday.prototype.localeData = function localeDataValue() { return state.provider(state.values.get(this) ?? state.code); };
  (Temday as any).locale = host(factory).locale;
  (factory as any).locale = host(factory).locale;
};

export default localeData;
export { setup as installLocaleData };

declare module '../core/instance.js' {
  interface Temday {
    locale(): string;
    locale(code: string): this;
    localeData(): LocaleProvider;
  }
}

declare module '../index.js' {
  interface TemdayFactory {
    locale(): string;
    locale(code: string): string;
  }
}
