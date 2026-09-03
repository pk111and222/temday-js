# Installation

temday-js is a regular npm package. Use the package manager already used by the project, then continue to [Getting started](/guide/getting-started).

```bash
# pnpm
pnpm add temday-js

# npm
npm install temday-js

# Yarn
yarn add temday-js

# Bun
bun add temday-js
```

If the target does not provide `globalThis.Temporal`, import the opt-in fallback at the application entry point:

```ts
import 'temday-js/polyfill';
import temday from 'temday-js';
```
