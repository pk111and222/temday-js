# 常用场景

下面示例从最小核心开始；每个额外能力都显式导入，因此不会意外进入默认 bundle。

## 月末安全加月

```ts
import temday from 'temday';

const invoiceDate = temday('2024-01-31');
const nextInvoice = invoiceDate.add(1, 'month');

invoiceDate.format('YYYY-MM-DD'); // 2024-01-31
nextInvoice.format('YYYY-MM-DD'); // 2024-02-29
```

## 多语言发布日期

```ts
import temday from 'temday';
import localeData from 'temday/plugin/localeData';

temday.extend(localeData, { locale: 'en-US' });
const publishedAt = temday('2026-08-31');

publishedAt.locale('en-US').format('MMMM DD, YYYY');
publishedAt.locale('zh-CN').format('YYYY年MMMMDD日');
```

语言数据不会被 temday 打进 bundle；详见 [Intl-first 国际化](/zh/display/i18n)。

## 独立时区工厂

```ts
import { createTemday } from 'temday/context';

const shanghai = createTemday({ timeZone: 'Asia/Shanghai' });
const newYork = createTemday({ timeZone: 'America/New_York' });

shanghai('2026-08-31T12:00').format('Z'); // +08:00
newYork('2026-08-31T12:00').format('Z');  // -04:00
```

## 传统页面直接使用

```html
<script src="https://cdn.jsdelivr.net/npm/temday@1.0.0/dist/umd/polyfill.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/temday@1.0.0/dist/umd/core.umd.min.js"></script>
<script>
  document.querySelector('#date').textContent = temday().format('YYYY-MM-DD');
</script>
```

UMD 适合核心 API；插件能力请交给 ESM/CJS 的 Bundler。完整加载顺序见[浏览器与 Bundler](/zh/installation/browser)。
