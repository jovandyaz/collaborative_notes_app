import { resolve } from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@knowtis/design-system': resolve(
        __dirname,
        '../../libs/design-system/src/index.ts'
      ),
      '@knowtis/shared-hooks': resolve(
        __dirname,
        '../../libs/shared/hooks/src/index.ts'
      ),
      '@knowtis/shared-util': resolve(
        __dirname,
        '../../libs/shared/util/src/index.ts'
      ),
      '@knowtis/data-access-notes': resolve(
        __dirname,
        '../../libs/data-access/notes/src/index.ts'
      ),
    },
  },
});
