# CustomParseFormat

Format-string parsing is a separate plugin, so unused applications do not pay for a parser in the root bundle.

```ts
import temday from 'temday-js';
import customParseFormat from 'temday-js/plugin/customParseFormat';

temday.extend(customParseFormat);

temday('31/08/2026 18:05', 'DD/MM/YYYY HH:mm');
temday('2026.08.31', ['YYYY.MM.DD', 'DD.MM.YYYY']);
temday('2026-08-31', 'YYYY-MM-DD', true);
temday('2026/8/31', 'YYYY/M/D', 'zh-CN', true);
```

Supported tokens are `YYYY`, `YY`, `M`, `MM`, `D`, `DD`, `H`, `HH`, `h`, `hh`, `m`, `mm`, `s`, `ss`, `SSS`, `Z`, `ZZ`, `A`, `a`, and bracket literals.

Strict mode requires fixed-width tokens and literals to match exactly. An array of formats is tried in order. This is a numeric parser: `MMM`, `MMMM`, weekday names, `Do`, `Q`, and localized aliases are deliberately out of scope.
