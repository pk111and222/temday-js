# utc

提供 UTC factory、UTC 实例、回到本地时区和固定 offset。

```ts
import utc from 'temday/plugin/utc';

temday.extend(utc);
temday.utc('2026-08-31T12:00').isUTC(); // true
temday('2026-08-31T12:00:00Z').utcOffset(480).format('Z'); // +08:00
```

```ts
const value = temday('2026-08-31T12:00:00Z');
value.utc().format('YYYY-MM-DD HH:mm Z'); // 2026-08-31 12:00 Z
value.utcOffset('+0800', true).format('HH:mm Z'); // 12:00 +08:00，保留墙上时间
value.utc(true); // 保留 12:00 这个墙上时间，并改为 UTC 视图
```

::: warning 边界

调用 `utc()`、`local()` 或 `utcOffset()` 前必须安装插件。UTC 视图的默认 `format()` 与 temday 一样使用 `Z` 后缀；固定 offset `+00:00` 仍显示为 `+00:00`。`utc(true)` 与 `utcOffset(value, true)` 会改变 instant；只有明确需要保留墙上时间时才传 `true`。
:::
