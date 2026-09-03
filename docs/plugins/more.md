# More plugins

These independent plugins add optional APIs. Install only the behavior your application needs.

## Comparisons and weeks

```ts
import isBetween from 'temday/plugin/isBetween';
import isSameOrAfter from 'temday/plugin/isSameOrAfter';
import isSameOrBefore from 'temday/plugin/isSameOrBefore';
import weekday from 'temday/plugin/weekday';
import weekYear from 'temday/plugin/weekYear';

temday.extend(isBetween).extend(isSameOrAfter).extend(isSameOrBefore);
temday.extend(weekday).extend(weekYear);
```

`isBetween` accepts `()`, `[]`, `[)`, and `(]` boundary strings. `weekday()`
uses the installed locale provider's first-day-of-week setting; it starts on
Sunday when no locale provider is installed.

## Input and projections

```ts
import objectSupport from 'temday/plugin/objectSupport';
import arraySupport from 'temday/plugin/arraySupport';
import bigIntSupport from 'temday/plugin/bigIntSupport';
import toArray from 'temday/plugin/toArray';
import toObject from 'temday/plugin/toObject';

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
import localeData from 'temday/plugin/localeData';
import updateLocale from 'temday/plugin/updateLocale';
import badMutable from 'temday/plugin/badMutable';

temday.extend(localeData).extend(updateLocale);
temday.updateLocale('en', { weekStart: 1, yearStart: 4 });

temday.extend(badMutable);
```

`badMutable` changes temday's default immutability. Use it only when a module
requires mutable compatibility behavior.

Other independent entries include `minMax`, `preParsePostFormat`, `isLeapYear`,
`dayOfYear`, `pluralGetSet`, `buddhistEra`, `isToday`, `isTomorrow`,
`isYesterday`, and `negativeYear`.
