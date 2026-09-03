# 浏览器、Bundler 与 UMD

优先使用 ESM：它可以按需引入 `localeData`、时区和解析等独立插件。没有构建工具时，也可以直接使用 UMD 全局变量。

## 使用 Bundler

```ts
import temday from 'temday-js';

temday('2026-08-31').format('YYYY-MM-DD');
```

## 使用 UMD（无需构建工具）

先加载 polyfill，再加载核心 UMD。polyfill 检测到原生 Temporal 时不会覆盖它。

```html
<script src="https://cdn.jsdelivr.net/npm/temday-js@1.0.0/dist/umd/polyfill.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/temday-js@1.0.0/dist/umd/core.umd.min.js"></script>
<script>
  temday('2026-08-31').add(1, 'day').format('YYYY-MM-DD');
  // 2026-09-01
</script>
```

所有 UMD 都构建在 `dist/umd/` 下：`core`、`context`、`polyfill` 和 `full`。每个文件有稳定名（如 `core.umd.min.js`）和版本别名（如 `core-1.0.0.umd.min.js`），并在文件头写入版本 banner。core 与 full 暴露全局工厂 `temday`；context 暴露 `temdayContext.createTemday`。需要 locale、解析、时区等插件时，请使用 ESM/CJS 与 Bundler。

## 完整入口

`temday-js/full` 会安装已发布的非可变插件，包含格式解析、locale 展示、时区、时长、日历、查询、集合与兼容 API。`badMutable` 会改变不可变方法的行为，仍需显式安装。

```ts
import temday from 'temday-js/full';

temday('31/08/2026', 'DD/MM/YYYY').format('Do Q');
// 31st 3
```

完整 UMD 同样暴露全局 `temday`。浏览器没有 Temporal 时，先加载 polyfill：

```html
<script src="https://cdn.jsdelivr.net/npm/temday-js@1.0.0/dist/umd/polyfill.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/temday-js@1.0.0/dist/umd/full.umd.min.js"></script>
<script>
  temday('31/08/2026', 'DD/MM/YYYY').format('Do Q');
  // 31st 3
</script>
```

发布到 npm 后，unpkg 与 jsDelivr 可直接使用包的默认 UMD：

```html
<!-- unpkg -->
<script src="https://unpkg.com/temday-js@1.0.0"></script>

<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/temday-js@1.0.0"></script>
```

生产环境应固定完整版本号；需要 Temporal fallback 时仍须先加载对应的 polyfill UMD。cdnjs 采用独立的库收录流程，待 npm 正式发布并完成 cdnjs `packages` 配置后再提供其固定版本 URL。

```html
<script src="https://cdn.jsdelivr.net/npm/temday-js@1.0.0/dist/umd/context.umd.min.js"></script>
<script>
  const shanghai = temdayContext.createTemday({ timeZone: 'Asia/Shanghai' });
  shanghai('2026-08-31T12:00').format('Z'); // +08:00
</script>
```

## Temporal 可用时

如果浏览器、Babel 或运行时已经提供 `globalThis.Temporal`，只需导入根入口。

## Temporal 不可用时

按需导入 temday 自带的 Temporal fallback。它是独立入口，不会进入根包的 2 KiB 核心预算。

```ts
import 'temday-js/polyfill';
import temday from 'temday-js';

temday('2026-08-31').add(1, 'day').format('YYYY-MM-DD');
// 2026-09-01
```

`temday-js/polyfill` 只会在全局 Temporal 缺失时安装，不会覆盖已有实现。

## 选择入口

只需要默认时区和核心日期能力时，使用 `temday`。需要固定到指定时区的独立工厂时，再额外导入 `temday-js/context`。
