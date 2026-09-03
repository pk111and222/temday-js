import { Temporal } from '@js-temporal/polyfill';

/** Optional side-effect entry. A host/Babel-provided Temporal always wins. */
const host = globalThis as { Temporal?: unknown };
if (!host.Temporal) host.Temporal = Temporal;
