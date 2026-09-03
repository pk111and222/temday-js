# Calendar

为日期生成相对日历文案。

```ts
import calendar from 'temday-js/plugin/calendar';

temday.extend(calendar);
temday('2026-08-31T13:04').calendar('2026-08-31'); // Today at 13:04
```

```ts
temday('2026-09-01T09:00').calendar('2026-08-31', {
  nextDay: '[明天] HH:mm',
});

// null 与省略 reference 一样，均以当前时间为基准
temday().calendar(null, { sameDay: '[今天]' });
```

::: warning 边界

Calendar 文案依赖相对日期而非绝对时间；跨时区展示时请先用 `.tz()` 或 context 统一实例时区。未安装插件时没有 `calendar()` 方法。
:::
