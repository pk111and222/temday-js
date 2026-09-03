# CustomParseFormat

为非 ISO 字符串提供格式化解析，且不进入根包。

```ts
import customParseFormat from 'temday/plugin/customParseFormat';

temday.extend(customParseFormat);
temday('31/08/2026', 'DD/MM/YYYY').format('YYYY-MM-DD'); // 2026-08-31
```

```ts
temday('2026-08-31 13:04', 'YYYY-MM-DD HH:mm').format('HH:mm'); // 13:04
temday('2026-8-31', 'YYYY-MM-DD', undefined, true).isValid(); // false，严格模式要求补零
```

::: warning 边界

它是数值 token 解析器，不解析自然语言月份。格式不匹配会得到 invalid；日期字段溢出遵循 Temporal 的限制语义，例如 `31/02/2026` 会被限制到二月最后一天，不应用它做业务日期校验。
:::
