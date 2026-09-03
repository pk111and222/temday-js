# Differences from Day.js

temday is an independent date-time library built on `Temporal` and `Intl`. It uses a familiar fluent API while relying on platform-native date-time and internationalization primitives. This page records the deliberate boundaries when migrating from Day.js.

## Supported compatibility additions

Custom-format parsing supports strict numeric parsing, AM/PM and numeric offsets; `temday.tz(value, format, zone)` supports formatted zoned input. `objectSupport` accepts shorthand and plural keys and supports object `set`, `add`, and `subtract`. UTC formatting emits `Z`, `utc(true)` is available, and `bigIntSupport` also enables `temday.unix(bigint)`.

`advancedFormat` adds `k` and `kk`; `calendar(null, formats)` is valid; ISO serialization consistently includes milliseconds. Duration provides component getters, `format`, arithmetic, and `temday.isDuration`.

## Parsing

temday rejects overflow dates instead of normalizing them:

```ts
temday('2022-01-33').isValid(); // false
temday('1970-00-00', 'YYYY-MM-DD').isValid(); // false
```

`customParseFormat` parses numeric tokens, AM/PM, and numeric offsets. It does not parse localized month names such as `MMMM`; convert those names to numeric input before parsing.

## Internationalization

temday uses `Intl` providers rather than shipping Day.js-style locale modules. There is no `temday-js/locale/zh-cn`, browser locale UMD, or static `temday.months()`, `temday.weekdays()`, and `temday.localeData()` helpers.

Install `localeData` and use BCP 47 tags on an instance or Context:

```ts
temday('2026-08-31').locale('zh-CN').localeData().months();
```

`localizedFormat` delegates `L`, `LT`, and related tokens to `Intl`; its punctuation and ordering are not guaranteed to match a Day.js locale character-for-character.

## Plugin loading and instance types

Plugins are module entry points, not standalone global UMD plugin files:

```ts
import utc from 'temday-js/plugin/utc';
temday.extend(utc);
```

Use `temday.isTemday(value)`, not `value instanceof temday`, to identify an instance. The full package has a versioned UMD build for plain browser pages.

## Global customization

temday does not register arbitrary locale objects or support Day.js `updateLocale(...calendar)` templates. Pass calendar text per call instead:

```ts
value.calendar(reference, { sameDay: '[Today] HH:mm' });
```

Relative-time thresholds and rounding are not global configuration. Keep product-specific threshold and translation policies in the application layer.

## Duration and localized display

Duration values are immutable: there is no `duration.clone()` or per-duration `.locale()`. `humanize()` uses `Intl.RelativeTimeFormat`, so it is intentionally not an exact copy of every Day.js locale template. Use application i18n when wording, pluralization, or threshold policy must be fixed.
