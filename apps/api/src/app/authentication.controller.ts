/** index.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * index for all the authetication routes
 */
import { Body, Controller, Post, Res, Req, Patch, Param } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import Queue, { AmqpMessage } from 'tow96-amqpwrapper';
import jwt from 'jsonwebtoken';

import { RabbitMqService } from './rabbitMQ.service';
import { WorkerChangeEmail, WorkerGetUserByUsername } from '../Models/Requests/userService';
import { LoginRequest } from '../Models/Requests/webApi';
import { BackendUser, FrontendUser } from '../Models/Objects/user';
import TokenGenerator from '../utils/tokenGenerator';
import logoutUser from '../utils/logoutUser';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly appService: RabbitMqService) {}

  private userQueue: string = process.env.USER_QUEUE || 'userQueue';

  @Post('login')
  async login(@Body() loginRequest: LoginRequest, @Res({ passthrough: true }) res: any) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      const corrId = await Queue.publishWithReply(channel, this.userQueue, {
        status: 200,
        type: 'get-byUsername',
        payload: {
          username: loginRequest.username,
        } as WorkerGetUserByUsername,
      });
      const response: AmqpMessage<BackendUser> = await Queue.fetchFromQueue(channel, corrId, corrId);
      const user = response.payload;
      if (!user) throw AmqpMessage.errorMessage('Bad credentials', 422, { login: 'Bad credentials' });

      // Compares the password
      const validPassword = await bcrypt.compare(loginRequest.password, user.password!);
      if (!validPassword) throw AmqpMessage.errorMessage('Bad credentials', 422, { login: 'Bad credentials' });

      const authToken = TokenGenerator.authToken(user);
      const refreshToken = TokenGenerator.refreshToken(user, loginRequest.keepSession);

      // Adds the refreshToken to the user
      if (loginRequest.keepSession) {
        // Creates an empty array if there are no tokens
        if (!user.refreshTokens) {
          user.refreshTokens = [];
        }

        // removes the last used refreshToken if there are more than 5
        if (user.refreshTokens.length >= 5) {
          user.refreshTokens.shift();
        }

        // Adds the new refresh token
        user.refreshTokens.push(refreshToken);
      } else {
        user.singleSessionToken = refreshToken;
      }

      // Query the DB, doesn't wait for response
      Queue.publishSimple(channel, this.userQueue, {
        status: 200,
        type: 'log',
        payload: user as FrontendUser,
      });

      // Possible expiration date for the cookie
      const now = new Date();
      const expiration = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      if (process.env.NODE_ENV === 'development') {
        res.cookie('jid', refreshToken, { httpOnly: true, expires: loginRequest.keepSession ? expiration : undefined });
      } else {
        res.cookie('jid', refreshToken, {
          httpOnly: true,
          expires: loginRequest.keepSession ? expiration : undefined,
          secure: true,
          // domain: process.env.COOKIEDOMAIN || '',
        });
      }

      res.send({ token: authToken });
    } catch (error) {
      AmqpMessage.sendHttpError(res, error);
    }
  }

  @Post('refresh')
  async refresh(@Req() req: any) {
    const authToken = TokenGenerator.authToken(req.user);
    return { token: authToken };
  }

  @Post('logout')
  async logout(@Req() req: any, @Res() res: any) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // Logs out the refreshToken
      logoutUser(channel, req.user, req.cookies.jid);

      res.clearCookie('jid');
      res.sendStatus(204);
    } catch (err) {
      AmqpMessage.sendHttpError(res, err);
    }
  }

  @Post('logout-all')
  async logoutAll(@Req() req: any, @Res() res: any) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // Updates the user by removing all tokens
      logoutUser(channel, req.user);

      res.clearCookie('jid');
      res.sendStatus(204);
    } catch (err) {
      AmqpMessage.sendHttpError(res, err);
    }
  }

  @Patch('verify/:token')
  async verifyEmail(@Param('token') token: string, @Res() res: any) {
    try {
      // extracts and verifies the payload
      try {
        const connection = await Queue.startConnection();
        const channel = await Queue.setUpChannelAndExchange(connection);
        const payload: any = jwt.verify(token, process.env.EMAILVERIFICATION_TOKEN_KEY || '');

        // Queries the DB, doesn't wait for response
        Queue.publishSimple(channel, this.userQueue, {
          status: 200,
          type: 'verify-email',
          payload: payload as WorkerChangeEmail,
        });

        res.sendStatus(204);
      } catch (e) {
        throw AmqpMessage.errorMessage('Invalid token', 422);
      }
    } catch (err) {
      AmqpMessage.sendHttpError(res, err);
    }
  }
}
