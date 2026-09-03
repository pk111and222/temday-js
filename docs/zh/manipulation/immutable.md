# 不可变性与集合

temday的每一次改变都返回新实例；这让链式计算可预测，也避免共享状态。

```ts
const start = temday('2026-08-31');
const next = start.add(1, 'day');

start.format('YYYY-MM-DD'); // 2026-08-31
next.format('YYYY-MM-DD');  // 2026-09-01
```

## Maximum {#maximum}

```ts
import minMax from 'temday/plugin/minMax';

temday.extend(minMax);

temday.max([temday('2026-08-31'), temday('2026-09-01')]);
```

## Minimum {#minimum}

```ts
temday.min('2026-08-31', '2026-08-01').format('YYYY-MM-DD'); // 2026-08-01
```

无效值会被忽略；若没有有效输入，返回 invalid 实例。

## BadMutable（可变兼容模式）

```ts
import badMutable from 'temday/plugin/badMutable';

temday.extend(badMutable);

const value = temday('2026-08-31');
value.add(1, 'day') === value; // true
```

该插件会让 `add`、`subtract`、`startOf`、`endOf`、`set` 原地更新，仅在模块需要可变行为时安装；新代码应保持默认不可变模型。
