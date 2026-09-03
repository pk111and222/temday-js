# TypeScript

temday includes its TypeScript declarations. Do not install `@types/temday`.

## Import

Use the default import:

```ts
import temday, { type Temday } from 'temday';

const release: Temday = temday('2026-08-31');
release.add(1, 'day').format('YYYY-MM-DD');
```

For projects that compile CommonJS, enable default-import interop in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

For Node.js projects, `"module": "NodeNext"` and `"moduleResolution": "NodeNext"` are the recommended module settings.

## Plugins

Import each plugin from its own entry, then install it before use. The import also adds its method declarations.

```ts
import isBetween from 'temday/plugin/isBetween';

temday.extend(isBetween);
temday('2026-08-31').isBetween('2026-08-01', '2026-09-01');
```
