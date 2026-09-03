# More plugins

These independent plugins add optional APIs. Install only the behavior your application needs.

## Comparisons and weeks

```ts
import isBetween from 'temday-js/plugin/isBetween';
import isSameOrAfter from 'temday-js/plugin/isSameOrAfter';
import isSameOrBefore from 'temday-js/plugin/isSameOrBefore';
import weekday from 'temday-js/plugin/weekday';
import weekYear from 'temday-js/plugin/weekYear';

temday.extend(isBetween).extend(isSameOrAfter).extend(isSameOrBefore);
temday.extend(weekday).extend(weekYear);
```

`isBetween` accepts `()`, `[]`, `[)`, and `(]` boundary strings. `weekday()`
uses the installed locale provider's first-day-of-week setting; it starts on
Sunday when no locale provider is installed.

## Input and projections

```ts
import objectSupport from 'temday-js/plugin/objectSupport';
import arraySupport from 'temday-js/plugin/arraySupport';
import bigIntSupport from 'temday-js/plugin/bigIntSupport';
import toArray from 'temday-js/plugin/toArray';
import toObject from 'temday-js/plugin/toObject';

temday.extend(objectSupport).extend(arraySupport).extend(bigIntSupport);
temday.extend(toArray).extend(toObject);

temday({ year: 2026, month: 7, date: 31 });
temday([2026, 7, 31]);
temday(1000n);
```

Object and array month values follow temday: January is `0`. BigInt input only
accepts safe epoch-millisecond values.

## Locale updates and mutable compatibility

```ts
import localeData from 'temday-js/plugin/localeData';
import updateLocale from 'temday-js/plugin/updateLocale';
import badMutable from 'temday-js/plugin/badMutable';

temday.extend(localeData).extend(updateLocale);
temday.updateLocale('en', { weekStart: 1, yearStart: 4 });

temday.extend(badMutable);
```

`badMutable` changes temday's default immutability. Use it only when a module
requires mutable compatibility behavior.

Other independent entries include `minMax`, `preParsePostFormat`, `isLeapYear`,
`dayOfYear`, `pluralGetSet`, `buddhistEra`, `isToday`, `isTomorrow`,
`isYesterday`, and `negativeYear`.
