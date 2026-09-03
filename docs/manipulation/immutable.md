# Immutability and collections

Every core operation returns a new instance.

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
temday.min('2026-08-31', '2026-08-01').format('YYYY-MM-DD');
```

Invalid values are ignored. If no valid input remains, the result is invalid.

## BadMutable compatibility mode

```ts
import badMutable from 'temday/plugin/badMutable';

temday.extend(badMutable);

const value = temday('2026-08-31');
value.add(1, 'day') === value; // true
```

This changes `add`, `subtract`, `startOf`, `endOf`, and `set` to mutate in place. Use it only where mutable behavior is required; new code should keep the default immutable model.
