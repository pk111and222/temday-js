# advancedFormat

启用季度、序数与 epoch 等高级格式 token。

```ts
import advancedFormat from 'temday/plugin/advancedFormat';

temday.extend(advancedFormat);
temday('2026-08-31').format('Q Do k kk X x');
```

```ts
temday('2026-01-01').format('Q'); // 1
temday('2026-08-31').format('Do'); // 31st（默认英文序数）
temday('2026-08-31T00:00').format('k kk'); // 24 24
```

::: warning 边界

`Do` 的非英文序数需要 locale provider 配合；`k` / `kk` 使用 1–24 小时制，零点是 `24`。`Q`、`Do`、`k`、`kk`、`X`、`x` 只用于格式化，不是可解析输入 token。
:::
