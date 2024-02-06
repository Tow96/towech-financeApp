import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/libs/data-access/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DB_URL || '',
  },
  verbose: true,
  strict: true,
});
