# 周、季度与扩展单位

周、ISO 周、季度和年内日序号都是独立插件，按需安装即可。

```ts
import weekOfYear from 'temday-js/plugin/weekOfYear';
import isoWeek from 'temday-js/plugin/isoWeek';
import quarterOfYear from 'temday-js/plugin/quarterOfYear';
import weekYear from 'temday-js/plugin/weekYear';
import weekday from 'temday-js/plugin/weekday';
import dayOfYear from 'temday-js/plugin/dayOfYear';

temday.extend(weekOfYear).extend(isoWeek).extend(quarterOfYear);
temday.extend(weekYear).extend(weekday).extend(dayOfYear);
```

| API | Getter | Setter / 说明 |
| --- | --- | --- |
| `week()` | 区域周序号 | `week(value)` 按整周平移 |
| `weeksInYear()` | 当前年的区域周数 | 无 setter |
| `isoWeek()` | ISO-8601 周序号 | `isoWeek(value)` |
| `isoWeekday()` | 周一为 `1`、周日为 `7` | `isoWeekday(value)` |
| `isoWeekYear()` | ISO 周所属年 | 无 setter |
| `isoWeeksInYear()` | ISO 年周数 | 无 setter |
| `weekYear()` | 区域周所属年 | 无 setter |
| `weekday()` | 以 locale 首日为 `0` 的工作日 | `weekday(value)` |
| `quarter()` | `1`–`4` | `quarter(value)` |
| `dayOfYear()` | 年内第几天 | `dayOfYear(value)` |

```ts
temday('2021-01-04').isoWeek();       // 1
temday('2021-01-04').isoWeekday();    // 1
temday('2026-08-31').quarter(4);      // 保留月内日期，移动到第四季度
temday('2024-01-01').dayOfYear(60);   // 2024-02-29
```

`week()`、`weekday()` 和 `weekYear()` 可配合 `localeData` 使用 locale 的一周起始日；未安装时以周日为首日。

## Day of Week (Locale Aware) {#locale-weekday}

安装 `weekday` 后，`weekday()` 以当前 locale 的一周第一天为 `0`。

```ts
temday.extend(weekday);
temday('2026-08-31').weekday();
```

## ISO Day of Week {#iso-weekday}

安装 `isoWeek` 后，`isoWeekday()` 以周一为 `1`、周日为 `7`。

```ts
temday.extend(isoWeek);
temday('2026-08-31').isoWeekday(); // 1
```

## 每年中的第几天 {#day-of-year}

安装 `dayOfYear` 后，`dayOfYear()` 读取或设置该年的第几天。

```ts
temday.extend(dayOfYear);
temday('2024-01-01').dayOfYear(60).format('YYYY-MM-DD'); // 2024-02-29
```

## Week of Year {#week-of-year}

安装 `weekOfYear` 后，`week()` 与 `weeksInYear()` 使用 locale 周规则。

```ts
temday.extend(weekOfYear);
temday('2021-01-03').week(); // 2
```

## Week of Year (ISO) {#iso-week}

安装 `isoWeek` 后，`isoWeek()` 读取或设置 ISO-8601 周序号。

```ts
temday.extend(isoWeek);
temday('2021-01-04').isoWeek(); // 1
```

## Quarter {#quarter}

安装 `quarterOfYear` 后，`quarter()` 读取或设置 `1` 到 `4` 的季度。

```ts
temday.extend(quarterOfYear);
temday('2026-08-31').quarter(); // 3
```

## Week Year {#week-year}

安装 `weekOfYear` 与 `weekYear` 后，`weekYear()` 返回区域周所属的年份。

```ts
temday.extend(weekOfYear).extend(weekYear);
temday('2018-12-30').week();     // 1
temday('2018-12-30').weekYear(); // 2019
```

若 locale 使用不同的一周起始日或第一周规则，可配合 `localeData` 与 `updateLocale` 配置。

```ts
temday.extend(localeData).extend(updateLocale);
temday.updateLocale('en', { weekStart: 1, yearStart: 4 });
temday('2021-01-01').weekYear(); // 2020
```

## Week Year (ISO) {#iso-week-year}

安装 `isoWeek` 后，`isoWeekYear()` 返回当前 ISO 周所属的年份。

```ts
temday.extend(isoWeek);
temday('2021-01-03').isoWeekYear(); // 2020
temday('2021-01-04').isoWeekYear(); // 2021
```

## Weeks In Year (ISO) {#iso-weeks-in-year}

安装 `isoWeek` 后，`isoWeeksInYear()` 返回该 ISO 年的周数。

```ts
temday.extend(isoWeek);
temday('2020-12-31').isoWeeksInYear(); // 53
```
