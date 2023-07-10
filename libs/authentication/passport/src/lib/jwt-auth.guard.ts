/** jwt-auth.guard.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Strategy and guard for accessing endpoints using a jwt token
 */
// Libraries
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { validateWithI18n } from './utils';
// Services
import { ConfigService } from '@nestjs/config';
import { UserModel } from '@towech-finance/shared/utils/models';
// Models
import { StrategyNames } from './strategy.names';
import { AuthenticationUserService } from '@towech-finance/authentication/repos/user';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, StrategyNames.AUTH) {
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
    const user = this.userRepo.getById(payload._id);
    if (!user) return false;

    return user;
  }
}

export class JwtAuthGuard extends AuthGuard(StrategyNames.AUTH) {
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
