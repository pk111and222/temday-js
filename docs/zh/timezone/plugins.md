# UTC 与 Timezone

时区 API 使用 Temporal 的 `Instant` 与 `ZonedDateTime`，并作为独立插件提供。

## UTC {#utc}

```ts
import temday from 'temday-js';
import utc from 'temday-js/plugin/utc';

temday.extend(utc);

temday.utc('2026-08-31T12:00:00').format();
// 2026-08-31T12:00:00Z

temday('2026-08-31T12:00:00Z').utc();
```

## Local {#local}

`local()` 将实例转换回宿主时区；`isUTC()` 可检查实例是否在 UTC 中。

```ts
temday('2026-08-31T12:00:00Z').local();
temday('2026-08-31T12:00:00Z').utc().isUTC(); // true
```

## UTC offset {#utc-offset}

```ts
temday('2026-08-31T12:00:00Z').utcOffset(480);
```

设置 `utcOffset(value, true)` 时会保留墙上时间。

## IANA Timezone

```ts
import timezone from 'temday-js/plugin/timezone';

temday.extend(timezone);

temday('2026-08-31T12:00:00Z').tz('Asia/Shanghai');
temday.tz('2026-08-31T12:00:00', 'Asia/Shanghai');

temday.tz.guess();
temday.tz.setDefault('Asia/Shanghai');
```

`.tz(zone)` 默认保留 instant；第二个参数传 `true` 时保留墙上时间。`temday.tz(input, zone)` 对没有偏移的输入按目标时区解释，对带偏移的输入保留其 instant。
