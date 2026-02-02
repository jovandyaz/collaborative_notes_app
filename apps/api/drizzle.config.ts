import type { Config } from 'drizzle-kit';

const config: Config = {
  schema: './src/database/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env['DATABASE_URL'] || '',
  },
  verbose: true,
  strict: true,
};

export default config;
