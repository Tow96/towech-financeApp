import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserInfoModel } from '../../Database/Repositories/UserInfo.Repository';

export type AuthDto = {
  token: string;
  userId: string;
  accountVerified: boolean;
  role: string;
};

export type TokenContent = Omit<AuthDto, 'token'>;

export enum AuthResults {
  'Invalid',
  'Forbidden',
  'Pass',
}

@Injectable()
export class AuthorizationService {
  private readonly _jwtSecret: string;
  private readonly _creatorKey?: string;
  private readonly _logger = new Logger(AuthorizationService.name);

  constructor(private readonly _configService: ConfigService) {
    this._jwtSecret = _configService.getOrThrow<string>('JWT_SECRET');
    this._creatorKey = _configService.get('CREATOR_KEY');
    console.log(this._jwtSecret);
  }

  generateAuthToken(user: UserInfoModel): AuthDto {
    const content: TokenContent = {
      userId: user.id,
      accountVerified: user.emailVerified,
      role: user.role,
    };
    const token = jwt.sign(content, this._jwtSecret, { expiresIn: '1m' });
    this._logger.debug(`Generated token for user: ${user.id}`);

    return { ...content, token };
  }

  private validateToken(token: string): TokenContent | undefined {
    try {
      return jwt.verify(token, this._jwtSecret) as TokenContent;
    } catch (e: any) {
      this._logger.verbose(e.message);
      return undefined;
    }
  }

  isAdmin(token: string): AuthResults {
    const user = this.validateToken(token);
    if (!user) return AuthResults.Invalid;

    return user.role === 'admin' ? AuthResults.Pass : AuthResults.Forbidden;
  }

  isAdminOrCreator(token: string): AuthResults {
    if (this._creatorKey !== undefined && token === this._creatorKey) return AuthResults.Pass;

    return this.isAdmin(token);
  }

  isRequestingUser(token: string, userId: string): AuthResults {
    const user = this.validateToken(token);
    if (!user) return AuthResults.Invalid;

    return user.userId === userId ? AuthResults.Pass : AuthResults.Forbidden;
  }

  isAdminOrRequestingUser(token: string, userId: string): AuthResults {
    const isAdmin = this.isAdmin(token);
    if (isAdmin === AuthResults.Pass) return AuthResults.Pass;

    return this.isRequestingUser(token, userId);
  }
}
