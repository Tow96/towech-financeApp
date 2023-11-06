/** jwt-auth-admin.guard.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Strategy and guard for using endpoints only meant for administrators
 */

// Libraries
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// Services
import { ConfigService } from '@nestjs/config';
import { AuthenticationUserService } from '@finance/authentication/shared/data-access-user';
// Models
import { UserModel, UserRoles } from '@finance/shared/utils-types';
import { StrategyNames } from '../utils/strategy.names';
import { validateWithI18n } from '../utils/i18n';

@Injectable()
export class JwtAuthAdminStrategy extends PassportStrategy(Strategy, StrategyNames.AUTH_ADMIN) {
  constructor(
    private readonly user: AuthenticationUserService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('AUTH_TOKEN_SECRET'),
    });
  }

  async validate(payload: UserModel): Promise<UserModel | false> {
    const user = await this.user.getById(payload._id);

    if (!user || user.role !== UserRoles.ADMIN) return false;
    return user;
  }
}

/* eslint-disable  @typescript-eslint/no-explicit-any*/
export class JwtAuthAdminGuard extends AuthGuard(StrategyNames.AUTH_ADMIN) {
  override handleRequest<UserModel>(
    err: any,
    user: false | UserModel,
    info: any,
    context: ExecutionContext,
    status?: any
  ): UserModel {
    validateWithI18n(user as Record<string, any>, context);
    return super.handleRequest(err, user, info, context, status);
  }
}
/* eslint-enable */
