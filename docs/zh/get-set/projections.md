# 投影、复数方法与日历判断

这些方法都是轻量独立插件，适合适配表单、序列化。

```ts
import toArray from 'temday/plugin/toArray';
import toObject from 'temday/plugin/toObject';
import pluralGetSet from 'temday/plugin/pluralGetSet';
import isLeapYear from 'temday/plugin/isLeapYear';

temday.extend(toArray).extend(toObject).extend(pluralGetSet).extend(isLeapYear);
```

## 投影

```ts
const value = temday('2026-08-31T13:04:05.006');

value.toArray();
// [2026, 7, 31, 13, 4, 5, 6]

value.toObject();
// { years: 2026, months: 7, date: 31, hours: 13, minutes: 4, seconds: 5, milliseconds: 6 }
```

`toArray()` 的月份为零基，与 `month()` 保持一致。

## 复数别名与闰年

```ts
value.years();
value.months(0).dates(1).hours(9);
temday('2024-02-01').isLeapYear(); // true
```

`pluralGetSet` 提供 `years`、`months`、`dates`、`days`、`hours`、`minutes`、`seconds`、`milliseconds`，它们分别是同名单数方法的别名。
