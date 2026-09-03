import type { Plugin } from '../types.js';
const pluralGetSet: Plugin = (_option, Temday) => { for (const unit of ['year', 'month', 'date', 'day', 'hour', 'minute', 'second', 'millisecond']) Temday.prototype[`${unit}s`] = Temday.prototype[unit]; };
export default pluralGetSet;
declare module '../core/instance.js' { interface Temday { years(): number; years(value: number): this; months(): number; months(value: number): this; dates(): number; dates(value: number): this; days(): number; days(value: number): this; hours(): number; hours(value: number): this; minutes(): number; minutes(value: number): this; seconds(): number; seconds(value: number): this; milliseconds(): number; milliseconds(value: number): this; } }
