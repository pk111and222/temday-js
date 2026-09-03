# tokenRegistry

为当前 factory 注册自定义格式 token；最长 token 优先匹配。

```ts
import tokenRegistry from 'temday-js/plugin/tokenRegistry';

temday.extend(tokenRegistry);
temday.addToken({ token: 'FY', format: (value) => `FY${value.year()}` });
temday('2026-08-31').format('FY'); // FY2026
```

```ts
temday.addToken({ token: 'FYY', format: (value) => `FY-${value.year()}` });
temday('2026-08-31').format('FYY FY'); // FY-2026 FY2026
```

::: warning 边界

自定义 token 只作用于当前 factory，并按最长 token 优先匹配。避免与核心 token 或其他插件 token 同名；它只扩展格式化，不扩展解析。
:::
