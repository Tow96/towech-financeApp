/** DataAccessDb.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Class that wraps the db connection
 * When cache is implemented, it should also be handled here
 */
// Libraries ------------------------------------------------------------------
import { ObjectId } from 'bson';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Argon2id, Bcrypt } from 'oslo/password';
import { dbClient } from '@/utils';
// Schemas --------------------------------------------------------------------
import * as schema from './Schema';
import { InsertUser, User, usersTable, selectUserSchema } from './Schema';

export class UsersDb {
  private connection = drizzle(dbClient, { schema });

  add = async (user: InsertUser, password: string): Promise<User> => {
    const id = new ObjectId().toString();
    const hashedPassword = await new Argon2id().hash(password);

    const newUser = (
      await this.connection
        .insert(usersTable)
        .values({ ...user, hashedPassword, id })
        .returning()
    )[0];
    return selectUserSchema.parse(newUser);
  };

  getByEmail = async (email: string): Promise<User | null> => {
    const dbUser = await this.connection.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
    if (!dbUser) return null;
    return selectUserSchema.parse(dbUser);
  };

  verifyPassword = async (id: string, password: string): Promise<boolean> => {
    const dbUser = await this.connection.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    });

    if (dbUser?.hashedPassword.startsWith('$argon2id$'))
      return await new Argon2id().verify(dbUser?.hashedPassword || '', password);

    // bcrypt conversion into Argon2id
    const valid = await new Bcrypt().verify(dbUser?.hashedPassword || '', password);
    if (!valid) return false;

    const updatedPassword = await new Argon2id().hash(password);
    await this.connection
      .update(usersTable)
      .set({ hashedPassword: updatedPassword, updatedAt: new Date() })
      .where(eq(usersTable.id, id));

    return true;
  };
}
