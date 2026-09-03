import type { LocaleProvider } from '../locale/intl.js';
import type { Plugin } from '../types.js';

export type LocalePatch = Omit<Partial<LocaleProvider>, 'yearStart'> & { months?: readonly string[]; monthsShort?: readonly string[]; weekdays?: readonly string[]; weekdaysShort?: readonly string[]; weekStart?: number; yearStart?: number; };
type State = { code: string; provider: (locale: string) => LocaleProvider; data: LocaleProvider; };
const updateLocale: Plugin = (_option, _Temday, factory) => {
  (factory as any).updateLocale = (locale: string, patch: LocalePatch) => {
    const state = (factory as any).$locale as State | undefined; if (!state) throw new Error('localeData required');
    const previous = state.provider;
    state.provider = (code) => {
      const base = previous(code); if (code !== locale) return base;
      const { yearStart, ...rest } = patch;
      return { ...base, ...rest,
        month: patch.month ?? ((index, short) => short && patch.monthsShort?.[index] || !short && patch.months?.[index] || base.month(index, short)),
        weekday: patch.weekday ?? ((index, short, narrow) => narrow ? base.weekday(index, short, narrow) : short && patch.weekdaysShort?.[index] || !short && patch.weekdays?.[index] || base.weekday(index, short, narrow)),
        firstDayOfWeek: patch.firstDayOfWeek ?? (() => patch.weekStart ?? base.firstDayOfWeek()),
        ...(yearStart === undefined ? base.yearStart ? { yearStart: base.yearStart } : {} : { yearStart: () => yearStart }),
      };
    };
    state.data = state.provider(state.code); return state.data;
  };
};
export default updateLocale;
declare module '../index.js' { interface TemdayFactory { updateLocale(locale: string, patch: LocalePatch): LocaleProvider; } }
