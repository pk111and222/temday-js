import { describe, expect, it } from '@rstest/core';
import calendar from '../../src/plugin/calendar.js';
import duration from '../../src/plugin/duration.js';
import isoWeek from '../../src/plugin/isoWeek.js';
import quarterOfYear from '../../src/plugin/quarterOfYear.js';
import relativeTime from '../../src/plugin/relativeTime.js';
import timezone from '../../src/plugin/timezone.js';
import utcPlugin from '../../src/plugin/utc.js';
import weekOfYear from '../../src/plugin/weekOfYear.js';
import { createTemday } from '../../src/context.js';

describe('time, duration, and calendar plugins', () => {
  it('creates UTC values, fixed offsets, and IANA time-zone views', () => {
    const date = createTemday({ timeZone: 'UTC' }).extend(utcPlugin).extend(timezone);
    expect(date.utc('2026-08-31T12:00:00').format()).toBe('2026-08-31T12:00:00Z');
    expect(date('2026-08-31T12:00:00Z').tz('Asia/Shanghai').format()).toBe('2026-08-31T20:00:00+08:00');
    expect(date.tz('2026-08-31T12:00:00', 'Asia/Shanghai').format()).toBe('2026-08-31T12:00:00+08:00');
    expect(date('2026-08-31T12:00:00Z').utcOffset(480).format('Z')).toBe('+08:00');
    expect(date.utc('2026-08-31T12:00:00+08:00').format('HH:mm Z')).toBe('04:00 Z');
    expect(date('2026-08-31T12:00:00Z').utcOffset('-0530', true).format('HH:mm Z')).toBe('12:00 -05:30');
    expect(date('2026-08-31T12:00:00Z').utc().isUTC()).toBe(true);
    expect(date('2026-08-31T12:00:00Z').local().isValid()).toBe(true);
    date.tz.setDefault('Asia/Shanghai');
    expect(date.tz('2026-08-31T12:00:00').format('Z')).toBe('+08:00');
    date.tz.setDefault();
    expect(date.tz.guess()).toBeTruthy();
  });

  it('adds Duration and human relative-time APIs without core coupling', () => {
    const date = createTemday({ timeZone: 'UTC' }).extend(duration).extend(relativeTime);
    const value = date.duration({ hour: 1, minute: 30 });
    expect(value.as('minute')).toBe(90);
    expect(value.add(30, 'minute').toISOString()).toBe('PT2H');
    expect(date.duration(2, 'hour').get('hour')).toBe(2);
    expect(date.duration('PT1H30M').milliseconds()).toBe(0);
    expect(date.duration({ day: 1 }).subtract(12, 'hour').valueOf()).toBe(43_200_000);
    expect(date.duration(-1, 'day').toJSON()).toBe('-P1D');
    expect(value.humanize()).toBe('2 hours');
    expect(value.humanize(true)).toContain('in');
    expect(date('2026-08-03').from('2026-08-01')).toBe('in 2 days');
    expect(date('2026-08-01').to('2026-08-03')).toBe('in 2 days');
    expect(date('2026-08-03').from('2026-08-01', true)).toBe('2 days');
    expect(date('2026-08-03').fromNow()).toBeTypeOf('string');
    expect(date('2026-08-03').toNow()).toBeTypeOf('string');
  });

  it('provides calendar labels, locale weeks, ISO weeks, and quarters', () => {
    const date = createTemday({ timeZone: 'UTC' }).extend(calendar).extend(weekOfYear).extend(isoWeek).extend(quarterOfYear);
    expect(date('2026-08-31T13:04').calendar('2026-08-31').replace(/\s+/g, ' ')).toBe('Today at 1:04 PM');
    expect(date('2026-08-30').calendar('2026-08-31')).toContain('Yesterday');
    expect(date('2026-09-01').calendar('2026-08-31')).toContain('Tomorrow');
    expect(date('2026-09-03').calendar('2026-08-31')).toContain('at');
    expect(date('2026-09-10').calendar('2026-08-31')).toBe('09/10/2026');
    expect(date('2026-08-31').calendar('2026-08-31', { sameDay: () => 'custom' })).toBe('custom');
    expect(date('2021-01-03').week()).toBe(2);
    expect(date('2021-01-03').week(3).format('YYYY-MM-DD')).toBe('2021-01-10');
    expect(date('2021-01-03').weeksInYear()).toBe(52);
    expect(date('2022-01-01').weeksInYear()).toBe(53);
    expect(date('2021-01-04').isoWeek()).toBe(1);
    expect(date('2021-01-03').isoWeekYear()).toBe(2020);
    expect(date('2021-01-04').isoWeekYear()).toBe(2021);
    expect(date('2021-01-04').isoWeek(2).format('YYYY-MM-DD')).toBe('2021-01-11');
    expect(date('2021-01-04').isoWeekday()).toBe(1);
    expect(date('2021-01-04').isoWeekday(7).format('YYYY-MM-DD')).toBe('2021-01-10');
    expect(date('2020-12-31').isoWeeksInYear()).toBe(53);
    expect(date('2026-08-31').quarter()).toBe(3);
    expect(date('2026-08-31').quarter(1).format('YYYY-MM-DD')).toBe('2026-02-28');
  });
});
