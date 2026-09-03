# Getting started

## 1. Provide Temporal

When the host already supplies `globalThis.Temporal`, import temday directly:

```ts
import temday from 'temday';

temday('2026-08-31').add(1, 'day').format('YYYY-MM-DD');
// 2026-09-01
```

For environments without Temporal, temday exposes an opt-in bundled fallback:

```ts
import 'temday/polyfill';
import temday from 'temday';
```

The polyfill entry never overwrites an existing `globalThis.Temporal`.

## 2. Work with immutable values

Every operation creates a new value:

```ts
const start = temday('2024-01-31');
const next = start.add(1, 'month');

start.format('YYYY-MM-DD'); // 2024-01-31
next.format('YYYY-MM-DD');  // 2024-02-29
```
