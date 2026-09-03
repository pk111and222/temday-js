# 更多插件

这些插件提供可选 API，全部使用独立入口按需安装。

## 比较与周

```ts
import isBetween from 'temday/plugin/isBetween';
import isSameOrAfter from 'temday/plugin/isSameOrAfter';
import isSameOrBefore from 'temday/plugin/isSameOrBefore';
import weekday from 'temday/plugin/weekday';
import weekYear from 'temday/plugin/weekYear';

temday.extend(isBetween).extend(isSameOrAfter).extend(isSameOrBefore);
temday.extend(weekday).extend(weekYear);

temday('2026-08-31').isBetween('2026-08-01', '2026-09-01');
temday('2026-08-31').weekday();
temday('2026-08-31').weekYear();
```

`isBetween` 支持 `()`、`[]`、`[)`、`(]` 边界字符串。`weekday()` 使用已安装 locale provider 的首日设置；没有 localeData 时以周日为首日。

## 输入与投影

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
temday.unix(1_666_311_003n);
temday('2026-08-31').toArray();
temday('2026-08-31').toObject();
```

对象与数组的月份均遵循 temday：一月为 `0`。BigInt 输入只接受安全的 epoch 毫秒值；`bigIntSupport` 同时允许将 BigInt 秒值传给 `temday.unix()`。

## MinMax、Locale 与文本变换

```ts
import minMax from 'temday/plugin/minMax';
import localeData from 'temday/plugin/localeData';
import updateLocale from 'temday/plugin/updateLocale';
import preParsePostFormat from 'temday/plugin/preParsePostFormat';

temday.extend(minMax).extend(localeData).extend(updateLocale);
temday.min('2026-08-31', '2026-08-30');
temday.updateLocale('en', { weekStart: 1, yearStart: 4 });

temday.extend(preParsePostFormat, {
  preparse: (input) => input.replaceAll('/', '-'),
  postformat: (output) => `@${output}`,
});
```

`updateLocale` 需要先安装 `localeData`。它接受 `Intl` provider 的局部覆盖以及 `months`、`weekdays`、`weekStart`、`yearStart` 等简化字段。

## BadMutable

```ts
import badMutable from 'temday/plugin/badMutable';

temday.extend(badMutable);

const value = temday('2026-08-31');
value.add(1, 'day') === value; // true
```

它会破坏 temday 默认的不可变约束，仅在模块需要兼容可变行为时安装。

## 额外常用兼容入口

```ts
import isLeapYear from 'temday/plugin/isLeapYear';
import dayOfYear from 'temday/plugin/dayOfYear';
import pluralGetSet from 'temday/plugin/pluralGetSet';
import buddhistEra from 'temday/plugin/buddhistEra';

temday.extend(isLeapYear).extend(dayOfYear);
temday.extend(pluralGetSet).extend(buddhistEra);
```

`daysInMonth()`、`toJSON()`、`toString()` 已回归根核心。其余入口还包括：

- `isToday`、`isTomorrow`、`isYesterday`
- `negativeYear`：支持 `-1-01-01` 形式的负年份

所有这些入口均为 factory-local 插件，可按需安装。
