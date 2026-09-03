# localeData

把实例语言与宿主 `Intl` 连接起来，不随 temday 打包任何语言表。

```ts
import localeData from 'temday-js/plugin/localeData';

temday.extend(localeData, { locale: 'zh-CN' });
temday('2026-08-31').format('MMMM dddd');
temday().localeData().firstDayOfWeek();
```

```ts
temday.locale('fr-FR');
temday('2026-08-31').format('MMMM dddd');
temday('2026-08-31').locale('en-US').format('MMMM');
```

::: warning 边界

`localeData` 只控制展示，不会让 `temday('31 août 2026')` 获得自然语言解析能力。语言数据来自运行时 `Intl`；缺失 ICU 语言数据的宿主会按自身 fallback 规则显示。
:::
