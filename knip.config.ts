import type { KnipConfig } from 'knip';

/**
 * Knip configuration for dead code detection
 *
 * Uses a flat configuration with path aliases from tsconfig.base.json.
 * For Nx monorepos, we analyze from the root with explicit entry points.
 */
const config: KnipConfig = {
  // Entry points for all apps and libs
  entry: [
    // Backend API
    'apps/api/src/main.ts',
    // Frontend App - routes are entry points for TanStack Router
    'apps/notes/src/main.tsx',
    'apps/notes/src/routes/**/*.tsx',
    // Library exports
    'libs/*/src/index.ts',
    'libs/*/*/src/index.ts',
  ],
  project: [
    'apps/*/src/**/*.{ts,tsx}',
    'libs/*/src/**/*.{ts,tsx}',
    'libs/*/*/src/**/*.{ts,tsx}',
  ],
  // Path aliases from tsconfig.base.json
  paths: {
    '@/*': ['apps/notes/src/*'],
    '@knowtis/design-system': ['libs/design-system/src/index.ts'],
    '@knowtis/shared-hooks': ['libs/shared/hooks/src/index.ts'],
    '@knowtis/shared-util': ['libs/shared/util/src/index.ts'],
    '@knowtis/shared-types': ['libs/shared/types/src/index.ts'],
    '@knowtis/api-client': ['libs/api-client/src/index.ts'],
    '@knowtis/data-access-notes': ['libs/data-access/notes/src/index.ts'],
    '@knowtis/auth': ['libs/auth/src/index.ts'],
  },
  ignore: [
    // Test files
    '**/*.spec.{ts,tsx}',
    '**/*.test.{ts,tsx}',
    // Generated files
    'apps/notes/src/routeTree.gen.ts',
    // Type declarations
    '**/*.d.ts',
    // Build artifacts
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**',
    '**/.nx/**',
    // Config files
    '**/vite.config.ts',
    '**/vitest.config.{ts,mts}',
    '**/vitest.workspace.ts',
    '**/eslint.config.{js,mjs}',
    '**/drizzle.config.ts',
    '**/webpack.config.cjs',
    '**/project.json',
    '**/.storybook/**',
    // Feature flag guard is prepared for future use
    'apps/api/src/modules/feature-flags/feature-flag.guard.ts',
    // Library barrel files (used via @knowtis/* path aliases - knip can't resolve these)
    'libs/*/src/index.ts',
    'libs/*/*/src/index.ts',
    'libs/auth/src/*/index.ts',
    // Frontend barrel files and test setup
    'apps/notes/src/components/*/index.ts',
    'apps/notes/src/*/index.ts',
    'apps/notes/src/test/setup.ts',
  ],
  // Domain exception classes and types are intentionally exported for DDD
  ignoreExportsUsedInFile: {
    interface: true,
    type: true,
  },
};

export default config;
