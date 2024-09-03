/** middlewares.ts
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Class that holds all the express route middlewares
 */
// Libraries
import dotenv from 'dotenv';
dotenv.config();
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';
// import logger from 'tow96-logger';
import Queue, { AmqpMessage } from 'tow96-amqpwrapper';

// Models
import { WorkerGetUserById } from '../Models/requests';
import { BackendUser } from '../Models/Objects/user';

// utils
import UserConverter from '../utils/userConverter';

// Checks if a jwt Token is valid
const isAuth = (token: string, isRefresh = false): jwt.JwtPayload => {
  if (!process.env.REFRESH_TOKEN_KEY || !process.env.AUTH_TOKEN_KEY) {
    // logger.error('No jwt encryption keys provided');
    throw AmqpMessage.errorMessage('No jwt encryption keys');
  }

  try {
    const decodedToken = jwt.verify(token, isRefresh ? process.env.REFRESH_TOKEN_KEY : process.env.AUTH_TOKEN_KEY);
    return decodedToken as jwt.JwtPayload;
  } catch (err) {
    throw AmqpMessage.errorMessage('Invalid token', 401);
  }
};

@Injectable()
export class CheckRefreshMiddleware implements NestMiddleware {
  private userQueue: string = process.env.USER_QUEUE || 'userQueue';

  async use(req: any, res: Response, next: NextFunction) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // Gets the refreshToken from the jid cookie
      const refreshToken = req.cookies.jid;
      if (!refreshToken) throw AmqpMessage.errorMessage('No refresh token', 403);

      // Validates the token
      const decodedToken = isAuth(refreshToken, true);

      // Retrieves the user from the DB to verify
      const corrId = await Queue.publishWithReply(channel, this.userQueue, {
        status: 200,
        type: 'get-byId',
        payload: decodedToken as WorkerGetUserById,
      });
      const response = await Queue.fetchFromQueue(channel, corrId, corrId);
      const user: BackendUser = response.payload;
      if (!user) throw AmqpMessage.errorMessage('Bad credentials', 422, { login: 'Bad credentials' });

      // Checks if the user has the token as still valid
      if (
        user.singleSessionToken !== refreshToken &&
        (!user.refreshTokens || !user.refreshTokens.includes(refreshToken))
      ) {
        throw AmqpMessage.errorMessage('Invalid token', 403);
      }

      // Converts the BackendUser into a BaseUser
      req.user = UserConverter.convertToBaseUser(user);

      next();
    } catch (error) {
      res.clearCookie('jid');
      AmqpMessage.sendHttpError(res, error);
    }
  }
}

// export default class Middlewares {
//   private static userQueue = (process.env.USER_QUEUE as string) || 'userQueue';

//   // Functions
//   // Checks if the given authorization string belongs to the superuser password
//   private static isSuperUser = (token: string): boolean => {
//     if (!process.env.SUPERUSER_KEY || token !== process.env.SUPERUSER_KEY) {
//       return false;
//     }
//     return true;
//   };

//   // Middleware that checks if the requester is an admin
//   static checkAdmin = (req: Request, res: Response, next: NextFunction): void => {
//     try {
//       // Gets the Authorization header
//       const authorization = req.headers.authorization;
//       if (!authorization) {
//         throw AmqpMessage.errorMessage('No authorization header', 401);
//       }

//       // Checks if the token is super user or an admin
//       const token = authorization.split(' ')[1];
//       if (!this.isSuperUser(token)) {
//         // Decripts the token
//         try {
//           const decodedToken: any = this.isAuth(token);
//           if (decodedToken.role !== 'admin') {
//             throw AmqpMessage.errorMessage('User is not admin', 401);
//           }
//         } catch (err: any) {
//           throw AmqpMessage.errorMessage('Invalid token', 401);
//         }
//       }

//       next();
//     } catch (err: any) {
//       AmqpMessage.sendHttpError(res, err);
//     }
//   };

//   // Middleware that checks if the requester is authenticated
//   static checkAuth = (req: Request, res: Response, next: NextFunction): void => {
//     try {
//       const authorization = req.headers.authorization;

//       if (!authorization) throw AmqpMessage.errorMessage('Invalid token', 403);

//       // Check if the authToken is valid
//       const decodedToken: any = this.isAuth(authorization.split(' ')[1]);

//       req.user = decodedToken as Objects.User.BaseUser;

//       next();
//     } catch (err: any) {
//       AmqpMessage.sendHttpError(res, err);
//     }
//   };

//   // Middleware that checks if the user's account is confirmed, is meant to go after checkAuth if not, it fails automatically
//   static checkConfirmed = (req: Request, res: Response, next: NextFunction): void => {
//     try {
//       if (!req.user) throw AmqpMessage.errorMessage('Server Error, there is no user in the request', 501);

//       if (!req.user.accountConfirmed)
//         throw AmqpMessage.errorMessage('Email not confirmed', 403, { confirmation: 'E-mail not verified' });

//       next();
//     } catch (err: any) {
//       AmqpMessage.sendHttpError(res, err);
//     }
//   };

//   // Middleware that checks if the requester is the owner of the account or an admin, is used for user requests, superuser will be rejected
//   static validateAdminOrOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       // This middleware is intended to be used after the checkAuth, so it will take the data from the req
//       if (!req.user) throw AmqpMessage.errorMessage('Server Error, there is no user in the request', 501);

//       const { _id, role } = req.user;

//       if (_id !== req.params.userId && role.toUpperCase() !== 'ADMIN')
//         throw AmqpMessage.errorMessage('Invalid user', 403);

//       next();
//     } catch (err: any) {
//       AmqpMessage.sendHttpError(res, err);
//     }
//   };
// }
