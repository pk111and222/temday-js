# 相对时间与 Calendar

## Time from now {#from-now}

```ts
import relativeTime from 'temday/plugin/relativeTime';

temday.extend(relativeTime);

temday().fromNow();
```

## Time from X {#from}

`from(input, withoutSuffix?)` 显示当前值相对于 `input` 的时间文本。

```ts
temday('2026-08-03').from('2026-08-01'); // in 2 days
```

## Time to now {#to-now}

`toNow(withoutSuffix?)` 显示当前值到现在的时间文本。

```ts
temday('2026-08-31').toNow();
```

## Time to X {#to}

`to(input, withoutSuffix?)` 显示当前值到 `input` 的时间文本。

```ts
temday('2026-08-01').to('2026-08-03'); // in 2 days
```

带后缀的输出由原生 `Intl.RelativeTimeFormat` 生成，并会使用已安装 localeData 后的实例语言；`true` 参数返回无前后缀的英文数量文本。

## Calendar-time {#calendar-time}

```ts
import calendar from 'temday/plugin/calendar';

temday.extend(calendar);

temday('2026-08-31T13:04').calendar('2026-08-31');
// Today at 13:04
```

可用 `sameDay`、`nextDay`、`nextWeek`、`lastDay`、`lastWeek`、`sameElse` 覆盖模板，也可为某个模板传入函数。
