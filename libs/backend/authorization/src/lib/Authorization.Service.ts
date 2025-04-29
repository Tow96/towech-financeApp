import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type TokenPayload = {
  userId: string;
  legacyId: string | null;
  accountVerified: boolean;
  role: string;
};
export type TokenDto = TokenPayload & { token: string };

export enum AuthResults {
  'INVALID' = 0,
  'FORBIDDEN' = 1,
  'PASS' = 2,
}

@Injectable()
export class AuthorizationService {
  private readonly _jwtSecret: string;
  private readonly _creatorKey?: string;
  private readonly _logger = new Logger(AuthorizationService.name);

  constructor(readonly _configService: ConfigService) {
    this._jwtSecret = _configService.getOrThrow<string>('JWT_SECRET');
    this._creatorKey = _configService.get('CREATOR_KEY');
  }

  generateAuthToken(payload: TokenPayload): TokenDto {
    const token = jwt.sign(payload, this._jwtSecret, { expiresIn: '5m' });
    this._logger.debug(`Generated token for user: ${payload.userId}`);

    return { ...payload, token };
  }

  private validateToken(token: string): TokenPayload | undefined {
    try {
      return jwt.verify(token, this._jwtSecret) as TokenPayload;
    } catch (e: unknown) {
      this._logger.verbose(e);
      return undefined;
    }
  }

  isAdmin(token: string): AuthResults {
    const user = this.validateToken(token);
    if (!user) return AuthResults.INVALID;

    return user.role === 'admin' ? AuthResults.PASS : AuthResults.FORBIDDEN;
  }

  isAdminOrCreator(token: string): AuthResults {
    if (this._creatorKey !== undefined && token === this._creatorKey) return AuthResults.PASS;

    return this.isAdmin(token);
  }

  isRequestingUser(token: string, userId: string): AuthResults {
    const user = this.validateToken(token);
    if (!user) return AuthResults.INVALID;

    return user.userId === userId ? AuthResults.PASS : AuthResults.FORBIDDEN;
  }

  isAdminOrRequestingUser(token: string, userId: string): AuthResults {
    const isAdmin = this.isAdmin(token);
    if (isAdmin === AuthResults.PASS) return AuthResults.PASS;

    return this.isRequestingUser(token, userId);
  }
}
