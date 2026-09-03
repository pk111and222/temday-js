# Object, array, and bigint input

Object, array, and `bigint` inputs are independent parser plugins. They affect only the factory that installs them.

## Object input {#object-input}

```ts
import objectSupport from 'temday/plugin/objectSupport';

temday.extend(objectSupport);
temday({ year: 2026, month: 7, date: 31, hour: 13, minute: 4 });
temday({ y: 2026, M: 7, D: 31, h: 13, m: 4 });
```

`month` / `M` remain zero-based. Prefer `date` / `D` for the day of the month to avoid confusing it with weekday semantics.

## Array input {#array-input}

```ts
import arraySupport from 'temday/plugin/arraySupport';

temday.extend(arraySupport);
temday([2026, 7, 31, 13, 4, 5, 6]);
// [year, monthIndex, date, hour, minute, second, millisecond]
```

Omitted time fields default to zero; the month is zero-based.

## bigint epochs

```ts
import bigIntSupport from 'temday/plugin/bigIntSupport';

temday.extend(bigIntSupport);
temday(1_788_181_445_000n);
```

Only epoch milliseconds that can safely become a JavaScript `number` are accepted. Larger values become invalid instances.
