# weekOfYear

提供区域周序号与一年中的周数；可与 `localeData` 配合使用周起始日。

```ts
import weekOfYear from 'temday/plugin/weekOfYear';

temday.extend(weekOfYear);
temday('2021-01-03').week(); // 2
temday('2021-01-03').weeksInYear(); // 53
```

```ts
temday('2021-01-03').week(3).format('YYYY-MM-DD'); // 2021-01-10
```

::: warning 边界

区域周的第一天由 `localeData` 决定；未安装它时默认周日。不要把区域周号与 ISO 周号混用，ISO 请使用 `isoWeek`。
:::
