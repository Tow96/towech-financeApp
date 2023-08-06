/** jwt-refresh.guard.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Strategy and guard for using endpoints that require a jwt refreshtoken
 */
// Libraries
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// Services
import { ConfigService } from '@nestjs/config';
import { AuthenticationSessionsUserService } from '@finance/authentication/feature-sessions/data-access-user';
// Models
import { RefreshToken } from '@finance/shared/utils-types';
import { Request } from 'express';
import { StrategyNames } from '../utils/strategy.names';
import { validateWithI18n } from '../utils/i18n';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, StrategyNames.REFRESH) {
  public constructor(
    private readonly userRepo: AuthenticationSessionsUserService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request.cookies['jid']]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
    });
  }
  public async validate(payload: RefreshToken): Promise<RefreshToken | false> {
    const user = await this.userRepo.validateRefreshToken(payload.user._id, payload.id);
    if (!user) return false;
    return { id: payload.id, user };
  }
}

@Injectable()
export class JwtRefreshGuard extends AuthGuard(StrategyNames.REFRESH) {
  public override handleRequest<UserModel>(
    err: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    user: UserModel | false,
    info: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    context: ExecutionContext,
    status?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ): UserModel {
    validateWithI18n(user as Record<string, any>, context);
    return super.handleRequest(err, user, info, context, status);
  }
}
