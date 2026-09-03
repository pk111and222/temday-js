export interface LocaleProvider {
  code: string;
  month(index: number, short?: boolean): string;
  weekday(index: number, short?: boolean, narrow?: boolean): string;
  ordinal(value: number): string;
  meridiem(hour: number, lower?: boolean): string;
  format(date: Date, token: string): string;
  firstDayOfWeek(): number;
  /** First calendar day that must be present in locale week 1. */
  yearStart?(): number;
}

const monthDate = (index: number): Date => new Date(Date.UTC(2024, index, 1));
const weekdayDate = (index: number): Date => new Date(Date.UTC(2024, 0, 7 + index));
const option: Record<string, Intl.DateTimeFormatOptions> = {
  LT: { hour: 'numeric', minute: '2-digit' },
  LTS: { hour: 'numeric', minute: '2-digit', second: '2-digit' },
  L: { year: 'numeric', month: '2-digit', day: '2-digit' },
  LL: { year: 'numeric', month: 'long', day: 'numeric' },
  LLL: { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' },
  LLLL: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' },
};

/** Native Intl-backed locale data. No locale tables are bundled into temday. */
export function createIntlLocaleProvider(code = 'en'): LocaleProvider {
  const format = (date: Date, options: Intl.DateTimeFormatOptions): string => new Intl.DateTimeFormat(code, { ...options, timeZone: 'UTC' }).format(date);
  return {
    code,
    month: (index, short) => format(monthDate(index), { month: short ? 'short' : 'long' }),
    weekday: (index, short, narrow) => format(weekdayDate(index), { weekday: narrow ? 'narrow' : short ? 'short' : 'long' }),
    ordinal: (value) => {
      if (!/^en(?:-|$)/i.test(code)) return String(value);
      const mod = value % 100; return `${value}${mod > 10 && mod < 14 ? 'th' : ['th', 'st', 'nd', 'rd'][value % 10] ?? 'th'}`;
    },
    meridiem: (hour, lower) => (hour < 12 ? lower ? 'am' : 'AM' : lower ? 'pm' : 'PM'),
    format: (date, token) => format(date, option[token] ?? option.L!),
    firstDayOfWeek: () => {
      const info = (new Intl.Locale(code) as any).getWeekInfo?.();
      return info ? info.firstDay % 7 : /^en(?:-|$)/i.test(code) ? 0 : 1;
    },
    yearStart: () => (new Intl.Locale(code) as any).getWeekInfo?.().minimalDays ?? 1,
  };
}

export default createIntlLocaleProvider;
