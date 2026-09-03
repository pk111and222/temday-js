# 快速开始

## 1. 提供 Temporal

宿主已提供 `globalThis.Temporal` 时，直接导入 temday：

```ts
import temday from 'temday';

temday('2026-08-31').add(1, 'day').format('YYYY-MM-DD');
// 2026-09-01
```

在没有 Temporal 的环境中，按需导入 temday 自带的 fallback：

```ts
import 'temday/polyfill';
import temday from 'temday';
```

polyfill 只会在 `globalThis.Temporal` 缺失时安装，不会覆盖已有实现。

## 2. 使用不可变值

每次操作都会产生一个新值：

```ts
const start = temday('2024-01-31');
const next = start.add(1, 'month');

start.format('YYYY-MM-DD'); // 2024-01-31
next.format('YYYY-MM-DD');  // 2024-02-29
```
