# 范围与快捷判断

只有在需要时才安装查询辅助插件；它们不会进入核心包。

```ts
import isBetween from 'temday/plugin/isBetween';
import isSameOrAfter from 'temday/plugin/isSameOrAfter';
import isSameOrBefore from 'temday/plugin/isSameOrBefore';
import isToday from 'temday/plugin/isToday';

temday.extend(isBetween)
  .extend(isSameOrAfter)
  .extend(isSameOrBefore)
  .extend(isToday);
```

## Is Between {#is-between}

```ts
const launch = temday('2026-09-01');

launch.isBetween('2026-09-01', '2026-10-01');       // 默认 ()，因此为 false
launch.isBetween('2026-09-01', '2026-10-01', null, '[)'); // true
```

`isBetween` 接受 `()`、`[]`、`[)`、`(]`。可选的第三个参数是比较单位，语义与
`isBefore`、`isAfter`、`isSame` 一致。

## Is Same or Before {#is-same-or-before}

```ts
const today = temday();

today.isSameOrBefore('2026-09-30', 'day');
```

## Is Same or After {#is-same-or-after}

```ts
today.isSameOrAfter('2026-09-01', 'day');
```

## Is Leap Year {#is-leap-year}

```ts
import isLeapYear from 'temday/plugin/isLeapYear';

temday.extend(isLeapYear);
temday('2024-02-29').isLeapYear(); // true
```

需要时可再独立安装 `isTomorrow` 与 `isYesterday`。
