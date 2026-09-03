# Comparison and diff

## Is before {#is-before}

```ts
const a = temday('2024-01-01');
const b = temday('2024-01-02T12:00:00');

a.isBefore(b);
```

Comparison methods accept an optional unit. With a unit, values are compared at that calendar boundary.

## Is same {#is-same}

```ts
a.isSame('2024-01-01T23:00:00', 'day');
```

## Is after {#is-after}

```ts
b.isAfter(a, 'day');
```

## Diff {#diff}

```ts
const a = temday('2024-01-01T00:00:00');
const b = temday('2024-01-02T12:00:00');

b.diff(a, 'day');
b.diff(a, 'day', true);
```

`diff` truncates toward zero by default; pass `true` for a floating-point result. It supports milliseconds through years.

For inclusive and range checks, install `isBetween`, `isSameOrAfter`, or `isSameOrBefore` from their independent plugin entries.

## Is a temday {#is-a-temday}

```ts
temday.isTemday(temday()); // true
temday.isTemday(new Date()); // false
```
