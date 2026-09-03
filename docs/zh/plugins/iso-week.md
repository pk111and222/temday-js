# isoWeek

提供 ISO-8601 周、周几与 ISO 年周数。

```ts
import isoWeek from 'temday-js/plugin/isoWeek';

temday.extend(isoWeek);
temday('2021-01-04').isoWeek(); // 1
temday('2021-01-04').isoWeekday(); // 1
temday('2021-01-03').isoWeekYear(); // 2020
```

```ts
temday('2021-01-04').isoWeek(2).format('YYYY-MM-DD'); // 2021-01-11
temday('2020-12-31').isoWeeksInYear(); // 53
```

::: warning 边界

`isoWeekday()` 的范围是 `1`–`7`，不同于核心 `day()` 的 `0`–`6`。`isoWeekYear()` 与 `isoWeek()` 同属 `isoWeek` 插件。
:::
