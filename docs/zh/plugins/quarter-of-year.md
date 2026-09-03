# quarterOfYear

提供季度的读取与赋值。

```ts
import quarterOfYear from 'temday/plugin/quarterOfYear';

temday.extend(quarterOfYear);
temday('2026-08-31').quarter(); // 3
temday('2026-08-31').quarter(1).format('YYYY-MM-DD'); // 2026-02-28
```

```ts
temday('2024-05-31').quarter(1).format('YYYY-MM-DD'); // 2024-02-29，月末会被限制
```

::: warning 边界

只有 `1` 到 `4` 具有业务含义；`quarter(5)` 会被底层字段限制，不表示“下一季度”。核心 `add()` 不接受 `quarter` 单位，请显式计算目标季度或按月 `add(3, 'month')`。
:::
