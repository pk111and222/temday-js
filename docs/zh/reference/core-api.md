# 核心 API

## 工厂

```ts
import temday from 'temday-js';

const value = temday(input?);
const unix = temday.unix(seconds);
const same = temday.isTemday(value);
```

根入口仍接受以原生值和 ISO 为主的输入。格式字符串解析由已发布的 CustomParseFormat 独立入口提供。

## 值方法

| 分类 | 方法 |
| --- | --- |
| 校验与转换 | `isValid`、`clone`、`valueOf`、`unix`、`toDate`、`toISOString`、`toJSON`、`toString` |
| 日历运算 | `add`、`subtract`、`startOf`、`endOf` |
| 读写 | `get`、`set`、`year`、`month`、`date`、`day`、`hour`、`minute`、`second`、`millisecond`、`daysInMonth` |
| 比较 | `isBefore`、`isAfter`、`isSame`、`diff` |
| 输出 | `format` |

月份的 getter 和 setter 遵循 temday 下标：一月为 `0`。

## 格式化 token

无 locale 的核心只支持数值 token：

```text
YYYY YY M MM D DD H HH h hh m mm s ss SSS Z ZZ A a
```

固定文本请使用方括号：

```ts
temday('2024-08-05T13:04:09Z').format('[今天是] YYYY');
// 今天是 2024
```

具名月份、星期、语言格式别名、序数、季度和 week-year token 均不属于根核心；由相应独立入口提供。
