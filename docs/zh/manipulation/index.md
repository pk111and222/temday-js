# 加减与边界

## Add {#add}

`add` 和 `subtract` 使用 Temporal 日历运算。

```ts
const value = temday('2024-01-31T10:00:00');

value.add(1, 'month').format('YYYY-MM-DD'); // 2024-02-29
value.subtract(1, 'day').format('YYYY-MM-DD');
```

支持 `year`、`month`、`week`、`day`、`hour`、`minute`、`second` 与 `millisecond`，也支持常见的单复数及缩写。

```ts
const value = temday('2026-08-31T10:30:00');

value.add(2, 'weeks');
value.add(90, 'minute');
value.subtract(1, 'year');
value.add(1, 'banana').isValid(); // false：未知单位不会被猜测
```

## Subtract {#subtract}

`subtract(amount, unit)` 等价于 `add(-amount, unit)`，并且仍返回新实例。

```ts
temday('2026-08-31').subtract(2, 'week').format('YYYY-MM-DD'); // 2026-08-17
temday('2026-08-31').subtract(-1, 'day').format('YYYY-MM-DD'); // 2026-09-01
```

## Start of Unit of Time {#start-of}

```ts
const value = temday('2024-06-15T13:14:15.123');

value.startOf('month').format('YYYY-MM-DD HH:mm:ss.SSS');
// 2024-06-01 00:00:00.000

// 未知单位会抛出 RangeError，应该在调用前校验动态输入
value.startOf('banana');

```

## End of Unit of Time {#end-of}

```ts
value.endOf('month').format('YYYY-MM-DD HH:mm:ss.SSS');
// 2024-06-30 23:59:59.999
```

`week` 以周日作为起点，与 temday 默认行为一致。

所有核心操作保持不可变；需要兼容可变写法时，可选择安装 `badMutable`。`Duration`、`Calendar`、周与季度等扩展操作见[扩展操作](/zh/manipulation/extensions)，`min`/`max` 与可变兼容层见[不可变性与集合](/zh/manipulation/immutable)。

::: warning 动态单位

`add` 与 `subtract` 的未知单位会返回 invalid 实例；`startOf`、`endOf` 与 `diff` 的未知单位会抛出 `RangeError`。不要直接把未校验的用户输入传给这些 API。
:::
