import type { Plugin } from '../types.js';

type Host = { $locale?: { data: { ordinal(value: number): string; meridiem(hour: number, lower?: boolean): string; } }; };
const token = /\[([^\]]*)|Do|kk|k|Q|X|x/g;

/** Adds temday display-only advanced tokens without changing core token handling. */
const advancedFormat: Plugin = (_option, Temday, factory) => {
  const previous = Temday.prototype.format; const host = factory as unknown as Host;
  Temday.prototype.format = function format(pattern = 'YYYY-MM-DDTHH:mm:ssZ') {
    return previous.call(this, pattern.replace(token, (match: string, literal: string | undefined) => {
      if (literal !== undefined) return match;
      const hour = this.hour(); const value = match === 'Do' ? (host.$locale?.data.ordinal(this.date()) ?? `${this.date()}${['th', 'st', 'nd', 'rd'][this.date() % 10] ?? 'th'}`) : match === 'Q' ? String(Math.ceil((this.month() + 1) / 3)) : match === 'k' ? String(hour || 24) : match === 'kk' ? String(hour || 24).padStart(2, '0') : match === 'X' ? String(Math.floor(this.valueOf() / 1000)) : String(this.valueOf());
      return `[${value}]`;
    }));
  };
};

export default advancedFormat;
