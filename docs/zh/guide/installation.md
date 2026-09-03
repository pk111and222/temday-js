# 安装

temday 是一个常规 npm 包。选择项目正在使用的包管理器即可；安装后请继续阅读 [开始使用](/zh/guide/getting-started)。

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

如果目标环境没有 `globalThis.Temporal`，在应用入口额外导入 fallback：

```ts
import 'temday/polyfill';
import temday from 'temday';
```

`temday/polyfill` 仅在 Temporal 缺失时生效，不会覆盖浏览器、Node 或 Babel 已提供的实现。
