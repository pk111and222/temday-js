# CustomParseFormat

格式字符串解析是独立插件；不使用它的应用不会把解析器打进根包。

```ts
import temday from 'temday-js';
import customParseFormat from 'temday-js/plugin/customParseFormat';

temday.extend(customParseFormat);

temday('31/08/2026 18:05', 'DD/MM/YYYY HH:mm');
temday('2026.08.31', ['YYYY.MM.DD', 'DD.MM.YYYY']);
temday('2026-08-31', 'YYYY-MM-DD', true); // 第三个参数为 strict
temday('05/02/69 1:02:03 PM -05:00', 'MM/DD/YY H:mm:ss A Z');
```

支持的 token：`YYYY`、`YY`、`M`、`MM`、`D`、`DD`、`H`、`HH`、`h`、`hh`、`m`、`mm`、`s`、`ss`、`SSS`、`Z`、`ZZ`、`A`、`a` 和方括号字面量。

`strict` 会要求固定宽度 token 与字面量完全匹配，并拒绝无效日历字段。传入多个格式时，会按顺序选择第一个有效格式；可把 locale 参数放在 strict 之前，与 temday 调用顺序一致：

```ts
temday('2026/8/31', 'YYYY/M/D', 'zh-CN', true);
```

这是一套数值解析器：`MMM`、`MMMM`、星期名称、`Do`、`Q` 与本地化格式别名不在其解析范围内。`A/a` 可与 `Z/ZZ` 同时使用；解析出的 offset 会先换算为 instant，再按 factory 时区显示。
