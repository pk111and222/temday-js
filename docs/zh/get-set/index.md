# 单位与 get/set

temday 的单位读写遵循 temday 常用语义，所有赋值操作都会返回新值。月份为零基：一月是 `0`，十二月是 `11`。

```ts
const source = temday('2024-06-15T13:14:15.123');

source.year();        // 2024
source.month();       // 5，月份从 0 开始
source.date();        // 15
source.day();         // 6，星期日为 0
source.hour();        // 13
source.month(0).date(31).hour(0);
```

## 链式单位方法

| 方法 | Getter | Setter | 说明 |
| --- | --- | --- | --- |
| `year()` | 年 | `year(value)` | 日历年 |
| `month()` | `0`–`11` | `month(value)` | 月份索引 |
| `date()` | 月中的日期 | `date(value)` | `1`–`31` |
| `day()` | `0`–`6` | `day(value)` | 周日为 `0`；setter 按天偏移 |
| `hour()`、`minute()`、`second()`、`millisecond()` | 对应时间字段 | 同名 setter | 本地/工厂时区内的字段 |

`daysInMonth()` 返回当前月份的天数；它属于根 API，不需要插件。

```ts
temday('2024-02-15').daysInMonth(); // 29
```

## Millisecond {#millisecond}

`millisecond()` 读取或赋值毫秒字段。

```ts
temday('2026-08-31T12:34:56.789').millisecond(); // 789
temday('2026-08-31').millisecond(250);
temday('2026-08-31').millisecond(1000).millisecond(); // 999，超范围会被限制
```

## Second {#second}

`second()` 读取或赋值秒字段。

```ts
temday('2026-08-31T12:34:56').second(); // 56
temday('2026-08-31').second(30);
temday('2026-08-31').second(60).second(); // 59，不会进位到下一分钟
```

## Minute {#minute}

`minute()` 读取或赋值分钟字段。

```ts
temday('2026-08-31T12:34').minute(); // 34
temday('2026-08-31').minute(45);
temday('2026-08-31').minute(-1).minute(); // 0，不会借位到上一小时
```

## Hour {#hour}

`hour()` 读取或赋值小时字段。

```ts
temday('2026-08-31T12:00').hour(); // 12
temday('2026-08-31').hour(9);
temday('2026-08-31').hour(24).hour(); // 23，不会进位到下一天
```

## Date of Month {#date-of-month}

`date()` 读取或赋值月中的日期，范围为 `1`–`31`。

```ts
temday('2026-08-31').date(); // 31
temday('2026-08-31').date(1);
temday('2026-08-31').date(0).isValid(); // false
temday('2026-04-01').date(31).date(); // 30，超出月末会被限制
```

## Day of Week {#day-of-week}

`day()` 读取或赋值星期索引；周日为 `0`，setter 会按天移动日期。

```ts
temday('2026-08-31').day(); // 1，星期一
temday('2026-08-31').day(0).format('YYYY-MM-DD'); // 2026-08-30
temday('2026-08-31').day(7).format('YYYY-MM-DD'); // 2026-09-06，可跨周移动
```

## Month {#month}

`month()` 使用零基索引：一月为 `0`，十二月为 `11`。

```ts
temday('2026-08-31').month(); // 7
temday('2026-08-31').month(0).format('YYYY-MM-DD'); // 2026-01-31
temday('2026-08-31').month(-1).isValid(); // false
temday('2026-08-31').month(99).month(); // 11，超范围会被限制
```

## Year {#year}

`year()` 读取或赋值日历年。

```ts
temday('2026-08-31').year(); // 2026
temday('2026-08-31').year(2030);
temday('2026-08-31').year(Number.NaN).isValid(); // false
```

## 月份中天数 {#days-in-month}

`daysInMonth()` 返回实例所在月份的实际天数。

```ts
temday('2024-02-01').daysInMonth(); // 29
```

## Get {#get}

```ts
const value = temday('2024-06-15T13:14:15.123');

value.get('month'); // 5
```

## Set {#set}

```ts
value.set('month', 0).format('YYYY-MM-DD'); // 2024-01-15
value.set('banana', 1).isValid(); // false
```

`get('day')` 返回星期索引（周日为 `0`）；`date()` 与 `get('date')` 返回月中的日期。支持的单位为 `year`、`month`、`date`、`day`、`hour`、`minute`、`second`、`millisecond`，以及常见单复数与缩写。

区域周、ISO 周、季度、year-day 和复数方法是按需功能，见[周、季度与扩展单位](/zh/get-set/calendar)与[投影和复数方法](/zh/get-set/projections)。

::: warning setter 不是算术 API

字段 setter 会使用 Temporal 的 `constrain` 语义：`hour(24)` 会成为 `23`，而不是第二天 `00:00`；`month(99)` 会成为十二月。需要跨字段进位、借位时请使用 `add` 或 `subtract`。未知 `get` 单位会抛出 `RangeError`，未知 `set` 单位会返回 invalid 实例。
:::
