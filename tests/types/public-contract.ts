import temday, { type TemdayFactory } from '../../src/index.js';
import { createTemday } from '../../src/context.js';
import full from '../../src/full.js';
import localeData from '../../src/plugin/localeData.js';

const factory: TemdayFactory = temday;
factory('2026-08-31');
createTemday({ timeZone: 'UTC' });

factory('31/08/2026', 'DD/MM/YYYY');
// Locale state is installed by the locale plugin rather than a context option.
// @ts-expect-error locale state is a plugin concern, not a context option.
createTemday({ locale: 'en' });
factory.extend(localeData);
factory.locale('en');

full('31/08/2026', 'DD/MM/YYYY').isBetween('2026-08-01', '2026-09-01');
full.duration(1_000).humanize();
