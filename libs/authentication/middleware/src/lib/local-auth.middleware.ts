/** local-auth.middleware.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Strategy and guard for login using a username/password pair
 */
import { HttpException, Injectable } from '@nestjs/common';
import { AuthenticationUserService } from '@towech-finance/authentication/repos/user';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserModel } from '@towech-finance/shared/utils/models';
import { StrategyNames } from './authentication-middleware.module';

// TODO: i18n
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, StrategyNames.LOCAL) {
  constructor(private readonly userRepo: AuthenticationUserService) {
    super();
  }

  async validate(email: string, password: string): Promise<UserModel> {
    const user = await this.userRepo.getByEmail(email);
    if (!user) throw new HttpException('Bad credentials', 401);

    const valid = await this.userRepo.validatePassword(user._id, password);
    if (!valid) throw new HttpException('Bad credentials', 401);

    return user;
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard(StrategyNames.LOCAL) {}
