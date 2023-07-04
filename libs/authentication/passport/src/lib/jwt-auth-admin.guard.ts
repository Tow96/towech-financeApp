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
import { AuthenticationUserService } from '@towech-finance/authentication/repos/user';
// Models
import { StrategyNames } from './strategy.names';
import { UserModel, UserRoles } from '@towech-finance/shared/utils/models';
import { validateWithI18n } from './utils';

@Injectable()
export class JwtAuthAdminStrategy extends PassportStrategy(Strategy, StrategyNames.AUTH_ADMIN) {
  public constructor(
    private readonly userRepo: AuthenticationUserService,
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

    if (!user || user.role !== UserRoles.ADMIN) return false;
    return user;
  }
}

export class JwtAuthAdminGuard extends AuthGuard(StrategyNames.AUTH_ADMIN) {
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
