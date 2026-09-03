import { describe, expect, it } from '@rstest/core';
import manifest from '../../package.json' with { type: 'json' };

describe('package architecture', () => {
  it('preserves the only intentional side-effect entry', () => {
    expect(manifest.sideEffects).toEqual(['./dist/polyfill.js', './dist/polyfill.cjs']);
  });

  it('publishes only implemented entry points', () => {
    expect(Object.keys(manifest.exports)).toEqual([
      '.', './context', './polyfill', './full', './umd/*', './plugin/*', './locale/*',
    ]);
  });

  it('maps plugin and locale families to matching ESM, CJS, and declaration files', () => {
    expect(manifest.exports['./plugin/*']).toEqual({
      types: './dist/plugin/*.d.ts',
      import: './dist/plugin/*.js',
      require: './dist/plugin/*.cjs',
    });
    expect(manifest.exports['./locale/*']).toEqual({
      types: './dist/locale/*.d.ts',
      import: './dist/locale/*.js',
      require: './dist/locale/*.cjs',
    });
    expect(manifest.exports['./umd/*']).toEqual({
      default: './dist/umd/*.umd.min.js',
    });
  });

  it('keeps the root package free of production dependencies', () => {
    expect('dependencies' in manifest).toBe(false);
    expect('peerDependencies' in manifest).toBe(false);
  });

  it('declares a browser-safe CDN default artifact', () => {
    expect(manifest.unpkg).toBe('./dist/umd/core.umd.min.js');
    expect(manifest.jsdelivr).toBe('./dist/umd/core.umd.min.js');
  });
});
