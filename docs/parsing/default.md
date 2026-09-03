# Parse

The default parser accepts native values and ISO-shaped input. Format strings,
objects, and arrays are opt-in. This single example covers every input in this section.

```ts
import 'temday-js/polyfill';
import temday from 'temday-js';
import customParseFormat from 'temday-js/plugin/customParseFormat';
import objectSupport from 'temday-js/plugin/objectSupport';
import arraySupport from 'temday-js/plugin/arraySupport';

temday.extend(customParseFormat).extend(objectSupport).extend(arraySupport);

const now = temday();
const instant = temday(Temporal.Instant.from('2026-08-31T12:00:00Z'));
const plainDate = temday(Temporal.PlainDate.from('2026-08-31'));
const iso = temday('2026-08-31T12:00:00+08:00');
const localIso = temday('2026-08-31T12:00:00');
const formatted = temday('31/08/2026', 'DD/MM/YYYY');
const milliseconds = temday(1_788_181_445_000);
const seconds = temday.unix(1_788_181_445);
const date = temday(new Date('2026-08-31T12:00:00Z'));
const utc = temday('2026-08-31T12:00:00Z');
const object = temday({ year: 2026, month: 7, date: 31, hour: 12 });
const array = temday([2026, 7, 31, 12]);
const copied = temday(now);
```

## Current time {#current-time}
`temday()` reads the current instant.

## Temporal {#temporal}
Supports `Instant`, `ZonedDateTime`, `PlainDateTime`, and `PlainDate`.

## String {#string}
The default parser accepts ISO strings.

## String + format {#string-format}
Requires `customParseFormat`.

## Unix timestamp {#unix-timestamp}
Numbers are milliseconds; `temday.unix()` accepts seconds.

## Date object {#date-object}
Reads `Date#valueOf()`.

## UTC {#utc-input}
ISO strings with `Z` or an offset preserve their instant.

## Object {#object-input}
Requires `objectSupport`.

## Array {#array-input}
Requires `arraySupport`.

## temday object {#temday-instance}
An existing temday value becomes a new immutable instance.
