/** jwt-refresh.guard.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Strategy and guard for using endpoints that require a jwt refreshtoken
 */
// Libraries
import { Injectable, HttpException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// Services
import { ConfigService } from '@nestjs/config';
import { AuthenticationUserService } from '@towech-finance/authentication/repos/user';
// Models
import { StrategyNames } from './strategy.names';
import { Request } from 'express';
import { RefreshToken } from '@towech-finance/shared/utils/models';

// TODO: i18n
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, StrategyNames.REFRESH) {
  constructor(
    private readonly userRepo: AuthenticationUserService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request.cookies['jid']]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
    });
  }

  public async validate(payload: RefreshToken): Promise<RefreshToken> {
    const user = await this.userRepo.validateRefreshToken(payload.user._id, payload.id);
    if (!user) throw new HttpException('Invalid credentials', 401);

    return { id: payload.id, user };
  }
}

@Injectable()
export class JwtRefreshGuard extends AuthGuard(StrategyNames.REFRESH) {}
