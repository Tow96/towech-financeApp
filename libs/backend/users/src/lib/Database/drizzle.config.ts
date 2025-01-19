import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './Users.Schema.ts',
  out: './migrations',
  dbCredentials: {
    url: process.env['DATABASE_URL'] ?? '',
  },
});
