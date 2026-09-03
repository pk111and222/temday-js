# localizedFormat

启用 `L`、`LL`、`LLL`、`LLLL` 等本地化格式别名；需先安装 `localeData`。

```ts
import localeData from 'temday/plugin/localeData';
import localizedFormat from 'temday/plugin/localizedFormat';

temday.extend(localeData, { locale: 'zh-CN' }).extend(localizedFormat);
temday('2026-08-31T13:04').format('LLLL');
```

```ts
const value = temday('2026-08-31T13:04');
value.format('L');
value.format('LL');
value.format('LT');
```

::: warning 边界

必须先安装 `localeData`；否则 `L`、`LL` 等不会获得本地化含义。该插件只增加格式 token，不改变解析器。
:::
