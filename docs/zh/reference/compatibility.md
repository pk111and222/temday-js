# 和 Day.js 的差异

temday 是基于 `Temporal` 和 `Intl` 构建的独立日期时间库。它采用熟悉的链式日期 API，但数据模型、国际化和扩展机制由原生平台能力驱动。本页只记录从 Day.js 迁移时需要注意的差异；未列出的 API 以对应页面的说明为准。

## 已补齐的常用行为

| 场景 | temday 用法 |
| --- | --- |
| 自定义格式解析 | `customParseFormat` 支持严格数值解析、`A/a` 与 `Z/ZZ` 偏移量 |
| 时区格式解析 | `temday.tz(value, format, zone)` |
| 对象输入和运算 | `objectSupport` 支持简写、复数键、对象 `set/add/subtract` |
| UTC 与偏移量 | `utc()`、`utc(true)`、`utcOffset()`；UTC 默认 ISO 格式使用 `Z` |
| Unix BigInt | 安装 `bigIntSupport` 后可传给 `temday.unix()` |
| 显示与序列化 | `advancedFormat` 的 `k/kk`，稳定的 `.000Z` ISO 序列化 |
| Calendar 与 Duration | `calendar(null, formats)`、Duration 分量取值、格式化和参与运算 |

这些能力仍按需安装插件，不会进入根入口。请按功能从对应的插件入口导入。

## 解析规则

Day.js 在非严格解析中会把溢出的日期滚动到后续月份；temday 不会这样处理。

```ts
temday('2022-01-33').isValid(); // false
temday('1970-00-00', 'YYYY-MM-DD').isValid(); // false
```

`customParseFormat` 只解析数值 token、AM/PM 和数值偏移量。它不读取语言包来识别月份或星期名称，因此下面的输入不应作为解析格式使用：

```ts
temday('2018 三月 15', 'YYYY MMMM DD'); // 不支持具名月份解析
temday('2018 Enero 15', 'YYYY MMMM DD'); // 不支持具名月份解析
```

展示具名月份请使用 `localeData` 或应用自己的 i18n 层；输入文本可先转换为数值月份后再解析。

## 国际化与语言包

temday 使用 `Intl` provider，而不是随包发布 Day.js 风格的 locale 模块。因此没有以下入口：

```ts
// Day.js 写法；temday 不提供
require('temday/locale/zh-cn');
temday.locale('zh-cn'); // 不能用语言包名全局注册
```

请安装 `localeData`，并在实例或 Context 上选择 BCP 47 语言标签：

```ts
import localeData from 'temday/plugin/localeData';

temday.extend(localeData);
temday('2026-08-31').locale('zh-CN').format('MMMM');
temday('2026-08-31').localeData().months();
```

没有 `temday.months()`、`temday.weekdays()` 或 `temday.localeData()` 这类 factory 静态助手。这样语言数据只由实际使用的 `Intl` locale 决定，不需要把语言表打进包中。浏览器也没有单独的 locale UMD 文件。

`localizedFormat` 的 `L`、`LT` 等 token 使用运行环境的 `Intl` 规则，日期顺序、空格和标点不保证与 Day.js 某个语言包逐字符相同。需要固定文案时，使用明确的数字 token，例如 `YYYY-MM-DD HH:mm`。

## 插件加载与实例识别

Day.js 可以在浏览器全局变量上直接加载每一个 UMD 插件；temday 的插件是模块入口：

```ts
import utc from 'temday/plugin/utc';
import temday from 'temday';

temday.extend(utc);
```

完整包有版本化 UMD 产物可用于无构建工具页面，但不提供 `window.temday_plugin_utc` 一类单插件全局文件。浏览器接入方式见[浏览器](/zh/installation/browser)。

此外，`temday()` 的返回值不以 factory 函数为原型，不能写 `value instanceof temday`。请使用：

```ts
temday.isTemday(value);
```

## 全局定制

temday 的 locale 不是可注册、可修改的全局对象。以下 Day.js 风格的全局配置没有对应 API：

```ts
temday.locale('my-locale', { /* locale object */ });
temday.updateLocale('en', { calendar: { /* ... */ } });
```

`updateLocale` 仅用于已安装 `localeData` 时的轻量展示覆盖（如月份、星期、周起始日），不能写入 `calendar` 模板。Calendar 文案应在调用时传入：

```ts
value.calendar(reference, {
  sameDay: '[今天] HH:mm',
  nextDay: '[明天] HH:mm',
});
```

`relativeTime` 也没有 Day.js 的全局阈值和舍入函数配置。需要产品级阈值时，应在业务层选择调用 `from` 的时机或自行输出文案，避免全局配置影响其他实例。

## Duration 与本地化显示

Duration 是不可变值，不提供 Day.js 的 `duration.clone()`；直接复用原值，或从毫秒/对象创建新值即可。

```ts
const span = temday.duration({ days: 2, hours: 3 });
temday.isDuration(span); // true
span.format('DD [days] HH:mm');
temday().add(span);
```

Duration 不支持每个 duration 单独设置 `.locale()`。`humanize()` 使用 `Intl.RelativeTimeFormat`，所以措辞不会承诺与 Day.js 语言包完全一致。需要固定翻译、复数规则或阈值时，请由应用 i18n 系统负责文案。

核心测试按解析、取值、运算、显示、时区、国际化和插件分别维护；本页列出的差异作为显式迁移边界保留。
