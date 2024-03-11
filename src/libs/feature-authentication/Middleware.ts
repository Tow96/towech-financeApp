/** Middleware.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Middleware for the user related routes
 */
import { ErrorResponse, Middleware } from '@/utils';
import { cookies } from 'next/headers';
import { lucia } from './Auth';

export const isSuperUserOrAdmin: Middleware = async req => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) throw new ErrorResponse('Unauthorized', null, 401);
  // TODO add admin check
  if (authHeader !== process.env.SUPERUSER_KEY) throw new ErrorResponse('Unauthorized', null, 401);
};

export const isAuthenticated: Middleware = async req => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) throw new ErrorResponse('Unauthorized', null, 401);

  const result = await lucia.validateSession(sessionId);
  if (!result.session) {
    const emptyCookie = lucia.createBlankSessionCookie();
    cookies().set(emptyCookie.name, emptyCookie.value, emptyCookie.attributes);
    throw new ErrorResponse('Unauthorized', null, 401);
  }
  if (result.session.fresh) {
    const newCookie = lucia.createSessionCookie(result.session.id);
    cookies().set(newCookie.name, newCookie.value, newCookie.attributes);
  }
  req.headers.set('user', JSON.stringify(result.user));
  req.headers.set('sessionId', result.session.id);
};
// TODO: fix this when user is migrated
// import jwt from 'jsonwebtoken';
// import { ErrorResponse, Middleware } from '@/utils/middlewareHandler';
// import { prisma } from '@/libs/legacyStuff/db/prisma';

// const validateToken = (token: string, isRefresh = false) => {
//   try {
//     const decodedToken = jwt.verify(
//       `${token}`,
//       isRefresh ? process.env.REFRESH_TOKEN_KEY || '' : process.env.AUTH_TOKEN_KEY || ''
//     );
//     return decodedToken as jwt.JwtPayload;
//   } catch (err) {
//     throw new ErrorResponse('Invalid token', err, 401);
//   }
// };

// export const isAccountConfirmed: Middleware = async req => {
//   const userid = req.headers.get('userId');
//   if (!userid) throw new ErrorResponse('User not authenticated', null, 401);

//   const user = await prisma.users.findFirst({ where: { id: userid } });
//   if (!user || !user.accountConfirmed)
//     throw new ErrorResponse('User account is not confirmed', null, 403);
// };
