# parserPipeline

为当前 factory 添加洋葱式解析中间件。

```ts
import parserPipeline from 'temday/plugin/parserPipeline';

temday.extend(parserPipeline);
temday.addParser((context, next) => {
  console.log(context.input, context.timeZone);
  return next();
});
temday('2026-08-31');
```

::: warning 边界

中间件只安装到当前 factory。它是高级扩展点：请返回 `next()` 的结果或一个合法的解析状态；不要在中间件中把未知输入“猜成”日期，否则会破坏 `isValid()` 的可靠性。
:::
