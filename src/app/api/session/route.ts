/** users/login
 * Copyright (c) 2024, Towechlabs
 *
 * Handler for logging in
 */
// Libraries ------------------------------------------------------------------
import { cookies } from 'next/headers';
import { isAuthenticated, Login, UsersModel } from '@/libs/feature-authentication';
import { apiHandler } from '@/utils';

// Login
export const POST = apiHandler(async req => {
  const validatedData = Login.parse(await req.json());
  const users = new UsersModel();

  const data = await users.login(validatedData);
  cookies().set(data.cookie.name, data.cookie.value, data.cookie.attributes);

  return { body: data.user, status: 200 };
});

// Refresh
export const GET = apiHandler(isAuthenticated, async req => {
  return { status: 200, body: JSON.parse(req.headers.get('user') || '{}') };
});

// Logout
export const DELETE = apiHandler(isAuthenticated, async req => {
  const deleteAll = new URL(req.url).searchParams.get('all') !== null;
  const userId: string = JSON.parse(req.headers.get('user') || '{}').id;
  const sessionId = req.headers.get('sessionId') || '';

  const users = new UsersModel();
  const data = await users.logout(sessionId, deleteAll ? userId : undefined);

  cookies().set(data.name, data.value, data.attributes);
});
