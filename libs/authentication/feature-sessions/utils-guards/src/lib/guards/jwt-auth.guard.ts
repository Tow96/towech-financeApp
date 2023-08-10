/** jwt-auth.guard.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Strategy and guard for accessing endpoints using a jwt token
 */
// Libraries
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// Services
import { ConfigService } from '@nestjs/config';
import { AuthenticationSessionsUserService } from '@finance/authentication/feature-sessions/data-access-user';
// Models
import { UserModel } from '@finance/shared/utils-types';
import { StrategyNames } from '../utils/strategy.names';
import { validateWithI18n } from '../utils/i18n';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, StrategyNames.AUTH) {
  public constructor(
    private readonly userRepo: AuthenticationSessionsUserService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('AUTH_TOKEN_SECRET'),
    });
  }

  public async validate(payload: UserModel): Promise<UserModel | false> {
    const user = await this.userRepo.getById(payload._id);
    if (!user) return false;
    return user;
  }
}

/* eslint-disable  @typescript-eslint/no-explicit-any*/
export class JwtAuthGuard extends AuthGuard(StrategyNames.AUTH) {
  public override handleRequest<UserModel>(
    err: any,
    user: UserModel | false,
    info: any,
    context: ExecutionContext,
    status?: any
  ): UserModel {
    validateWithI18n(user as Record<string, any>, context);
    return super.handleRequest(err, user, info, context, status);
  }
}
/* eslint-enable */
