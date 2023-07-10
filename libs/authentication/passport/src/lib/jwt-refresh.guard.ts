/** jwt-refresh.guard.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Strategy and guard for using endpoints that require a jwt refreshtoken
 */
// Libraries
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { validateWithI18n } from './utils';
// Services
import { ConfigService } from '@nestjs/config';
import { AuthenticationUserService } from '@towech-finance/authentication/repos/user';
// Models
import { StrategyNames } from './strategy.names';
import { Request } from 'express';
import { RefreshToken } from '@towech-finance/shared/utils/models';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, StrategyNames.REFRESH) {
  public constructor(
    private readonly userRepo: AuthenticationUserService,
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
  public handleRequest<UserModel>(
    err: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    user: UserModel | false,
    info: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    context: ExecutionContext,
    status?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ): UserModel {
    validateWithI18n(user, context);
    return super.handleRequest(err, user, info, context, status);
  }
}
