/** jwt.service.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Injectable that handles the creation of all the tokens
 */
// Libraries
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
// Services
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
// Models
import { RefreshToken, UserModel } from '@finance/shared/utils-types';

@Injectable()
export class AuthenticationSessionsJwtService {
  public constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  /** generateAuthToken
   * Creates an authToken
   * @param {UserModel} user The user for which the token will be created
   * @returns The Token
   */
  public generateAuthToken(user: UserModel): string {
    const expiresIn = this.config.get<string>('AUTH_TOKEN_EXPIRATION');
    const secret = this.config.get<string>('AUTH_TOKEN_SECRET');
    return this.jwt.sign({ ...user }, { expiresIn, secret });
  }

  /** generateRefreshToken
   * Creates a refreshtoken
   * @param {UserModel} user The user for which the token will be created
   * @param keepSession boolean that indicates which type of refresh token is created
   * @returns The token
   */
  public generateRefreshToken(user: UserModel, keepSession = false): { token: string; id: string } {
    const secret = this.config.get<string>('REFRESH_TOKEN_SECRET');
    const expiresIn = keepSession
      ? this.config.get<string>('REFRESH_TOKEN_EXPIRATION')
      : this.config.get<string>('REFRESH_SINGLE_TOKEN_EXPIRATION');

    const content: RefreshToken = {
      id: randomUUID(),
      user: { ...user },
    };

    return { token: this.jwt.sign(content, { secret, expiresIn }), id: content.id };
  }
}
