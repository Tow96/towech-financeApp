import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: [
    './src/libs/feature-transactions/schema.ts',
    './src/libs/feature-authentication/Schema.ts',
  ],
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DB_URL || '',
  },
  verbose: true,
  strict: true,
});
