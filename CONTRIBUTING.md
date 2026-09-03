# Contributing to temday

## Local setup

Use Node.js 18 or newer and the repository's pinned pnpm version.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm verify
```

`pnpm verify` runs type checking, unit and differential tests, smoke tests against the generated ESM and CJS package artifacts, and the documentation build.

## Change requirements

- Add behaviour tests, including temday differential cases where the project claims compatibility.
- Do not expose an import path, type, or documented API until its runtime behaviour, declarations, and tests exist.
- Keep optional parser, locale, context, and polyfill code in their dedicated package entries.

## Pull requests

Describe compatibility effects and test coverage. Changes to package exports or release behaviour must include a generated-package smoke test.
