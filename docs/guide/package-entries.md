# Choose an import

Use the smallest entry that provides the API you need.

| Import | Use it for |
| --- | --- | --- |
| `temday` | Immutable values, arithmetic, comparisons, default native/ISO parsing, and numeric formatting |
| `temday/context` | A factory pinned to one time zone |
| `temday/polyfill` | Temporal fallback for hosts without `globalThis.Temporal` |
| `temday/full` | All published non-mutating plugins |
| `temday/plugin/*` | One optional plugin, such as `temday/plugin/timezone` |
| `temday/locale/*` | One locale provider, such as `temday/locale/intl` |
| `temday/umd/*` | Browser UMD artifact, such as `temday/umd/core` |

## Root entry

```ts
import temday from 'temday';
```

Use this for most applications.

## Context entry

```ts
import { createTemday } from 'temday/context';
```

Use this when one feature must always calculate in the same time zone.

## Polyfill entry

```ts
import 'temday/polyfill';
```

Import it before the root factory only when the application does not otherwise provide Temporal.

## Optional entries

Import plugins individually and install each one before calling its API:

```ts
import isBetween from 'temday/plugin/isBetween';

temday.extend(isBetween);
temday('2026-08-31').isBetween('2026-08-01', '2026-09-01');
```
