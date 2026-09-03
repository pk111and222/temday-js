# Core API

## Factory

```ts
import temday from 'temday';

const value = temday(input?);
const unix = temday.unix(seconds);
const same = temday.isTemday(value);
```

The core accepts native/ISO-oriented inputs. Format-string parsing is provided by the separate CustomParseFormat entry.

## Value methods

| Group | Methods |
| --- | --- |
| Validation and conversion | `isValid`, `clone`, `valueOf`, `unix`, `toDate`, `toISOString`, `toJSON`, `toString` |
| Calendar arithmetic | `add`, `subtract`, `startOf`, `endOf` |
| Read and write | `get`, `set`, `year`, `month`, `date`, `day`, `hour`, `minute`, `second`, `millisecond`, `daysInMonth` |
| Comparison | `isBefore`, `isAfter`, `isSame`, `diff` |
| Output | `format` |

Month getters and setters use temday indexing: January is `0`.

## Formatting tokens

The locale-free core supports numeric tokens only:

```text
YYYY YY M MM D DD H HH h hh m mm s ss SSS Z ZZ A a
```

Use bracket literals for fixed text:

```ts
temday('2024-08-05T13:04:09Z').format('[Today is] YYYY');
// Today is 2024
```

Named months and weekdays, locale aliases, ordinals, quarters, and week-year tokens are outside the core and available through separate entries.
