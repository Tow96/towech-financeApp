/** local-auth.guard.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Strategy and guard for login using a username/password pair
 */
// Libraries
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
// Services
import { AuthenticationUserService } from '@finance/authentication/shared/data-access-user';
// Models
import { UserModel } from '@finance/shared/utils-types';
import { StrategyNames } from '../utils/strategy.names';
import { validateWithI18n } from '../utils/i18n';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, StrategyNames.LOCAL) {
  constructor(private readonly userRepo: AuthenticationUserService) {
    super();
  }

  async validate(email: string, password: string): Promise<UserModel | false> {
    const user = await this.userRepo.getByEmail(email);
    if (!user) return false;

    const valid = await this.userRepo.validatePassword(user._id, password);
    if (!valid) return false;
    return user;
  }
}

/* eslint-disable  @typescript-eslint/no-explicit-any*/
@Injectable()
export class LocalAuthGuard extends AuthGuard(StrategyNames.LOCAL) {
  override handleRequest<UserModel>(
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
