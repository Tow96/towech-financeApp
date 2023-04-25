import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '@towech-finance/shared/utils/models';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthenticationTokenService {
  constructor(private readonly jwt: JwtService, private readonly config: ConfigService) {}

  /** generateAuthToken
   * Creates an authToken
   *
   * @returns The Token
   */
  generateAuthToken(user: UserModel): string {
    const expiresIn = this.config.get<string>('AUTH_TOKEN_EXPIRATION');
    const secret = this.config.get<string>('AUTH_TOKEN_SECRET');
    return this.jwt.sign({ ...user }, { expiresIn, secret });
  }

  /** generateRefreshToken
   * Creates a refreshtoken
   *
   * @returns The token
   */
  generateRefreshToken(user: UserModel, keepSession = false): string {
    const secret = this.config.get<string>('REFRESH_TOKEN_SECRET');
    const expiresIn = keepSession
      ? this.config.get<string>('REFRESH_TOKEN_EXPIRATION')
      : this.config.get<string>('REFRESH_SINGLE_TOKEN_EXPIRATION');

    return this.jwt.sign({ ...user }, { secret, expiresIn });
  }
}
