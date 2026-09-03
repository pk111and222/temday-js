# 为什么是 temday

temday 在 Temporal 之上提供一套能够链式风格调用的日期 API。在不可变值的基础上实现了时间处理加减、比较、ISO 输入和数值格式化等基础功能；并通过插件提供复杂的格式解析、语言展示等能力。

## 更贴近现代 javascript

`add`、`startOf`、时区转换与 DST 都建立在 `Temporal` 的日历模型上；所有写操作默认不可变。

```ts
const end = temday('2024-01-31').add(1, 'month');
end.format('YYYY-MM-DD'); // 2024-02-29
```

## API风格支持好

常用 API 尽可能保持与 dayjs 相似的调用风格，无需直接操作 Temporal 原生对象：

```ts
temday('2026-08-31').add(1, 'day').startOf('day').format('YYYY-MM-DD');
temday.unix(1).toDate();
temday.isTemday(temday());
```

## 插件能力完备

内置多套复杂功能插件，同时支持自定义插件和上下文。

```ts
import localeData from 'temday-js/plugin/localeData';
import isBetween from 'temday-js/plugin/isBetween';

temday.extend(localeData, { locale: 'zh-CN' }).extend(isBetween);
```

详见[插件和上下文](/zh/plugins/)。
