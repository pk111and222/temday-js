# badMutable

为需要原地更新的模块提供的兼容插件。新代码不应安装它。

```ts
import badMutable from 'temday-js/plugin/badMutable';

temday.extend(badMutable);
const value = temday('2026-08-31');
value.add(1, 'day') === value; // true
```

```ts
const deadline = temday('2026-08-31');
deadline.startOf('month');
deadline.format('YYYY-MM-DD'); // 2026-08-01，原值已变化
```

::: warning 边界

它会改变 `add`、`subtract`、`startOf`、`endOf` 与 `set` 的默认不可变语义。不要在新模块或共享状态对象中安装；仅限需要可变行为的局部 factory。
:::
