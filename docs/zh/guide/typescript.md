# TypeScript

temday 自带 TypeScript 类型声明。

## 导入

使用默认导入：

```ts
import temday, { type Temday } from 'temday-js';

const release: Temday = temday('2026-08-31');
release.add(1, 'day').format('YYYY-MM-DD');
```

如果项目编译为 CommonJS，请在 `tsconfig.json` 中开启默认导入兼容：

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

Node.js 项目建议使用 `"module": "NodeNext"` 和 `"moduleResolution": "NodeNext"`。

## 插件

从独立入口导入插件，并在使用前安装。导入插件后，对应实例方法会获得类型提示。

```ts
import isBetween from 'temday-js/plugin/isBetween';

temday.extend(isBetween);
temday('2026-08-31').isBetween('2026-08-01', '2026-09-01');
```
