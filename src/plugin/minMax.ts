import type { Temday as TemdayInstance } from '../core/instance.js';
import type { Plugin } from '../types.js';
const minMax: Plugin = (_option, _Temday, factory) => {
  const pick = (sign: number, input: unknown[]) => {
    const values = (input.length === 1 && Array.isArray(input[0]) ? input[0] : input).map((value) => (factory as any)(value)).filter((value) => value.isValid());
    if (!values.length) return (factory as any)(Number.NaN);
    return values.reduce((best, value) => sign * (value.valueOf() - best.valueOf()) < 0 ? value : best);
  };
  (factory as any).min = (...values: unknown[]) => pick(1, values);
  (factory as any).max = (...values: unknown[]) => pick(-1, values);
};
export default minMax;
declare module '../index.js' { interface TemdayFactory { min(...values: unknown[]): TemdayInstance; max(...values: unknown[]): TemdayInstance; } }
