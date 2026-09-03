# Node.js and CommonJS

temday supports ESM and CommonJS in Node.js 18 and later. Load the polyfill entry first when the runtime does not provide Temporal.

## ESM

```ts
import 'temday-js/polyfill';
import temday from 'temday-js';

temday.unix(1).toISOString();
// 1970-01-01T00:00:01Z
```

## CommonJS

```js
require('temday-js/polyfill');
const temday = require('temday-js');

temday('2026-08-31').add(1, 'day').format('YYYY-MM-DD');
```

`require('temday-js')` returns the callable factory. `temday.configure` and `temday.Temday` remain available as properties.
