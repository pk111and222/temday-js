# Weeks, quarters, and extended units

Weeks, ISO weeks, quarters, and day-of-year are independent plugins.

```ts
import weekOfYear from 'temday/plugin/weekOfYear';
import isoWeek from 'temday/plugin/isoWeek';
import quarterOfYear from 'temday/plugin/quarterOfYear';
import weekYear from 'temday/plugin/weekYear';
import weekday from 'temday/plugin/weekday';
import dayOfYear from 'temday/plugin/dayOfYear';

temday.extend(weekOfYear).extend(isoWeek).extend(quarterOfYear);
temday.extend(weekYear).extend(weekday).extend(dayOfYear);
```

| API | Getter | Setter / meaning |
| --- | --- | --- |
| `week()` | Locale week number | `week(value)` moves by whole weeks |
| `weeksInYear()` | Locale weeks in the year | No setter |
| `isoWeek()` | ISO-8601 week number | `isoWeek(value)` |
| `isoWeekday()` | Monday `1` through Sunday `7` | `isoWeekday(value)` |
| `isoWeekYear()` | ISO week-year | No setter |
| `isoWeeksInYear()` | ISO weeks in the year | No setter |
| `weekYear()` | Locale week-year | No setter |
| `weekday()` | Day relative to the locale first day | `weekday(value)` |
| `quarter()` | `1`–`4` | `quarter(value)` |
| `dayOfYear()` | Ordinal day in year | `dayOfYear(value)` |

```ts
temday('2021-01-04').isoWeek();
temday('2021-01-04').isoWeekday();
temday('2026-08-31').quarter(4);
temday('2024-01-01').dayOfYear(60); // 2024-02-29
```

`week()`, `weekday()`, and `weekYear()` use the first day from `localeData`; without it, Sunday is the first day.

## Locale weekday {#locale-weekday}

With `weekday` installed, `weekday()` is zero-based from the current locale's first day of week.

## ISO weekday {#iso-weekday}

With `isoWeek` installed, `isoWeekday()` runs from Monday `1` to Sunday `7`.

## Day of year {#day-of-year}

With `dayOfYear` installed, `dayOfYear()` reads or sets the ordinal day of the year.

## Week of year {#week-of-year}

With `weekOfYear` installed, `week()` and `weeksInYear()` use locale week rules.

## ISO week {#iso-week}

With `isoWeek` installed, `isoWeek()` reads or sets the ISO-8601 week number.

## Quarter {#quarter}

With `quarterOfYear` installed, `quarter()` reads or sets quarter `1` through `4`.

## Week year {#week-year}

With `weekOfYear` and `weekYear` installed, `weekYear()` returns the year owning the locale week.

```ts
temday.extend(weekOfYear).extend(weekYear);

temday('2018-12-30').week();     // 1
temday('2018-12-30').weekYear(); // 2019
```

Use `localeData` and `updateLocale` when a locale has a different week start or first-week rule.

```ts
temday.extend(localeData).extend(updateLocale);
temday.updateLocale('en', { weekStart: 1, yearStart: 4 });
temday('2021-01-01').weekYear(); // 2020
```

## ISO week year {#iso-week-year}

With `isoWeek` installed, `isoWeekYear()` returns the ISO year owning the current week.

```ts
temday.extend(isoWeek);
temday('2021-01-03').isoWeekYear(); // 2020
temday('2021-01-04').isoWeekYear(); // 2021
```

## ISO weeks in year {#iso-weeks-in-year}

With `isoWeek` installed, `isoWeeksInYear()` returns the number of weeks in the ISO year.
