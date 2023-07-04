/** local-auth.guard.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Strategy and guard for login using a username/password pair
 */
// Libraries
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { validateWithI18n } from './utils';
// Services
import { AuthenticationUserService } from '@towech-finance/authentication/repos/user';
// Models
import { StrategyNames } from './strategy.names';
import { UserModel } from '@towech-finance/shared/utils/models';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, StrategyNames.LOCAL) {
  public constructor(private readonly userRepo: AuthenticationUserService) {
    super();
  }

  public async validate(email: string, password: string): Promise<UserModel | false> {
    const user = await this.userRepo.getByEmail(email);
    if (!user) return false;

    const valid = await this.userRepo.validatePassword(user._id, password);
    if (!valid) return false;

    return user;
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard(StrategyNames.LOCAL) {
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
