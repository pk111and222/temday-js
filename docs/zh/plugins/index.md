# 插件

导入插件后，在调用其新增 API 前安装：

```ts
import isBetween from 'temday-js/plugin/isBetween';

temday.extend(isBetween);
temday('2026-08-31').isBetween('2026-08-01', '2026-09-01');
```

同一个插件在同一工厂只会安装一次。`temday-js/context` 创建的工厂拥有独立插件状态。

## 常用 API

| 需求 | 插件 |
| --- | --- |
| 按格式解析字符串 | `customParseFormat` |
| 按 locale 格式化日期 | `localeData`、`localizedFormat` |
| 使用 IANA 时区 | `utc`、`timezone` |
| 显示相对时间或日历时间 | `relativeTime`、`calendar` |
| 处理时长 | `duration` |
| 使用周或季度字段 | `weekOfYear`、`isoWeek`、`quarterOfYear` |
| 比较或聚合值 | `isBetween`、`isSameOrAfter`、`isSameOrBefore`、`minMax` |
| 接受对象、数组或 bigint 输入 | `objectSupport`、`arraySupport`、`bigIntSupport` |
| 序列化值 | `toArray`、`toObject` |

所有插件都使用 `temday-js/plugin/<name>` 导入。其余插件和示例见 [更多插件](/zh/plugins/more)。

## Parser Pipeline

需要在解析前后处理结果的插件，可安装洋葱管线：

```ts
import parserPipeline from 'temday-js/plugin/parserPipeline';

temday.extend(parserPipeline);
temday.addParser((context, next) => {
  // 前处理
  const result = next();
  // 后处理
  return result;
});
```

每个 `temday-js/context` 工厂有自己的 middleware 列表。

## Token Registry

```ts
import tokenRegistry from 'temday-js/plugin/tokenRegistry';

temday.extend(tokenRegistry);
temday.addToken({
  token: 'FY',
  format: (value) => `FY${value.year()}`,
});
```

注册 token 只影响当前工厂，并会按 token 长度优先匹配。
