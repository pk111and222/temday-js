# Ranges and quick checks

Install query helpers only when you need them. They remain outside the core bundle.

```ts
import isBetween from 'temday-js/plugin/isBetween';
import isSameOrAfter from 'temday-js/plugin/isSameOrAfter';
import isSameOrBefore from 'temday-js/plugin/isSameOrBefore';
import isToday from 'temday-js/plugin/isToday';

temday.extend(isBetween)
  .extend(isSameOrAfter)
  .extend(isSameOrBefore)
  .extend(isToday);
```

## Is between {#is-between}

```ts
const launch = temday('2026-09-01');

launch.isBetween('2026-09-01', '2026-10-01');       // false: () by default
launch.isBetween('2026-09-01', '2026-10-01', null, '[)'); // true
```

`isBetween` accepts `()`, `[]`, `[)`, and `(]`. Its optional third argument is
the comparison unit, just like `isBefore`, `isAfter`, and `isSame`.

## Is same or before {#is-same-or-before}

```ts
const today = temday();

today.isSameOrBefore('2026-09-30', 'day');
```

## Is same or after {#is-same-or-after}

```ts
today.isSameOrAfter('2026-09-01', 'day');
```

## Is leap year {#is-leap-year}

```ts
import isLeapYear from 'temday-js/plugin/isLeapYear';

temday.extend(isLeapYear);
temday('2024-02-29').isLeapYear(); // true
```

`isTomorrow` and `isYesterday` are available as separate plugin entries when
those checks are useful.
