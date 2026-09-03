# 解析钩子与管线

解析扩展始终只影响安装它的 factory。适合把输入规范化、保留审计信息或接入领域格式。

## PreParsePostFormat

```ts
import preParsePostFormat from 'temday/plugin/preParsePostFormat';

temday.extend(preParsePostFormat, {
  preparse: (input) => input.replaceAll('.', '-'),
  postformat: (output) => output.replace(/-/g, '/'),
});

temday('2026.08.31').format('YYYY-MM-DD'); // 2026/08/31
```

`preparse` 仅处理字符串输入；变换后的输入会重新进入已安装的解析器。`postformat` 在 `format()` 输出后运行。

## ParserPipeline

```ts
import parserPipeline from 'temday/plugin/parserPipeline';

temday.extend(parserPipeline);
temday.addParser((context, next) => {
  if (context.input === 'release-day') {
    return {
      value: Temporal.ZonedDateTime.from({
        year: 2026, month: 8, day: 31, timeZone: context.timeZone,
      }),
      valid: true,
      timeZone: context.timeZone,
    };
  }
  return next();
});
```

中间件以洋葱模型执行：`context` 包含 `input`、`format`、`locale`、`strict` 与 `timeZone`，`next()` 会继续后续中间件。返回值必须是解析状态（如上例）；它是高级扩展点，普通格式字符串应优先使用 CustomParseFormat。
