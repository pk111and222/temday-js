# isBetween

提供范围比较与开闭区间控制。

```ts
import isBetween from 'temday-js/plugin/isBetween';

temday.extend(isBetween);
temday('2026-08-31').isBetween('2026-08-01', '2026-09-01'); // true
temday('2026-08-01').isBetween('2026-08-01', '2026-09-01', null, '[)'); // true
```

```ts
const release = temday('2026-08-31T12:00');
release.isBetween('2026-08-01', '2026-09-01', 'day');
release.isBetween('2026-08-31', '2026-09-01'); // true
```

::: warning 边界

默认边界是开区间 `()`，起止点不包含在内；不要忽略第四个边界参数。任何一端无效时结果为 `false`，不是异常。
:::
