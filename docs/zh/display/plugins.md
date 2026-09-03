# 本地化与高级 token

可选显示能力全部采用独立插件。根入口继续只携带数值 token。

## LocaleData

```ts
import temday from 'temday-js';
import localeData from 'temday-js/plugin/localeData';

temday.extend(localeData, { locale: 'zh-CN' });

temday('2026-08-31').format('MMMM dddd');
temday.locale('en');             // 设置工厂默认语言
temday('2026-08-31').locale('zh-CN'); // 返回指定语言的新实例
temday('2026-08-31').format('YYYY-MMMM-DD[日]');
```

数据来自宿主原生 `Intl`，不会随包附带语言表。`MMM`、`MMMM`、`dd`、`ddd`、`dddd` 可用于输出；`localeData()` 返回当前实例使用的 provider。应用已有 i18n 时，可将当前语言代码传给 `temday.locale(code)`；完整的按语言加载策略见 [Intl-first 国际化](/zh/display/i18n)。

如需传入自己的 provider：

```ts
import createIntlLocaleProvider from 'temday-js/locale/intl';

temday.extend(localeData, {
  locale: 'zh-CN',
  provider: createIntlLocaleProvider,
});
```

## LocalizedFormat

```ts
import localizedFormat from 'temday-js/plugin/localizedFormat';

temday.extend(localizedFormat);
temday('2026-08-31T13:04').format('L LT LLLL');
```

`L`、`LT`、`LTS`、`LL`、`LLL`、`LLLL` 由当前 Intl provider 输出。

## AdvancedFormat

```ts
import advancedFormat from 'temday-js/plugin/advancedFormat';

temday.extend(advancedFormat);
temday('2026-08-31T13:04:05Z').format('Do Q k kk X x');
// 31st 3 13 13 1788181445 1788181445000
```

支持 `Do`、`Q`、`k`、`kk`、`X`、`x`。这是显示插件，不增加复杂格式字符串的解析能力。
