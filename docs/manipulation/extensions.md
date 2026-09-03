# Duration, Calendar, weeks, and quarters

## Duration

```ts
import duration from 'temday-js/plugin/duration';

temday.extend(duration);

const value = temday.duration({ hour: 1, minute: 30 });
value.as('minute');
value.add(30, 'minute');
value.humanize();
value.toISOString();

temday.duration(90, 'minute').as('hour'); // 1.5
temday.duration('P2DT3H').toISOString();  // P2DT3H
```

Input can be a number and unit, an object, or an ISO-8601 duration string. A duration is an immutable independent value, not a core date instance.

## Calendar labels

```ts
import calendar from 'temday-js/plugin/calendar';

temday.extend(calendar);

temday().calendar();
temday('2026-09-01').calendar('2026-08-31');
temday('2026-09-01').calendar('2026-08-31', {
  nextDay: '[Tomorrow] HH:mm',
});
```

You can override `sameDay`, `nextDay`, `nextWeek`, `lastDay`, `lastWeek`, and `sameElse` with a format string or a function.

Week and quarter getters/setters are documented in [extended units](/get-set/calendar).
