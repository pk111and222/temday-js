# Node.js 与 CommonJS

temday 支持 ESM 与传统 CommonJS。Node.js 18 及以上可安装并运行该包；Temporal 不可用时，先加载 polyfill 入口。

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

CommonJS 的 `require('temday-js')` 直接返回可调用工厂；`temday.configure` 和 `temday.Temday` 同时作为属性保留。
