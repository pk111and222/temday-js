# timezone

提供 IANA 时区转换与指定时区解析。

```ts
import timezone from 'temday/plugin/timezone';
import customParseFormat from 'temday/plugin/customParseFormat';

temday.extend(customParseFormat).extend(timezone);
temday('2026-08-31T12:00:00Z').tz('Asia/Shanghai').format('Z'); // +08:00
temday.tz('2026-08-31T12:00', 'Asia/Shanghai');
```

```ts
const instant = temday('2026-08-31T12:00:00Z');
instant.tz('America/New_York').format('YYYY-MM-DD HH:mm Z');
temday.tz('2026-08-31T12:00', 'America/New_York'); // 按纽约墙上时间解析
temday.tz('12-25-1995', 'MM-DD-YYYY', 'America/Toronto');
```

::: warning 边界

时区必须是有效 IANA 名称；无效名称返回 invalid 实例。`.tz(zone)` 默认保留 instant，`.tz(zone, true)` 才保留墙上时间。三参数 `temday.tz(input, format, zone)` 需要先安装 `customParseFormat`；DST 交界应由业务明确选择输入语义。
:::
