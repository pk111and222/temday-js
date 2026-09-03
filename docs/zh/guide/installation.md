# 安装

temday-js 是一个常规 npm 包。选择项目正在使用的包管理器即可；安装后请继续阅读 [开始使用](/zh/guide/getting-started)。

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

如果目标环境没有 `globalThis.Temporal`，在应用入口额外导入 fallback：

```ts
import 'temday-js/polyfill';
import temday from 'temday-js';
```

`temday-js/polyfill` 仅在 Temporal 缺失时生效，不会覆盖浏览器、Node 或 Babel 已提供的实现。
