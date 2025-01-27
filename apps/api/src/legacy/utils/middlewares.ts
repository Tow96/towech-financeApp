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
import { Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
// import logger from 'tow96-logger';
import { AmqpMessage } from 'tow96-amqpwrapper';
import { BaseUser } from '../Models/Objects/user';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '@financeapp/backend-authorization';

// Checks if a jwt Token is valid
const isAuth = (token: string, isRefresh = false): jwt.JwtPayload => {
  if (!process.env.REFRESH_TOKEN_KEY || !process.env.AUTH_TOKEN_KEY) {
    // logger.error('No jwt encryption keys provided');
    throw AmqpMessage.errorMessage('No jwt encryption keys');
  }

  try {
    const decodedToken = jwt.verify(
      token,
      isRefresh ? process.env.REFRESH_TOKEN_KEY : process.env.AUTH_TOKEN_KEY
    );
    return decodedToken as jwt.JwtPayload;
  } catch (err) {
    throw AmqpMessage.errorMessage('Invalid token', 401);
  }
};

@Injectable()
export class CheckAuthMiddleware implements NestMiddleware {
  private readonly _jwtSecret = this._configService.getOrThrow<string>('JWT_SECRET');
  constructor(private readonly _configService: ConfigService) {}

  async use(req: any, res: Response, next: NextFunction) {
    try {
      const header = req.header('Authorization') || '';
      const token = header.split('Bearer ')[1];

      try {
        const user = jwt.verify(token, this._jwtSecret) as TokenPayload;
        if (!user) return false;

        req.user = {
          _id: user.legacyId,
          role: user.role,
          accountConfirmed: user.accountVerified,
          createdAt: new Date(),
          name: 'unused',
          username: 'unused',
        } as BaseUser;
      } catch {
        return false;
      }
      next();
    } catch (err: any) {
      AmqpMessage.sendHttpError(res, err);
    }
  }
}

@Injectable()
export class CheckConfirmedMiddleware implements NestMiddleware {
  async use(req: any, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        throw AmqpMessage.errorMessage('Server Error, there is no user in the request', 501);

      if (!req.user.accountConfirmed)
        throw AmqpMessage.errorMessage('Email not confirmed', 403, {
          confirmation: 'E-mail not verified',
        });

      next();
    } catch (err: any) {
      AmqpMessage.sendHttpError(res, err);
    }
  }
}
