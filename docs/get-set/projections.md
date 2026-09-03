# Projections and plural methods

These lightweight plugins are useful for forms and serialization.

```ts
import toArray from 'temday-js/plugin/toArray';
import toObject from 'temday-js/plugin/toObject';
import pluralGetSet from 'temday-js/plugin/pluralGetSet';
import isLeapYear from 'temday-js/plugin/isLeapYear';

temday.extend(toArray).extend(toObject).extend(pluralGetSet).extend(isLeapYear);
```

## Projections

```ts
const value = temday('2026-08-31T13:04:05.006');

value.toArray();
// [2026, 7, 31, 13, 4, 5, 6]

value.toObject();
// { years: 2026, months: 7, date: 31, hours: 13, minutes: 4, seconds: 5, milliseconds: 6 }
```

The month in `toArray()` is zero-based, like `month()`.

## Plural aliases and leap years

```ts
value.years();
value.months(0).dates(1).hours(9);
temday('2024-02-01').isLeapYear(); // true
```

`pluralGetSet` provides `years`, `months`, `dates`, `days`, `hours`, `minutes`, `seconds`, and `milliseconds` as aliases of their singular methods.
