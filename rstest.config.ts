import { defineConfig } from '@rstest/core';

export default defineConfig({
  testEnvironment: 'node',
  setupFiles: ['./tests/setup.ts'],
  include: ['./tests/**/*.test.ts'],
  coverage: {
    provider: 'v8',
    reporters: ['text', 'json-summary', 'json'],
    thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 },
    exclude: ['tests/**'],
  },
});
