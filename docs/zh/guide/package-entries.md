# 选择入口

按实际需要导入最小的入口。

| 导入 | 适用场景 |
| --- | --- |
| `temday` | 不可变值、加减、比较、原生/ISO 解析和数值格式化 |
| `temday/context` | 固定到某一时区的独立工厂 |
| `temday/polyfill` | 宿主没有 `globalThis.Temporal` 时的 fallback |
| `temday/full` | 所有已发布的非可变插件 |
| `temday/plugin/*` | 单个可选插件，如 `temday/plugin/timezone` |
| `temday/locale/*` | 单个 locale provider，如 `temday/locale/intl` |
| `temday/umd/*` | 无构建工具时使用 UMD，如 `temday/umd/core` |

## 根入口

```ts
import temday from 'temday';
```

绝大多数应用只需要这个入口。

## Context 入口

```ts
import { createTemday } from 'temday/context';

const utc = createTemday({ timeZone: 'UTC' });
```

当一个功能必须始终使用同一时区时，再创建 Context。

## Polyfill 入口

```ts
import 'temday/polyfill';
```

仅在应用没有其他方式提供 Temporal 时，在根入口前导入。

## 可选插件

逐个导入插件，并在调用其 API 前安装：

```ts
import isBetween from 'temday/plugin/isBetween';

temday.extend(isBetween);
temday('2026-08-31').isBetween('2026-08-01', '2026-09-01');
```
