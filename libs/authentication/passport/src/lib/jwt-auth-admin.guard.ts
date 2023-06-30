/** jwt-auth-admin.guard.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Strategy and guard for using endpoints only meant for administrators
 */

// Libraries
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { I18nContext } from 'nestjs-i18n';
// Services
import { ConfigService } from '@nestjs/config';
import { AuthenticationUserService } from '@towech-finance/authentication/repos/user';
// Models
import { StrategyNames } from './strategy.names';
import { UserModel, UserRoles } from '@towech-finance/shared/utils/models';

// TODO i18n
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

  public async validate(payload: UserModel): Promise<UserModel> {
    const i18n = I18nContext.current();
    const user = await this.userRepo.getById(payload._id);

    if (!user || user.role !== UserRoles.ADMIN) {
      throw new UnauthorizedException(i18n.t('validation.INVALID_CREDENTIALS'));
    }

    return user;
  }
}

export class JwtAuthAdminGuard extends AuthGuard(StrategyNames.AUTH_ADMIN) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public handleRequest<TUser = UserModel>(
    err: any,
    user: UserModel | false,
    info: any,
    context: ExecutionContext,
    status?: any
  ): TUser {
    // console.log(info instanceof AuthenticationError);
    console.log(info.status);
    // console.log(JSON.stringify(info));
    const i18n = I18nContext.current();

    if (info instanceof JsonWebTokenError || info?.message === 'No auth token') {
      throw new UnauthorizedException(i18n.t('validation.INVALID_CREDENTIALS'));
    }
    return super.handleRequest(err, user, info, context, status);
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
