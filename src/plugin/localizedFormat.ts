import { createIntlLocaleProvider, type LocaleProvider } from '../locale/intl.js';
import type { Plugin } from '../types.js';

type Host = { $locale?: { code: string; provider: (locale: string) => LocaleProvider; data: LocaleProvider; values?: WeakMap<object, string> }; };
const token = /\[([^\]]*)]|LTS|LT|LLLL|LLL|LL|L/g;
const host = (factory: Function): Host => factory as unknown as Host;
const date = (value: any): Date => new Date(Date.UTC(value.year(), value.month(), value.date(), value.hour(), value.minute(), value.second(), value.millisecond()));

/** Expands `L`, `LT`, and long aliases through the active Intl provider. */
const localizedFormat: Plugin = (option, Temday, factory) => {
  const target = host(factory);
  if (!target.$locale) {
    const code = typeof option === 'string' ? option : 'en'; target.$locale = { code, provider: createIntlLocaleProvider, data: createIntlLocaleProvider(code) };
  }
  const previous = Temday.prototype.format;
  Temday.prototype.format = function format(pattern = 'YYYY-MM-DDTHH:mm:ssZ') {
    const state = target.$locale!; const data = state.provider(state.values?.get(this) ?? state.code);
    return previous.call(this, pattern.replace(token, (match: string, literal: string | undefined) => {
      if (literal !== undefined) return match;
      const value = data.format(date(this), match);
      return `[${/^en(?:-|$)/i.test(data.code) && (match === 'LLL' || match === 'LLLL') ? value.replace(' at ', ' ') : value}]`;
    }));
  };
};

export default localizedFormat;
