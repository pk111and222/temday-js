import { appendFileSync, readdirSync } from 'node:fs';

// Rslib's CJS output exposes an ESM namespace. temday-compatible CJS consumers
// expect `require('temday')` itself to be the factory, while named exports stay
// available as properties on that callable value.
appendFileSync(
  new URL('../dist/index.cjs', import.meta.url),
  ';Object.assign(exports.default,exports);module.exports=exports.default;',
);
appendFileSync(
  new URL('../dist/full.cjs', import.meta.url),
  ';Object.assign(exports.default,exports);module.exports=exports.default;',
);

// The browser UMD build follows the same callable-default convention as CJS.
appendFileSync(
  new URL('../dist/umd/core.umd.min.js', import.meta.url),
  ';if(globalThis.temday?.default){Object.assign(globalThis.temday.default,globalThis.temday);globalThis.temday=globalThis.temday.default}',
);
appendFileSync(
  new URL('../dist/umd/full.umd.min.js', import.meta.url),
  ';if(globalThis.temday?.default){Object.assign(globalThis.temday.default,globalThis.temday);globalThis.temday=globalThis.temday.default}',
);

for (const directory of ['plugin', 'locale']) for (const entry of readdirSync(new URL(`../dist/${directory}/`, import.meta.url))) {
  if (entry.endsWith('.cjs')) appendFileSync(new URL(`../dist/${directory}/${entry}`, import.meta.url), ';Object.assign(exports.default,exports);module.exports=exports.default;');
}
