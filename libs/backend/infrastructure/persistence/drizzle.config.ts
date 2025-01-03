import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/**/*.Schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://postgres:postgres@localhost:5432/postgres',
  },
});
