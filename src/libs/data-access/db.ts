/** db.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Handles the postgres db connection
 */
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from './schema';

export class DbError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const dbClient = postgres(process.env.DB_URL || '', { max: 1 });
export const db = drizzle(dbClient, { schema });
