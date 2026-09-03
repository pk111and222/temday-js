# Choose an import

Use the smallest entry that provides the API you need.

| Import | Use it for |
| --- | --- | --- |
| `temday` | Immutable values, arithmetic, comparisons, default native/ISO parsing, and numeric formatting |
| `temday-js/context` | A factory pinned to one time zone |
| `temday-js/polyfill` | Temporal fallback for hosts without `globalThis.Temporal` |
| `temday-js/full` | All published non-mutating plugins |
| `temday-js/plugin/*` | One optional plugin, such as `temday-js/plugin/timezone` |
| `temday-js/locale/*` | One locale provider, such as `temday-js/locale/intl` |
| `temday-js/umd/*` | Browser UMD artifact, such as `temday-js/umd/core` |

## Root entry

```ts
import temday from 'temday-js';
```

Use this for most applications.

## Context entry

```ts
import { createTemday } from 'temday-js/context';
```

Use this when one feature must always calculate in the same time zone.

## Polyfill entry

```ts
import 'temday-js/polyfill';
```

Import it before the root factory only when the application does not otherwise provide Temporal.

## Optional entries

Import plugins individually and install each one before calling its API:

```ts
import isBetween from 'temday-js/plugin/isBetween';

temday.extend(isBetween);
temday('2026-08-31').isBetween('2026-08-01', '2026-09-01');
```
