# Add, subtract, and boundaries

## Add {#add}

`add` and `subtract` use Temporal calendar arithmetic, so month ends and leap years stay correct.

```ts
const value = temday('2024-01-31T10:00:00');

value.add(1, 'month').format('YYYY-MM-DD'); // 2024-02-29
value.subtract(1, 'day');
value.add(2, 'weeks');
value.add(90, 'minute');
value.subtract(1, 'year');
value.add(1, 'banana').isValid(); // false: unknown units are not guessed
```

Supported units are `year`, `month`, `week`, `day`, `hour`, `minute`, `second`, and `millisecond`, with common plurals and shorthands.

## Subtract {#subtract}

`subtract(amount, unit)` is equivalent to `add(-amount, unit)` and still returns a new value.

```ts
temday('2026-08-31').subtract(2, 'week').format('YYYY-MM-DD'); // 2026-08-17
temday('2026-08-31').subtract(-1, 'day').format('YYYY-MM-DD'); // 2026-09-01
```

## Start of unit {#start-of}

```ts
const value = temday('2024-06-15T13:14:15.123');

value.startOf('month').format('YYYY-MM-DD HH:mm:ss.SSS');
// 2024-06-01 00:00:00.000

// Unknown units throw RangeError. Validate dynamic input first.
value.startOf('banana');
```

## End of unit {#end-of}

```ts
value.endOf('month').format('YYYY-MM-DD HH:mm:ss.SSS');
// 2024-06-30 23:59:59.999
```

`week` starts on Sunday, matching temday defaults. Core operations are immutable; see [immutability and collections](/manipulation/immutable) for `min`, `max`, and the opt-in `badMutable` compatibility mode. See [extended operations](/manipulation/extensions) for duration, calendar labels, and week/quarter helpers.

::: warning Dynamic units

Unknown units in `add` and `subtract` return an invalid value. Unknown units in `startOf`, `endOf`, and `diff` throw `RangeError`. Do not pass unchecked user input to these APIs.
:::
