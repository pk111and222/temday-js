# Installation

temday is a regular npm package. Use the package manager already used by the project, then continue to [Getting started](/guide/getting-started).

```bash
# pnpm
pnpm add temday

# npm
npm install temday

# Yarn
yarn add temday

# Bun
bun add temday
```

If the target does not provide `globalThis.Temporal`, import the opt-in fallback at the application entry point:

```ts
import 'temday/polyfill';
import temday from 'temday';
```
