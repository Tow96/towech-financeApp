/** index.ts
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * index for all the users routes
 */
import { Controller, Get, Res, Req, Post, Put, Body, Patch, Param } from '@nestjs/common';
import Queue, { AmqpMessage } from 'tow96-amqpwrapper';
import { BackendUser, BaseUser, FrontendUser } from './Models/Objects/user';
import UserConverter from './utils/userConverter';
import {
  WorkerChangeEmail,
  WorkerChangePassword,
  WorkerGetUserById,
  WorkerGetUserByUsername,
  WorkerPasswordReset,
  WorkerRegisterUser,
} from './Models/requests';
import TokenGenerator from './utils/tokenGenerator';
import jwt from 'jsonwebtoken';

@Controller('users')
export class UserController {
  private userQueue = (process.env.USER_QUEUE as string) || 'userQueue';
  private transactionQueue = (process.env.TRANSACTION_QUEUE as string) || 'transactionQueue';
  private categoryQueue = (process.env.CATEGORY_QUEUE as string) || 'categoryQueue';

  @Get('')
  async getAllUsers(@Res() res: any) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      const corrId = await Queue.publishWithReply(channel, this.userQueue, {
        status: 200,
        type: 'get-users',
        payload: null,
      });

      const response = await Queue.fetchFromQueue(channel, corrId, corrId);
      const users: BackendUser[] = response.payload;

      const output: BaseUser[] = [];

      users.map((user) => {
        output.push(UserConverter.convertToBaseUser(user));
      });

      res.status(response.status).send(output);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  @Post('register')
  async registerUser(@Req() req: any, @Res() res: any, @Body() body: any) {
    const connection = await Queue.startConnection();
    const channel = await Queue.setUpChannelAndExchange(connection);

    const corrId = await Queue.publishWithReply(channel, this.userQueue, {
      status: 200,
      type: 'register',
      payload: {
        email: body.email,
        name: body.name,
        role: body.role,
      } as WorkerRegisterUser,
    });

    const response: AmqpMessage<BackendUser> = await Queue.fetchFromQueue(channel, corrId, corrId);

    const user = response.payload;
    const output = UserConverter.convertToBaseUser(user);
    res.status(response.status).send(output);
  }

  @Put('password')
  async changePassword(@Req() req: any, @Res() res: any, @Body() body: any) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // Passes the data to the user workers
      const corrId = await Queue.publishWithReply(channel, this.userQueue, {
        status: 200,
        type: 'change-Password',
        payload: {
          _id: req.user._id,
          confirmPassword: body.confirmPassword,
          newPassword: body.newPassword,
          oldPassword: body.oldPassword,
        } as WorkerChangePassword,
      });

      // Waits for the response from the workers
      const response: AmqpMessage<null> = await Queue.fetchFromQueue(channel, corrId, corrId);

      res.status(response.status).send(response.payload);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  @Get('email')
  async resendEmailVerification(@Req() req: any, @Res() res: any) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // Creates the token
      const token = TokenGenerator.verificationToken(req.user._id, req.user.username);

      // Passes the userId to the user workers
      const corrId = await Queue.publishWithReply(channel, this.userQueue, {
        status: 200,
        type: 'resend-emailVerify',
        payload: {
          _id: req.user._id,
          token: token,
        } as WorkerChangeEmail,
      });

      // Waits for the response from the workers
      const response: AmqpMessage<null> = await Queue.fetchFromQueue(channel, corrId, corrId);

      res.status(response.status).send(response.payload);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  @Put('email')
  async changeEmail(@Req() req: any, @Res() res: any, @Body() body: any) {
    // Creates the token
    const token = TokenGenerator.verificationToken(req.user._id, body.email);

    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // Passes the data to the user workers
      const corrId = await Queue.publishWithReply(channel, this.userQueue, {
        status: 200,
        type: 'change-email',
        payload: {
          _id: req.user._id,
          email: body.email,
          token: token,
        } as WorkerChangeEmail,
      });

      // Waits for the response
      const response: AmqpMessage<null> = await Queue.fetchFromQueue(channel, corrId, corrId);

      res.status(response.status).send(response.payload);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  @Patch(':id')
  async updateUser(@Res() res: any, @Body() body: any, @Param('id') id: string) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      const corrId = await Queue.publishWithReply(channel, this.userQueue, {
        status: 200,
        type: 'edit-User',
        payload: {
          _id: id,
          name: body.name,
        } as FrontendUser,
      });

      const response: AmqpMessage<BackendUser> = await Queue.fetchFromQueue(
        channel,
        corrId,
        corrId
      );
      const user = response.payload;

      const output = UserConverter.convertToBaseUser(user);

      res.status(response.status).send(output);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  // @Delete(':id')
  // TODO: make only admins able to use this
  async deleteUser(@Res() res: any, @Param('id') id: string) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // First removes all wallets and transactions of the user
      Queue.publishSimple(channel, this.transactionQueue, {
        status: 200,
        type: 'delete-User',
        payload: {
          _id: id,
        } as BaseUser,
      });

      // Then removes the custom categories of the user
      Queue.publishSimple(channel, this.categoryQueue, {
        status: 200,
        type: 'delete-User',
        payload: {
          _id: id,
        } as BaseUser,
      });

      // Finally deletes the user
      Queue.publishSimple(channel, this.userQueue, {
        status: 200,
        type: 'delete-User',
        payload: {
          _id: id,
        } as BaseUser,
      });

      res.sendStatus(204);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  @Post('reset')
  async generateResetToken(@Res() res: any, @Body() body: any) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // Sends the email to the db for verification
      const corrId = await Queue.publishWithReply(channel, this.userQueue, {
        status: 200,
        type: 'get-byUsername',
        payload: {
          username: body.username,
        } as WorkerGetUserByUsername,
      });

      // If the user is not registered, sends a 204 code and acts as if it worked
      const response: AmqpMessage<BackendUser> = await Queue.fetchFromQueue(
        channel,
        corrId,
        corrId
      );
      const db_user = response.payload;
      if (!db_user) throw AmqpMessage.errorMessage('', 204);

      // Creates the passwordResetToken this token is only valid for 24h
      const token = TokenGenerator.passwordToken(db_user._id);

      // Sends the token to the Database so it can be registered and the email can be sent
      Queue.publishSimple(channel, this.userQueue, {
        status: 200,
        type: 'password-reset',
        payload: {
          _id: db_user._id,
          token: token,
        } as WorkerPasswordReset,
      });

      res.sendStatus(204);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  @Get('reset/:token')
  async validateResetToken(@Req() req: any, @Res() res: any, @Param('token') token: string) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // extracts the payload, expiration is verified later
      const payload = jwt.verify(token, process.env.PASSWORD_TOKEN_KEY || '', {
        ignoreExpiration: true,
      });

      // Fetches the user to verify tokens
      const corrId = await Queue.publishWithReply(channel, this.userQueue, {
        status: 200,
        type: 'get-byId',
        payload: {
          _id: payload.id,
        } as WorkerGetUserById,
      });

      // If there is no user, returns an error
      const response: AmqpMessage<BackendUser> = await Queue.fetchFromQueue(
        channel,
        corrId,
        corrId
      );
      if (!response.payload) throw AmqpMessage.errorMessage('Invalid user', 422);
      const db_user = response.payload;

      // Compares the resetTokens
      if (db_user.resetToken === token) {
        // If the tokens are the same, then the expiration is verified, if invalid, an error is returned and the token is removed from the db
        try {
          jwt.verify(token, process.env.PASSWORD_TOKEN_KEY || '');
          res.sendStatus(204);
        } catch (e) {
          Queue.publishSimple(channel, this.userQueue, {
            status: 200,
            type: 'password-reset',
            payload: {
              _id: db_user._id,
            } as WorkerPasswordReset,
          });
          throw AmqpMessage.errorMessage('Invalid token', 422);
        }
      } else {
        res.sendStatus(403);
      }
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  @Post('reset/:token')
  async resetPassword(@Res() res: any, @Param('token') token: string, @Body() body: any) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // extracts the payload, expiration is verified later
      const payload = jwt.verify(token, process.env.PASSWORD_TOKEN_KEY || '', {
        ignoreExpiration: true,
      });

      // Fetches the user to verify tokens
      const corrId = await Queue.publishWithReply(channel, this.userQueue, {
        status: 200,
        type: 'get-byId',
        payload: {
          _id: payload.id,
        } as WorkerGetUserById,
      });

      // If there is no user, returns an error
      const response: AmqpMessage<BackendUser> = await Queue.fetchFromQueue(
        channel,
        corrId,
        corrId
      );
      if (!response.payload) throw AmqpMessage.errorMessage('Invalid user', 422);
      const db_user = response.payload;

      // Compares the resetTokens
      if (db_user.resetToken === token) {
        // If the tokens are the same, then the expiration is verified, if invalid, an error is returned and the token is removed from the db
        try {
          jwt.verify(token, process.env.PASSWORD_TOKEN_KEY || '');

          const passwordCorrId = await Queue.publishWithReply(channel, this.userQueue, {
            status: 200,
            type: 'change-Password-Force',
            payload: {
              _id: db_user._id,
              confirmPassword: body.confirmPassword,
              newPassword: body.newPassword,
              oldPassword: body.oldPassword,
            } as WorkerChangePassword,
          });

          // Waits for the response from the workers
          const response: AmqpMessage<null> = await Queue.fetchFromQueue(
            channel,
            passwordCorrId,
            passwordCorrId
          );
          res.status(response.status).send(response.payload);
        } catch (e) {
          Queue.publishSimple(channel, this.userQueue, {
            status: 200,
            type: 'password-reset',
            payload: {
              _id: db_user._id,
            } as WorkerPasswordReset,
          });
          throw AmqpMessage.errorMessage('Invalid token', 422);
        }
      } else {
        res.sendStatus(403);
      }
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }
}
