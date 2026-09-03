# 显示

## Format {#format}

核心格式化只包含数值 token，因此不会携带 locale 数据。

```ts
const value = temday('2024-08-05T13:04:09.007Z');

value.format('YYYY-MM-DD HH:mm:ss.SSS Z');
// 2024-08-05 13:04:09.007 +00:00
```

| 类型 | Token |
| --- | --- |
| 年月日 | `YYYY`、`YY`、`M`、`MM`、`D`、`DD` |
| 时分秒 | `H`、`HH`、`h`、`hh`、`m`、`mm`、`s`、`ss`、`SSS` |
| 偏移与午别 | `Z`、`ZZ`、`A`、`a` |

方括号中的文本按字面量输出：`[Today is] YYYY`。

## Unix 时间戳（毫秒） {#unix-milliseconds}

```ts
value.valueOf();      // 毫秒时间戳
```

## Unix 时间戳 {#unix-seconds}

`unix()` 返回向零截断的秒级时间戳。

```ts
temday('1970-01-01T00:00:01.999Z').unix(); // 1
```

## As JavaScript Date {#as-javascript-date}

`toDate()` 返回对应 instant 的原生 `Date`。

```ts
temday('2026-08-31T12:00:00Z').toDate();
```

## As JSON {#as-json}

`toJSON()` 对有效值返回 ISO 字符串，对 invalid 值返回 `null`。

```ts
temday('2026-08-31T12:00:00Z').toJSON();
// "2026-08-31T12:00:00.000Z"
```

## As ISO 8601 String {#as-iso-8601-string}

`toISOString()` 返回 ISO-8601 instant 字符串。

```ts
temday('2026-08-31T12:00:00Z').toISOString();
// "2026-08-31T12:00:00.000Z"
```

## As String {#as-string}

`toString()` 返回原生 `Date#toUTCString()` 形式的字符串。

```ts
temday('2026-08-31T12:00:00Z').toString();
```

## As Array {#as-array}

安装 `toArray` 插件后可使用 `toArray()`；它返回 `[year, month, date, hour, minute, second, millisecond]`，月份为零基。

```ts
import toArray from 'temday-js/plugin/toArray';
temday.extend(toArray);
temday('2026-08-31T12:34:56.789').toArray();
```

## As Object {#as-object}

安装 `toObject` 插件后可使用 `toObject()`；它返回命名的年、月、日和时间字段。

```ts
import toObject from 'temday-js/plugin/toObject';
temday.extend(toObject);
temday('2026-08-31T12:34:56.789').toObject();
```

::: warning invalid 值的转换

对 `temday('invalid')`：`format()` 返回 `Invalid Date`，`valueOf()` 返回 `NaN`，`toJSON()` 返回 `null`；但 `toISOString()` 会抛出 `RangeError`。发送 API 请求前应先检查 `isValid()`。
:::

命名月份、星期、`Q`、`Do` 和本地化格式别名均属于可选入口，见 [本地化与高级 token](/zh/display/plugins)。
