# temday

`temday` is a Temporal-native date library with temday-compatible methods. Use native `Temporal`, `temday/polyfill`, or configure an application-owned implementation.

```ts
import temday from 'temday';
temday('2026-08-31').add(1, 'day').format('YYYY-MM-DD'); // 2026-09-01
```

If an application already owns a Temporal implementation (for example, through its Babel/runtime setup), it can configure that implementation explicitly with `configure({ Temporal })`.

To provision Temporal without adding a separate application dependency, use the bundled side-effect entry:

```ts
import 'temday/polyfill'
import temday from 'temday'
```

If Babel or the host already defines `globalThis.Temporal`, import only `temday`; do not import `temday/polyfill`.

For isolated time-zone runtimes, use `createTemday({ timeZone })` from `temday/context`. Locale providers, named locale tokens, custom parsers, and plugins use separate entries.

The package provides a compact core with independent entries for parsing, locale data, time zones, and other optional APIs. Rslib performs production minification during `pnpm build`.
