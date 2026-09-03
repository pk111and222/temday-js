# Relative time and Calendar

## Time from now {#from-now}

```ts
import relativeTime from 'temday-js/plugin/relativeTime';

temday.extend(relativeTime);

temday('2026-08-31').fromNow();
```

## Time from X {#from}

`from(input, withoutSuffix?)` displays the current value relative to `input`.

## Time to now {#to-now}

`toNow(withoutSuffix?)` displays the current value relative to now.

## Time to X {#to}

`to(input, withoutSuffix?)` displays the current value relative to `input`.

Relative text uses native `Intl.RelativeTimeFormat`. When `localeData` is installed, it follows the instance locale.

## Calendar time {#calendar-time}

```ts
import calendar from 'temday-js/plugin/calendar';

temday.extend(calendar);
temday('2026-09-01').calendar('2026-08-31', {
  nextDay: '[Tomorrow] HH:mm',
});
```

See [extended operations](/manipulation/extensions) for the complete Calendar API and duration examples.
