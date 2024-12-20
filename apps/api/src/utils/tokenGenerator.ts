/** generateToken.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Creates the login tokens, the token only contains the id of the user
 */
import dotenv from 'dotenv';
dotenv.config();

// Libraries
import jwt from 'jsonwebtoken';
import { Objects } from '../Models';

export default class TokenGenerator {
  static authToken = (user: Objects.User.BaseUser): string => {
    return jwt.sign(
      {
        name: user.name,
        username: user.username,
        _id: user._id,
        role: user.role,
        accountConfirmed: user.accountConfirmed,
      },
      process.env.AUTH_TOKEN_KEY as string,
      {
        expiresIn: '1m',
      },
    );
  };

  static refreshToken = (user: Objects.User.BaseUser, keepSession: boolean): string => {
    return jwt.sign(
      {
        _id: user._id,
      },
      process.env.REFRESH_TOKEN_KEY as string,
      {
        expiresIn: keepSession ? '30d' : '1h',
      },
    );
  };

  static passwordToken = (id: string): string => {
    return jwt.sign(
      {
        id: id,
        content: 'passwordReset',
      },
      process.env.PASSWORD_TOKEN_KEY as string,
      {
        expiresIn: '24h',
      },
    );
  };

  static verificationToken = (id: string, email: string): string => {
    return jwt.sign(
      {
        user_id: id,
        email: email,
      },
      process.env.EMAILVERIFICATION_TOKEN_KEY as string,
      {
        expiresIn: '7d',
      },
    );
  };
}
