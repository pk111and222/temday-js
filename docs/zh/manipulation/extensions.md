# 扩展操作：Duration、Calendar、周与季度

## Duration

```ts
import duration from 'temday-js/plugin/duration';

temday.extend(duration);

const value = temday.duration({ hour: 1, minute: 30 });
value.as('minute');       // 90
value.add(30, 'minute');
value.humanize();
value.toISOString();
```

输入可以是数值与单位、对象或 ISO-8601 duration 字符串。Duration 是独立不可变值，不进入核心日期实例。

```ts
temday.duration(90, 'minute').as('hour'); // 1.5
temday.duration('P2DT3H').toISOString();  // P2DT3H
```

## Calendar

```ts
import calendar from 'temday-js/plugin/calendar';

temday.extend(calendar);

temday().calendar();
temday('2026-09-01').calendar('2026-08-31'); // Tomorrow at 00:00
temday('2026-09-01').calendar('2026-08-31', {
  nextDay: '[明天] HH:mm',
});
```

可传入 `sameDay`、`nextDay`、`nextWeek`、`lastDay`、`lastWeek`、`sameElse` 六种格式；每项可以是格式字符串或返回字符串的函数。

## 周与季度

```ts
import weekOfYear from 'temday-js/plugin/weekOfYear';
import isoWeek from 'temday-js/plugin/isoWeek';
import quarterOfYear from 'temday-js/plugin/quarterOfYear';

temday.extend(weekOfYear).extend(isoWeek).extend(quarterOfYear);

temday('2021-01-03').week();       // 区域周
temday('2021-01-04').isoWeek();    // ISO 周
temday('2026-08-31').quarter();    // 3
```

`week()` 使用 locale provider 的一周起始日；没有 localeData 时使用周日。ISO 方法还包括 `isoWeekday()` 与 `isoWeeksInYear()`。
