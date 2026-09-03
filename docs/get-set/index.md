# Units and get/set

temday follows familiar temday unit semantics and returns a new value from every setter. Months are zero-based: January is `0` and December is `11`.

```ts
const source = temday('2024-06-15T13:14:15.123');

source.year();
source.month(); // 5
source.date();  // 15
source.day();   // 6, Sunday is 0
source.month(0).date(31).hour(0);
```

| Method | Getter | Setter | Notes |
| --- | --- | --- | --- |
| `year()` | Calendar year | `year(value)` | |
| `month()` | `0`–`11` | `month(value)` | Month index |
| `date()` | Day of month | `date(value)` | `1`–`31` |
| `day()` | `0`–`6` | `day(value)` | Sunday is `0`; setter moves by days |
| `hour()` / `minute()` / `second()` / `millisecond()` | Time field | Same-name setter | In the current factory time zone |

`daysInMonth()` is a root API and needs no plugin.

```ts
temday('2024-02-15').daysInMonth(); // 29
```

## Millisecond {#millisecond}

`millisecond()` reads or sets the millisecond field.

## Second {#second}

`second()` reads or sets the second field.

## Minute {#minute}

`minute()` reads or sets the minute field.

## Hour {#hour}

`hour()` reads or sets the hour field.

## Date of month {#date-of-month}

`date()` reads or sets the day of the month (`1`–`31`).

## Day of week {#day-of-week}

`day()` reads or sets the weekday index. Sunday is `0`; a setter moves by days.

## Month {#month}

`month()` is zero-based: January is `0` and December is `11`.

## Year {#year}

`year()` reads or sets the calendar year.

## Days in month {#days-in-month}

`daysInMonth()` returns the actual number of days in the value's month.

## Get {#get}

```ts
const value = temday('2024-06-15T13:14:15.123');

value.get('month');
```

## Set {#set}

```ts
value.set('month', 0).format('YYYY-MM-DD'); // 2024-01-15
```

Supported units are `year`, `month`, `date`, `day`, `hour`, `minute`, `second`, and `millisecond`, plus common singular, plural, and shorthand aliases. `get('day')` is a weekday index; `get('date')` is the day of the month.

See [weeks, quarters, and extended units](/get-set/calendar) and [projections and plural methods](/get-set/projections) for opt-in APIs.
