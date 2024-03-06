/** route.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Handlers for the users route
 */
// Libraries ------------------------------------------------------------------
import { alphabet, generateRandomString } from 'oslo/crypto';
import { UsersModel, isSuperUserOrAdmin } from '@/libs/feature-authentication';
import { insertUserSchema } from '@/libs/feature-authentication/Schema';
import { apiHandler, Mailer } from '@/utils';

export const POST = apiHandler(isSuperUserOrAdmin, async req => {
  const validatedData = insertUserSchema.parse(await req.json());
  const password = generateRandomString(8, alphabet('a-z'));

  const users = new UsersModel();
  const user = await users.register(validatedData, password);

  const mailer = new Mailer();
  await mailer.sendRegistrationEmail(user.email, user.name, password);

  return { body: user, status: 201 };
});
