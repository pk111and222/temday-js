# Plugins

Import a plugin and install it before calling the API it adds:

```ts
import isBetween from 'temday-js/plugin/isBetween';

temday.extend(isBetween);
temday('2026-08-31').isBetween('2026-08-01', '2026-09-01');
```

Install a plugin once per factory. A factory created with `temday-js/context` has its own installed-plugin set.

## Common APIs

| Need | Plugin |
| --- | --- |
| Parse a string with a format | `customParseFormat` |
| Format locale-specific dates | `localeData`, `localizedFormat` |
| Use IANA time zones | `utc`, `timezone` |
| Show relative or calendar time | `relativeTime`, `calendar` |
| Work with durations | `duration` |
| Use week or quarter fields | `weekOfYear`, `isoWeek`, `quarterOfYear` |
| Compare or collect values | `isBetween`, `isSameOrAfter`, `isSameOrBefore`, `minMax` |
| Accept object, array, or bigint input | `objectSupport`, `arraySupport`, `bigIntSupport` |
| Serialize a value | `toArray`, `toObject` |

Every plugin is available at `temday-js/plugin/<name>`. See [more plugins](/plugins/more) for the remaining helpers and examples.

## Token registry

```ts
import tokenRegistry from 'temday-js/plugin/tokenRegistry';

temday.extend(tokenRegistry);
temday.addToken({
  token: 'FY',
  format: (value) => `FY${value.year()}`,
});
```

Registered tokens are local to the current factory and match longest-first.
