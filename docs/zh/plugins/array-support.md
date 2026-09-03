# arraySupport

让 factory 接受数组输入。

```ts
import arraySupport from 'temday-js/plugin/arraySupport';

temday.extend(arraySupport);
temday([2026, 7, 31, 12, 34, 56, 789]);
```

顺序为 `[year, monthIndex, date, hour, minute, second, millisecond]`。

```ts
temday([2026, 7, 31]); // 2026-08-31 00:00:00.000
temday([2026, 12, 1]).isValid(); // false，月份不能是 12
```

::: warning 边界

数组不能使用一基月份；`[2026, 0, 1]` 才是一月一日。不要把 `Date#getMonth()` 以外的一基月份直接放入数组。
:::
