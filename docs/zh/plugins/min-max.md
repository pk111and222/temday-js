# minMax

提供 factory 级别的 `min()` 与 `max()`。

```ts
import minMax from 'temday-js/plugin/minMax';

temday.extend(minMax);
temday.min('2026-08-31', '2026-08-01').format('YYYY-MM-DD'); // 2026-08-01
temday.max(['2026-08-31', '2026-09-01']).format('YYYY-MM-DD'); // 2026-09-01
```

```ts
temday.min(temday('invalid'), '2026-08-31').format('YYYY-MM-DD'); // 2026-08-31
temday.max([]).isValid(); // false
```

::: warning 边界

无效值会被忽略；所有输入都无效或数组为空时，返回 invalid 实例。不要把 `min()` / `max()` 的结果直接转 ISO，先检查 `isValid()`。
:::
