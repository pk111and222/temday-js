# 解析

解析入口遵循一个原则：默认只接受原生时间值与 ISO 形状；格式字符串、对象与数组是按需插件。下面一段代码展示本章目录中的全部输入方式。

```ts
import 'temday-js/polyfill';
import temday from 'temday-js';
import customParseFormat from 'temday-js/plugin/customParseFormat';
import objectSupport from 'temday-js/plugin/objectSupport';
import arraySupport from 'temday-js/plugin/arraySupport';
import bigIntSupport from 'temday-js/plugin/bigIntSupport';

temday.extend(customParseFormat).extend(objectSupport).extend(arraySupport).extend(bigIntSupport);

// 当前时间
const now = temday();
// Temporal：Instant / ZonedDateTime 保留 instant；PlainDate 在 factory 时区解释
const instant = temday(Temporal.Instant.from('2026-08-31T12:00:00Z'));
const plainDate = temday(Temporal.PlainDate.from('2026-08-31'));
// 字符串：带 offset 是 instant；不带 offset 按 factory 时区解释
const iso = temday('2026-08-31T12:00:00+08:00');
const localIso = temday('2026-08-31T12:00:00');
// 字符串 + 格式：需要 customParseFormat
const formatted = temday('31/08/2026', 'DD/MM/YYYY');
// Unix：数字是毫秒；unix() 接收秒
const milliseconds = temday(1_788_181_445_000);
const seconds = temday.unix(1_788_181_445);
const bigintSeconds = temday.unix(1_788_181_445n);
// Date 与 UTC 字符串
const date = temday(new Date('2026-08-31T12:00:00Z'));
const utc = temday('2026-08-31T12:00:00Z');
// 对象与数组：月份均为零基
const object = temday({ year: 2026, month: 7, date: 31, hour: 12 });
const array = temday([2026, 7, 31, 12]);
// temday 对象：复制同一个 instant，返回新实例
const copied = temday(now);

// 无效输入不会抛错，而是返回 invalid 实例
const invalid = temday('2026-02-30');
invalid.isValid(); // false
```

## 当前时间 {#current-time}

`temday()` 读取当前 instant，并按当前 factory 时区展示。

```ts
const first = temday();
const second = temday();
first.isBefore(second) || first.isSame(second); // true
temday(undefined).isValid(); // true，等同于当前时间
```

::: warning 边界

只有省略参数或传 `undefined` 才表示当前时间；`null` 不是“现在”，会得到 invalid 实例。对可测试业务逻辑，请显式传入固定时间而不是在内部多次调用 `temday()`。
:::

## Temporal {#temporal}

支持 `Temporal.Instant`、`Temporal.ZonedDateTime`、`Temporal.PlainDateTime` 与 `Temporal.PlainDate`。

```ts
const instant = Temporal.Instant.from('2026-08-31T12:00:00Z');
temday(instant).toISOString(); // 2026-08-31T12:00:00.000Z

const zoned = Temporal.ZonedDateTime.from('2026-08-31T20:00:00+08:00[Asia/Shanghai]');
temday(zoned).valueOf() === temday(instant).valueOf(); // true

const plain = Temporal.PlainDateTime.from('2026-08-31T12:00');
temday(plain); // 在当前 factory 时区解释墙上时间
```

::: warning 边界

`Instant` / `ZonedDateTime` 表示绝对时间点；`PlainDate` / `PlainDateTime` 没有时区，必须由 factory 解释。不要把两者当作同一种输入，否则跨时区时会得到不同 instant。
:::

## 字符串 {#string}

默认解析 ISO 字符串。

```ts
temday('2026-08-31').format('YYYY-MM-DD');
temday('2026-08-31T12:00:00').format('HH:mm'); // factory 时区的墙上时间
temday('2026-08-31T12:00:00+08:00').toISOString(); // 保留 +08:00 表示的 instant
```

::: warning 边界

默认解析器不接受 `31/08/2026`、`August 31, 2026` 或语言名称日期；这些值会 invalid。日期部分超出日历范围（如 `2026-02-30`）同样 invalid，不会自动滚动到三月。
:::

## 字符串 + 格式 {#string-format}

需要 `customParseFormat` 插件。

```ts
import customParseFormat from 'temday-js/plugin/customParseFormat';

temday.extend(customParseFormat);
temday('31/08/2026', 'DD/MM/YYYY').format('YYYY-MM-DD');
temday('2026-8-31', 'YYYY-MM-DD', true).isValid(); // false，严格模式要求 MM/DD 补零
```

::: warning 边界

格式插件仅解析数值 token，不接受 `MMMM`、星期名称或自然语言。格式结构不匹配、`31/02/2026` 等字段溢出都会返回 invalid；不会像 temday 的宽松解析那样把日期滚动到下个月。
:::

## Unix 时间戳 {#unix-timestamp}

数字按毫秒处理；`temday.unix()` 按秒处理。

```ts
temday(1_000).toISOString(); // 1970-01-01T00:00:01.000Z
temday.unix(1).valueOf(); // 1000
temday.unix(-1).toISOString(); // 1969-12-31T23:59:59.000Z

// 需要 bigIntSupport；仅接受安全范围内的秒值
temday.unix(1_666_311_003n);
```

::: warning 边界

不要把秒级时间戳直接传给 `temday()`：`temday(1)` 是 epoch 后 1 毫秒，而不是 1 秒。`NaN`、`Infinity` 以及超出 JavaScript 安全整数范围的数值会得到 invalid 实例。
:::

## Date 对象 {#date-object}

通过 `Date#valueOf()` 读取 epoch 毫秒。

```ts
const native = new Date('2026-08-31T12:00:00Z');
temday(native).valueOf() === native.valueOf(); // true
temday(new Date(0)).toISOString(); // 1970-01-01T00:00:00.000Z
```

::: warning 边界

无效的原生日期（`new Date('bad')`）会得到 invalid 实例。temday 读取的是 epoch 毫秒，不读取 `Date#toString()`，因此不应把格式化后的 Date 字符串再传回解析器。
:::

## UTC {#utc-input}

带 `Z` 或数值 offset 的 ISO 字符串保留其 instant。

```ts
const utc = temday('2026-08-31T12:00:00Z');
const shanghai = temday('2026-08-31T20:00:00+08:00');
utc.valueOf() === shanghai.valueOf(); // true
```

::: warning 边界

`Z` / `+08:00` 是输入 offset，不等同于安装 `utc` 或 `timezone` 插件。需要改变实例显示时区时，请安装对应插件后调用 `.utc()` 或 `.tz()`；无 offset 的字符串不会自动被当作 UTC。
:::

## 对象 {#object-input}

需要 `objectSupport` 插件。

```ts
import objectSupport from 'temday-js/plugin/objectSupport';

temday.extend(objectSupport);
temday({ year: 2026, month: 7, date: 31, hour: 12 });
temday({ y: 2026, M: 7, d: 31, h: 12, m: 30 });
temday({ years: 2026, months: 7, date: 31, hours: 12, minutes: 30 });
temday({ hour: 15, minute: 10 }); // 日期默认为当前日期
```

::: warning 边界

`month` / `M` 是零基，八月为 `7`；`month: 12` 会 invalid。对象输入中的 `date`、`D`、`d` 和 `day` 都表示月中的日；它与实例上的 `day()`（星期索引）不是同一个语义。
:::

## 数组 {#array-input}

需要 `arraySupport` 插件。

```ts
import arraySupport from 'temday-js/plugin/arraySupport';

temday.extend(arraySupport);
temday([2026, 7, 31]); // 省略时间字段时为 00:00:00.000
temday([2026, 7, 31, 12, 34, 56, 789]);
```

::: warning 边界

顺序固定为 `[year, monthIndex, date, hour, minute, second, millisecond]`，且月份零基。数组中 `monthIndex: 12`、不合法日期或无法转换为数值的字段会得到 invalid 实例。
:::

## temday 对象 {#temday-instance}
传入现有实例会得到新的不可变实例。

```ts
const original = temday('2026-08-31T12:00:00Z');
const copied = temday(original);

copied === original; // false
copied.valueOf() === original.valueOf(); // true
copied.add(1, 'day'); // 不会修改 original
```

::: warning 边界

复制 invalid temday 实例仍是 invalid。`temday.isTemday(value)` 只能识别 temday 实例；temday、Date 或伪造的同形对象都不会被当作 temday 对象。
:::

::: warning 输入边界

`null`、`undefined` 以外的未知对象、无效日期字符串、超出安全范围的 `bigint` 都不能解析为有效日期。解析失败时用 `isValid()` 判断；不要依赖 `format()` 的 `Invalid Date` 文案作为程序判断。
:::
