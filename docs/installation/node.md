# Node.js and CommonJS

temday supports ESM and CommonJS in Node.js 18 and later. Load the polyfill entry first when the runtime does not provide Temporal.

## ESM

```ts
import 'temday/polyfill';
import temday from 'temday';

temday.unix(1).toISOString();
// 1970-01-01T00:00:01Z
```

## CommonJS

```js
require('temday/polyfill');
const temday = require('temday');

temday('2026-08-31').add(1, 'day').format('YYYY-MM-DD');
```

`require('temday')` returns the callable factory. `temday.configure` and `temday.Temday` remain available as properties.
