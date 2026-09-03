# relativeTime

提供 `from`、`to`、`fromNow` 与 `toNow`。

```ts
import relativeTime from 'temday/plugin/relativeTime';

temday.extend(relativeTime);
temday('2026-08-03').from('2026-08-01'); // in 2 days
```

```ts
const event = temday('2026-08-31');
event.to('2026-09-02', true); // 2 days，不带 in/ago
event.fromNow();
```

::: warning 边界

输出是面向人类的文本，不适合做业务逻辑比较。未安装 `localeData` 时无后缀的默认文本为英文；请不要解析返回的自然语言字符串。
:::
