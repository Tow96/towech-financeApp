/** Model.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Class that handles the Database Authentication Model
 */
// Libraries ------------------------------------------------------------------
import { ObjectId } from 'bson';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Argon2id } from 'oslo/password';

import { dbClient } from '@/libs/data-access';
import { ErrorResponse } from '@/utils/middlewareHandler';

// Schemas --------------------------------------------------------------------
import * as schema from './Schema';
import { InsertUser, insertUserSchema, users } from './Schema';

export class AuthenticationModel {
  private db = drizzle(dbClient, { schema });

  register = async (user: InsertUser, password: string) => {
    const validatedUser = insertUserSchema.parse(user);

    const id = new ObjectId().toString();
    const hashedPassword = await new Argon2id().hash(password);

    const userExists = await this.db.query.users.findFirst({ where: eq(users.email, user.email) });
    if (userExists) throw new ErrorResponse(`email ${user.email} already registered`, {}, 422);

    const newUser = (
      await this.db
        .insert(users)
        .values({
          ...validatedUser,
          hashedPassword,
          id,
          accountConfirmed: true, // TODO: Remove
        })
        .returning()
    )[0]; // TODO: clean user

    return newUser;
  };
}
