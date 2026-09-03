import temday from './index.js';
import advancedFormat from './plugin/advancedFormat.js';
import arraySupport from './plugin/arraySupport.js';
import bigIntSupport from './plugin/bigIntSupport.js';
import buddhistEra from './plugin/buddhistEra.js';
import calendar from './plugin/calendar.js';
import customParseFormat from './plugin/customParseFormat.js';
import dayOfYear from './plugin/dayOfYear.js';
import duration from './plugin/duration.js';
import isBetween from './plugin/isBetween.js';
import isLeapYear from './plugin/isLeapYear.js';
import isSameOrAfter from './plugin/isSameOrAfter.js';
import isSameOrBefore from './plugin/isSameOrBefore.js';
import isToday from './plugin/isToday.js';
import isTomorrow from './plugin/isTomorrow.js';
import isYesterday from './plugin/isYesterday.js';
import isoWeek from './plugin/isoWeek.js';
import localeData from './plugin/localeData.js';
import localizedFormat from './plugin/localizedFormat.js';
import minMax from './plugin/minMax.js';
import negativeYear from './plugin/negativeYear.js';
import objectSupport from './plugin/objectSupport.js';
import parserPipeline from './plugin/parserPipeline.js';
import pluralGetSet from './plugin/pluralGetSet.js';
import preParsePostFormat from './plugin/preParsePostFormat.js';
import quarterOfYear from './plugin/quarterOfYear.js';
import relativeTime from './plugin/relativeTime.js';
import timezone from './plugin/timezone.js';
import toArray from './plugin/toArray.js';
import toObject from './plugin/toObject.js';
import tokenRegistry from './plugin/tokenRegistry.js';
import updateLocale from './plugin/updateLocale.js';
import utc from './plugin/utc.js';
import weekday from './plugin/weekday.js';
import weekOfYear from './plugin/weekOfYear.js';
import weekYear from './plugin/weekYear.js';

export type {} from './plugin/advancedFormat.js';
export type {} from './plugin/arraySupport.js';
export type {} from './plugin/bigIntSupport.js';
export type {} from './plugin/buddhistEra.js';
export type {} from './plugin/calendar.js';
export type {} from './plugin/customParseFormat.js';
export type {} from './plugin/dayOfYear.js';
export type { Duration } from './plugin/duration.js';
export type {} from './plugin/isBetween.js';
export type {} from './plugin/isLeapYear.js';
export type {} from './plugin/isSameOrAfter.js';
export type {} from './plugin/isSameOrBefore.js';
export type {} from './plugin/isToday.js';
export type {} from './plugin/isTomorrow.js';
export type {} from './plugin/isYesterday.js';
export type {} from './plugin/isoWeek.js';
export type {} from './plugin/localeData.js';
export type {} from './plugin/localizedFormat.js';
export type {} from './plugin/minMax.js';
export type {} from './plugin/negativeYear.js';
export type {} from './plugin/objectSupport.js';
export type {} from './plugin/parserPipeline.js';
export type {} from './plugin/pluralGetSet.js';
export type {} from './plugin/preParsePostFormat.js';
export type {} from './plugin/quarterOfYear.js';
export type {} from './plugin/relativeTime.js';
export type {} from './plugin/timezone.js';
export type {} from './plugin/toArray.js';
export type {} from './plugin/toObject.js';
export type {} from './plugin/tokenRegistry.js';
export type {} from './plugin/updateLocale.js';
export type {} from './plugin/utc.js';
export type {} from './plugin/weekday.js';
export type {} from './plugin/weekOfYear.js';
export type {} from './plugin/weekYear.js';

/**
 * Preconfigured factory with all non-mutating, published plugins.
 * `badMutable` remains opt-in because it changes temday's immutable API.
 */
for (const plugin of [
  localeData, localizedFormat, advancedFormat, tokenRegistry, updateLocale,
  parserPipeline, preParsePostFormat, customParseFormat, objectSupport, arraySupport, bigIntSupport, negativeYear,
  utc, timezone, relativeTime, duration, calendar, weekOfYear, isoWeek, quarterOfYear, weekday, weekYear,
  isBetween, isSameOrAfter, isSameOrBefore, minMax, toArray, toObject, pluralGetSet,
  isLeapYear, dayOfYear, isToday, isTomorrow, isYesterday, buddhistEra,
]) temday.extend(plugin);

export * from './index.js';
export default temday;
