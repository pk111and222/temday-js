# 输入兼容

对象、数组和 `bigint` 不会进入默认解析器。按需安装对应插件后，它们会加入当前 factory 的解析管线。

## 对象输入 {#object-input}

```ts
import objectSupport from 'temday-js/plugin/objectSupport';

temday.extend(objectSupport);

temday({ year: 2026, month: 7, date: 31, hour: 13, minute: 4 });
temday({ y: 2026, M: 7, D: 31, h: 13, m: 4 });
```

`month` / `M` 仍为零基。为避免和星期概念混淆，请用 `date` / `D` 表示月中的日期。

## 数组输入 {#array-input}

```ts
import arraySupport from 'temday-js/plugin/arraySupport';

temday.extend(arraySupport);
temday([2026, 7, 31, 13, 4, 5, 6]);
// [year, monthIndex, date, hour, minute, second, millisecond]
```

省略的时间字段默认为零；月份依旧为零基。

## bigint 时间戳

```ts
import bigIntSupport from 'temday-js/plugin/bigIntSupport';

temday.extend(bigIntSupport);
temday(1_788_181_445_000n);
```

只接受可安全转换为 JavaScript `number` 的 epoch 毫秒。超出安全整数范围会得到 invalid 实例。
