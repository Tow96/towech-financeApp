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

@Injectable()
export class CheckAuthMiddleware implements NestMiddleware {
  private readonly _jwtSecret = this._configService.getOrThrow<string>('JWT_SECRET');
  constructor(private readonly _configService: ConfigService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    } catch (err: unknown) {
      AmqpMessage.sendHttpError(res, err);
    }
  }
}

@Injectable()
export class CheckConfirmedMiddleware implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async use(req: any, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        throw AmqpMessage.errorMessage('Server Error, there is no user in the request', 501);

      if (!req.user.accountConfirmed)
        throw AmqpMessage.errorMessage('Email not confirmed', 403, {
          confirmation: 'E-mail not verified',
        });

      next();
    } catch (err: unknown) {
      AmqpMessage.sendHttpError(res, err);
    }
  }
}
