# UTC and IANA time zones

```ts
import utc from 'temday/plugin/utc';
import timezone from 'temday/plugin/timezone';

temday.extend(utc).extend(timezone);
```

## UTC {#utc}

```ts
temday.utc('2026-08-31T12:00:00').isUTC();
temday('2026-08-31T12:00:00Z').utc().format('Z');
```

## Local {#local}

`local()` moves the value back to the host time zone; `isUTC()` checks the current zone.

## UTC offset {#utc-offset}

```ts
temday('2026-08-31T12:00:00Z').utcOffset(480).format('Z');
temday('2026-08-31T12:00:00Z').utcOffset('-0530', true);
```

`utcOffset(value, true)` preserves wall-clock fields; without `true`, it preserves the instant.

## IANA zones

```ts
temday('2026-08-31T12:00:00Z').tz('Asia/Shanghai');
temday.tz('2026-08-31T12:00:00', 'Asia/Shanghai');
temday.tz.guess();
temday.tz.setDefault('America/New_York');
```

`.tz(zone)` preserves the instant by default; pass `true` to preserve wall-clock fields. `temday.tz(input, zone)` interprets input without an offset in the target zone and preserves the instant when input carries an offset.
