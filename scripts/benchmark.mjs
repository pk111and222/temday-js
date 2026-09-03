import { Temporal } from '@js-temporal/polyfill';
import temday, { configure } from '../dist/index.js';
import { createTemday } from '../dist/context.js';

configure({ Temporal });
const value = createTemday({ timeZone: 'UTC' })('2024-08-05T13:04:09.007');
const iterations = 100_000;
let result = '';
const started = performance.now();
for (let index = 0; index < iterations; index += 1) result = value.format('YYYY-MM-DD HH:mm:ss.SSS');
const elapsed = performance.now() - started;
console.log(JSON.stringify({ library: temday.name ?? 'temday', iterations, elapsedMs: Number(elapsed.toFixed(1)), operationsPerSecond: Math.round(iterations / elapsed * 1_000), result }));
