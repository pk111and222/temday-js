# Browser, Bundler, and UMD

Use ESM when possible: it can import `localeData`, time zones, parsing, and other optional plugins on demand. A browser page without a bundler can use the UMD core.

## Bundlers

```ts
import temday from 'temday';

temday('2026-08-31').format('YYYY-MM-DD');
```

## UMD without a bundler

Load the fallback first, then the core. The fallback does not replace a native `Temporal` implementation.

```html
<script src="https://cdn.jsdelivr.net/npm/temday@1.0.0/dist/umd/polyfill.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/temday@1.0.0/dist/umd/core.umd.min.js"></script>
<script>
  temday('2026-08-31').add(1, 'day').format('YYYY-MM-DD');
  // 2026-09-01
</script>
```

All UMD artifacts are in `dist/umd/`: `core`, `context`, `polyfill`, and `full`. Each has a stable name such as `core.umd.min.js` and a versioned alias such as `core-1.0.0.umd.min.js`. Core and full expose `temday`; context exposes `temdayContext.createTemday`.

```html
<script src="https://cdn.jsdelivr.net/npm/temday@1.0.0/dist/umd/context.umd.min.js"></script>
<script>
  const shanghai = temdayContext.createTemday({ timeZone: 'Asia/Shanghai' });
  shanghai('2026-08-31T12:00').format('Z'); // +08:00
</script>
```

## Full entry

`temday/full` installs all published non-mutating plugins. It includes custom format parsing, locale display, time-zone APIs, duration, calendar, query, collection, and compatibility helpers. `badMutable` remains explicit because it changes immutable method behavior.

```ts
import temday from 'temday/full';

temday('31/08/2026', 'DD/MM/YYYY').format('Do Q');
// 31st 3
```

The full UMD uses the same `temday` global. Load the Temporal fallback first when the browser does not provide Temporal:

```html
<script src="https://cdn.jsdelivr.net/npm/temday@1.0.0/dist/umd/polyfill.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/temday@1.0.0/dist/umd/full.umd.min.js"></script>
<script>
  temday('31/08/2026', 'DD/MM/YYYY').format('Do Q');
  // 31st 3
</script>
```

After an npm release, unpkg and jsDelivr also resolve the default core UMD through `https://unpkg.com/temday@1.0.0` and `https://cdn.jsdelivr.net/npm/temday@1.0.0`. Pin an exact version in production.
