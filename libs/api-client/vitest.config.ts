import { resolve } from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      '@knowtis/shared-types': resolve(
        __dirname,
        '../shared/types/src/index.ts'
      ),
    },
  },
});
