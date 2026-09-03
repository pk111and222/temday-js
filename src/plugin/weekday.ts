import type { Plugin } from '../types.js';
const weekday: Plugin = (_option, Temday) => { Temday.prototype.weekday = function weekdayValue(value?: number) { const first = this.localeData?.().firstDayOfWeek?.() ?? 0; const current = (this.get('day') - first + 7) % 7; return value === undefined ? current : this.add(value - current, 'day'); }; };
export default weekday;
declare module '../core/instance.js' { interface Temday { weekday(): number; weekday(value: number): this; } }
