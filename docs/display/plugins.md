# Localized and advanced tokens

Optional display capability stays outside the root bundle.

## LocaleData

```ts
import localeData from 'temday-js/plugin/localeData';

temday.extend(localeData, { locale: 'zh-CN' });

temday('2026-08-31').format('MMMM dddd');
temday.locale('en');
temday('2026-08-31').locale('zh-CN');
temday('2026-08-31').format('YYYY-MMMM-DD[ day ]');
```

Data comes from host `Intl`, not bundled locale files. `localeData()` returns the active provider. For a custom provider, import `createIntlLocaleProvider` from `temday-js/locale/intl` or supply your own provider function.

## LocalizedFormat

```ts
import localizedFormat from 'temday-js/plugin/localizedFormat';

temday.extend(localizedFormat);
temday('2026-08-31T13:04').format('L LT LLLL');
```

`L`, `LT`, `LTS`, `LL`, `LLL`, and `LLLL` come from the current `Intl` provider.

## AdvancedFormat

```ts
import advancedFormat from 'temday-js/plugin/advancedFormat';

temday.extend(advancedFormat);
temday('2026-08-31T13:04:05Z').format('Do Q k kk X x');
```

Supported tokens are `Do`, `Q`, `k`, `kk`, `X`, and `x`. This adds display tokens, not complex format parsing.
