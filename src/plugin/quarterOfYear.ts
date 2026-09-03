import type { Plugin } from '../types.js';

const quarterOfYear: Plugin = (_option, Temday) => { Temday.prototype.quarter = function quarter(value?: number) { return value === undefined ? Math.ceil((this.month() + 1) / 3) : this.month((value - 1) * 3 + this.month() % 3); }; };
export default quarterOfYear;
declare module '../core/instance.js' { interface Temday { quarter(): number; quarter(value: number): this; } }
