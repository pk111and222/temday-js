# Why temday

temday provides chainable date APIs on top of Temporal. The core covers immutable arithmetic, comparisons, ISO input, and numeric formatting. Plugins add format parsing and localized display when an application needs them.

## Modern date arithmetic

```ts
const end = temday('2024-01-31').add(1, 'month');
end.format('YYYY-MM-DD'); // 2024-02-29
```

## Familiar API style

```ts
temday('2026-08-31').add(1, 'day').startOf('day').format('YYYY-MM-DD');
temday.unix(1).toDate();
temday.isTemday(temday());
```

## Optional plugins

```ts
import localeData from 'temday/plugin/localeData';
import isBetween from 'temday/plugin/isBetween';

temday.extend(localeData, { locale: 'zh-CN' }).extend(isBetween);
```

See [Plugins](/plugins/) for the available APIs.
