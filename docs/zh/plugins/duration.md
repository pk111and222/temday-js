# Duration

创建、计算和格式化时长；时长入口不进入核心日期包。

```ts
import duration from 'temday/plugin/duration';

temday.extend(duration);
temday.duration({ hour: 1, minute: 30 }).as('minute'); // 90
temday.duration('PT1H30M').toISOString(); // PT1H30M
```

```ts
const travel = temday.duration(90, 'minute').add(30, 'minute');
travel.as('hour'); // 2
travel.humanize(); // 2 hours
```

```ts
const value = temday.duration({ years: 1, months: 2, days: 3, hours: 4, minutes: 5 });

value.years();       // 1
value.months();      // 2
value.days();        // 3
value.asDays();      // 总天数（近似换算）
value.get('hours');  // 4，残余小时
value.format('YYYY-MM-DDTHH:mm:ss');
temday.duration(1, 'day').add(temday.duration(2, 'day'));
temday.isDuration(value); // true
```

::: warning 边界

`milliseconds()`、`seconds()`、`minutes()` 等返回当前单位的残余量；总量请使用 `asMilliseconds()`、`asSeconds()` 等。`month` 与 `year` 的时长换算使用固定近似值，不能替代实际日历运算；涉及“下个月”或 DST 的时间点请在日期实例上使用 `add`。`humanize()` 采用 `Intl`，不保证复刻 temday 的每种语言模板。
:::
