/** Middleware.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Middleware for the user related routes
 */

import { ErrorResponse, Middleware } from '@/utils';

export const isSuperUserOrAdmin: Middleware = async req => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) throw new ErrorResponse('Unauthorized', null, 401);
  // TODO add admin check
  if (authHeader !== process.env.SUPERUSER_KEY) throw new ErrorResponse('Unauthorized', null, 401);
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

// export const isAuthenticated: Middleware = async req => {
//   const authorization = req.headers.get('Authorization');
//   if (!authorization) throw new ErrorResponse('No token', null, 401);

//   const decodedToken: any = validateToken(authorization.split(' ')[1]);
//   const user = {
//     _id: decodedToken._id,
//     accountConfirmed: decodedToken.accountConfirmed,
//     createdAt: decodedToken.createdAt,
//     name: decodedToken.name,
//     role: decodedToken.role,
//     username: decodedToken.username,
//   };

//   req.headers.set('userId', user._id);
// };

// export const isAccountConfirmed: Middleware = async req => {
//   const userid = req.headers.get('userId');
//   if (!userid) throw new ErrorResponse('User not authenticated', null, 401);

//   const user = await prisma.users.findFirst({ where: { id: userid } });
//   if (!user || !user.accountConfirmed)
//     throw new ErrorResponse('User account is not confirmed', null, 403);
// };
