# objectSupport

让 factory 接受 temday 风格对象输入。

```ts
import objectSupport from 'temday-js/plugin/objectSupport';

temday.extend(objectSupport);
temday({ year: 2026, month: 7, date: 31, hour: 12 });
temday({ hour: 15, minute: 10 }); // 使用当前日期
```

月份为零基。

```ts
temday({ y: 2026, M: 7, d: 31, h: 12, m: 30 });
temday({ years: 2026, months: 7, date: 31, hours: 12, minutes: 30 });
temday({ year: 2026, month: 15, day: 1 }).isValid(); // false
```

对象形式的赋值和运算同样可用：

```ts
const value = temday('2026-08-31');

value.set({ year: 2027, month: 1, day: 12 });
value.add({ months: 1, days: 2 });
value.subtract({ hours: 3, minutes: 30 });
```

::: warning 边界

对象输入中的 `date`、`D`、`d`、`day` 都表示月中的日期；月份仍然零基。只给出时间字段时，日期使用当前日期；给出年份或月份但省略日时，日期为 `1`。错误字段名不会被自动猜测，建议在业务边界自行校验对象结构。
:::
