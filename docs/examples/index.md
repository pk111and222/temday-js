# Common scenarios

Each example starts with the smallest required import, so optional features do not accidentally enter the default bundle.

## Safe month-end arithmetic

```ts
import temday from 'temday-js';

const invoiceDate = temday('2024-01-31');
const nextInvoice = invoiceDate.add(1, 'month');

invoiceDate.format('YYYY-MM-DD'); // 2024-01-31
nextInvoice.format('YYYY-MM-DD'); // 2024-02-29
```

## Localized release dates

```ts
import temday from 'temday-js';
import localeData from 'temday-js/plugin/localeData';

temday.extend(localeData, { locale: 'en-US' });
const publishedAt = temday('2026-08-31');

publishedAt.locale('en-US').format('MMMM DD, YYYY');
publishedAt.locale('zh-CN').format('YYYY年MMMMDD日');
```

See [Intl-first internationalization](/display/i18n) for application-managed language loading.

## Isolated time-zone factories

```ts
import { createTemday } from 'temday-js/context';

const shanghai = createTemday({ timeZone: 'Asia/Shanghai' });
const newYork = createTemday({ timeZone: 'America/New_York' });

shanghai('2026-08-31T12:00').format('Z'); // +08:00
newYork('2026-08-31T12:00').format('Z');  // -04:00
```

## A traditional page without a bundler

```html
<script src="https://cdn.jsdelivr.net/npm/temday-js@1.0.0/dist/umd/polyfill.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/temday-js@1.0.0/dist/umd/core.umd.min.js"></script>
<script>
  document.querySelector('#date').textContent = temday().format('YYYY-MM-DD');
</script>
```

For the full loading order and CDN policy, see [Browser, Bundler, and UMD](/installation/browser).
