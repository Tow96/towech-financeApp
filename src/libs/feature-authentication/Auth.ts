/** Auth.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Handles the Lucia Auth config
 */
// Libraries ------------------------------------------------------------------
import { Lucia, TimeSpan } from 'lucia';
import { PostgresJsAdapter } from '@lucia-auth/adapter-postgresql';
// data access ----------------------------------------------------------------
import { dbClient } from '@/libs/data-access';
// tables ---------------------------------------------------------------------
import { User, tableNames } from './Schema';

const adapter = new PostgresJsAdapter(dbClient, {
  user: tableNames.USERS,
  session: tableNames.SESSIONS,
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
      // TODO: other attributes
    },
  },
  sessionExpiresIn: new TimeSpan(30, 'd'),
  getUserAttributes: attributes => ({
    id: attributes.id,
    name: attributes.name,
    email: attributes.email,
    accountConfirmed: attributes.account_confirmed,
    role: attributes.role,
    createdAt: attributes.created_at,
    updatedAt: attributes.updated_at,
  }),
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}
