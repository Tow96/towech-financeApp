/** middlewares.ts
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Class that holds all the express route middlewares
 */
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './db/prisma';

export default class Middlewares {
  // // Functions
  // // Checks if the given authorization string belongs to the superuser password
  // private static isSuperUser = (token: string): boolean => {
  //   if (!process.env.SUPERUSER_KEY || token !== process.env.SUPERUSER_KEY) {
  //     return false;
  //   }
  //   return true;
  // };

  // Checks if a jwt Token is valid
  private static isAuth = (token: string, isRefresh = false) => {
    if (!process.env.REFRESH_TOKEN_KEY || !process.env.AUTH_TOKEN_KEY) {
      throw { status: 500, message: 'No jwt encryption keys' };
    }

    try {
      const decodedToken = jwt.verify(
        `${token}`,
        isRefresh ? process.env.REFRESH_TOKEN_KEY : process.env.AUTH_TOKEN_KEY
      );
      return decodedToken as jwt.JwtPayload;
    } catch (err) {
      throw { status: 401, message: 'Invalid token' };
    }
  };

  // Middleware that checks if the requester is an admin
  // static checkAdmin = (req: NextRequest): void => {
  //   // Gets the Authorization header
  //   const authorization = req.headers.get('Authorization');
  //   console.log(authorization);
  //   // if (!authorization) {
  //   //   throw AmqpMessage.errorMessage('No authorization header', 401);
  //   // }

  //   // // Checks if the token is super user or an admin
  //   // const token = authorization.split(' ')[1];
  //   // if (!this.isSuperUser(token)) {
  //   //   // Decripts the token
  //   //   try {
  //   //     const decodedToken: any = this.isAuth(token);
  //   //     if (decodedToken.role !== 'admin') {
  //   //       throw AmqpMessage.errorMessage('User is not admin', 401);
  //   //     }
  //   //   } catch (err: any) {
  //   //     throw AmqpMessage.errorMessage('Invalid token', 401);
  //   //   }
  //   // }

  //   // next();
  // };

  // // Middleware that checks if the requester is authenticated
  static checkAuth = (req: Request) => {
    const authorization = req.headers.get('Authorization');
    if (!authorization) throw { status: 403, message: 'Invalid token' };

    // Check if the authToken is valid
    const decodedToken: any = this.isAuth(authorization.split(' ')[1]);
    console.log(decodedToken);
    return {
      _id: decodedToken._id,
      accountConfirmed: decodedToken.accountConfirmed,
      createdAt: decodedToken.createdAt,
      name: decodedToken.name,
      role: decodedToken.role,
      username: decodedToken.username,
    };
  };

  // Middleware that checks if the requester has a valid refreshToken
  static checkRefresh = async () => {
    try {
      // Gets the refreshToken from the jid cookie
      const refreshCookie = cookies().get('jid');
      const refreshToken = refreshCookie?.value || null;
      if (!refreshToken) throw { status: 403, message: 'No refresh token' };

      // Validates the token
      const decodedToken = this.isAuth(refreshToken, true);

      // Retrieves the user from the DB to verify
      const user = await prisma.users.findFirst({ where: { id: decodedToken._id } });
      if (!user) throw { status: 422, message: 'Bad credentials' };

      // Checks if the user has the token as still valid
      if (
        user.singleSessionToken !== refreshToken &&
        (!user.refreshTokens || !user.refreshTokens.includes(refreshToken))
      ) {
        throw { status: 403, message: 'Invalid token' };
      }

      return {
        _id: user.id,
        accountConfirmed: user.accountConfirmed,
        createdAt: user.createdAt,
        name: user.name,
        role: user.role,
        username: user.username,
      };
    } catch (error) {
      cookies().delete('jid');
      throw { status: 500, message: 'Unexpected error', error };
    }
  };

  // Middleware that checks if the user's account is confirmed, is meant to go after checkAuth if not, it fails automatically
  static checkConfirmed = (user: any): void => {
    if (!user.accountConfirmed) throw { status: 403, message: 'Email not confirmed' };
  };

  // // Middleware that checks if the requester is the owner of the account or an admin, is used for user requests, superuser will be rejected
  // static validateAdminOrOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     // This middleware is intended to be used after the checkAuth, so it will take the data from the req
  //     if (!req.user) throw AmqpMessage.errorMessage('Server Error, there is no user in the request', 501);

  //     const { _id, role } = req.user;

  //     if (_id !== req.params.userId && role.toUpperCase() !== 'ADMIN')
  //       throw AmqpMessage.errorMessage('Invalid user', 403);

  //     next();
  //   } catch (err: any) {
  //     AmqpMessage.sendHttpError(res, err);
  //   }
  // };
}
