import { Injectable, HttpException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StrategyNames } from './strategy.names';
import { ConfigService } from '@nestjs/config';
import { AuthenticationUserService } from '@towech-finance/authentication/repos/user';
import { UserModel } from '@towech-finance/shared/utils/models';

// TODO i18n
@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, StrategyNames.AUTH) {
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
    const user = this.userRepo.getById(payload._id);
    if (!user) throw new HttpException('Invalid credentials', 401);

    return user;
  }
}

export class JwtAuthGuard extends AuthGuard(StrategyNames.AUTH) {}
