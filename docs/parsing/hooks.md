# Parsing hooks and pipeline

Parsing extensions are factory-local. Use them to normalize input, preserve domain-specific rules, or add advanced parser middleware.

## PreParsePostFormat

```ts
import preParsePostFormat from 'temday/plugin/preParsePostFormat';

temday.extend(preParsePostFormat, {
  preparse: (input) => input.replaceAll('.', '-'),
  postformat: (output) => output.replace(/-/g, '/'),
});

temday('2026.08.31').format('YYYY-MM-DD'); // 2026/08/31
```

`preparse` only handles string input; transformed input re-enters the active parser chain. `postformat` runs after `format()`.

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

Middleware runs as an onion chain. `context` exposes `input`, `format`, `locale`, `strict`, and `timeZone`; `next()` continues subsequent middleware. A middleware must return a parse state, so use CustomParseFormat for ordinary format strings.
