/** db.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Handles the postgres db connection
 */
import postgres from 'postgres';

export class DbError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const dbClient = postgres(process.env.DB_URL || '', { max: 1 });
