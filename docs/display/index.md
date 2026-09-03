# Formatting and conversion

The core formatter only contains numeric tokens, so it does not carry locale data.

```ts
const value = temday('2024-08-05T13:04:09.007Z');

value.format('YYYY-MM-DD HH:mm:ss.SSS Z');
// 2024-08-05 13:04:09.007 +00:00
```

| Group | Tokens |
| --- | --- |
| Year, month, day | `YYYY`, `YY`, `M`, `MM`, `D`, `DD` |
| Time | `H`, `HH`, `h`, `hh`, `m`, `mm`, `s`, `ss`, `SSS` |
| Offset and meridiem | `Z`, `ZZ`, `A`, `a` |

Bracket text is emitted literally: `[Today is] YYYY`.

## Unix milliseconds {#unix-milliseconds}

```ts
value.valueOf();
```

## Unix timestamp {#unix-seconds}

`unix()` returns epoch seconds, truncated toward zero.

## As JavaScript Date {#as-javascript-date}

`toDate()` returns a native `Date` for the same instant.

## As JSON {#as-json}

`toJSON()` returns an ISO string for a valid value and `null` for an invalid one.

## As ISO 8601 string {#as-iso-8601-string}

`toISOString()` returns an ISO-8601 instant string.

## As string {#as-string}

`toString()` follows native `Date#toUTCString()` output.

## As array {#as-array}

Install `toArray` for `toArray()`, which returns `[year, month, date, hour, minute, second, millisecond]` with a zero-based month.

## As object {#as-object}

Install `toObject` for `toObject()`, which returns named date and time fields.

Named months, weekdays, `Q`, `Do`, and localized aliases are opt-in. See [Intl-first internationalization](/display/i18n) and [localized and advanced tokens](/display/plugins).
