# 查询

## Is Before {#is-before}

```ts
const a = temday('2024-01-01');
const b = temday('2024-01-02T12:00:00');

a.isBefore(b);       // true
```

比较方法接受可选单位。带单位时，会按该单位的日历边界比较。

## Is Same {#is-same}

```ts
a.isSame('2024-01-01T23:00:00', 'day'); // true
```

## Is After {#is-after}

```ts
b.isAfter(a, 'day'); // true
```

## Diff {#diff}

```ts
const a = temday('2024-01-01T00:00:00');
const b = temday('2024-01-02T12:00:00');

b.diff(a, 'day');       // 1
b.diff(a, 'day', true); // 1.5
temday('2019-01-25').diff('2018-06-05', 'month', true); // 7.645161...
```

`diff` 默认返回向零截断的整数；第三个参数为 `true` 时返回浮点值。支持毫秒、秒、分、时、日、周、月和年。

## Is a temday {#is-a-temday}

```ts
temday.isTemday(temday()); // true
temday.isTemday(new Date()); // false
```

::: warning 无效值与单位

任一比较对象无效时，`isBefore`、`isSame`、`isAfter` 都返回 `false`。`diff` 遇到无效日期返回 `NaN`，但传入未知比较单位会抛出 `RangeError`。
:::
