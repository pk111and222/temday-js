# 时区

根工厂使用宿主时区。需要稳定、隔离的时区语义时，创建 Context 工厂。

```ts
import { createTemday } from 'temday-js/context';

const newYork = createTemday({ timeZone: 'America/New_York' });
const before = newYork('2024-03-10T01:30:00');

before.add(1, 'hour').format('YYYY-MM-DD HH:mm Z');
// 2024-03-10 03:30 -04:00
```

每个 `createTemday` 工厂各自持有时区和插件安装状态；它不会修改根工厂，也不会影响其他 Context。

Temporal 负责 DST 与日历规则，temday 不会通过 `Date` 回退来模拟时区计算。
