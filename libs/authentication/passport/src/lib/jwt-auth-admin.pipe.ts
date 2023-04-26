/** jwt-auth-admin.pipe.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Strategy and guard for using endpoints only meant for administrators
 */

// Libraries
import { Injectable, HttpException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// Services
import { ConfigService } from '@nestjs/config';
import { AuthenticationUserService } from '@towech-finance/authentication/repos/user';
// Models
import { StrategyNames } from './strategy.names';
import { UserModel, UserRoles } from '@towech-finance/shared/utils/models';

// TODO i18n
@Injectable()
export class JwtAuthAdminStrategy extends PassportStrategy(Strategy, StrategyNames.AUTH_ADMIN) {
  constructor(
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
    const user = await this.userRepo.getById(payload._id);
    console.log(user);
    if (!user || user.role !== UserRoles.ADMIN) {
      throw new HttpException('Invalid credentials', 401);
    }

    return user;
  }
  // public async validate(payload: UserModel): Promise<UserModel> {
  //   const user = this.userRepo.getById(payload._id);
  //   if (!user) throw new HttpException('Invalid credentials', 401);

  //   return user;
  // }
}

export class JwtAuthAdminGuard extends AuthGuard(StrategyNames.AUTH_ADMIN) {}
