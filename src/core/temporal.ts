import type { TemporalNamespace } from '../types.js';

let configuredTemporal: TemporalNamespace | undefined;

/** Supplies Temporal without making a polyfill a production dependency. */
export function configure(options: { Temporal: TemporalNamespace }): void {
  if (!options?.Temporal) throw new TypeError('Temporal required');
  configuredTemporal = options.Temporal;
  (globalThis as { Temporal?: TemporalNamespace }).Temporal = options.Temporal;
}

export function temporal(): TemporalNamespace {
  const value = configuredTemporal ?? (globalThis as { Temporal?: TemporalNamespace }).Temporal;
  if (!value) {
    throw new Error('Temporal unavailable');
  }
  return value;
}

export function defaultTimeZone(): string {
  const T = temporal();
  return T.Now.timeZoneId();
}
