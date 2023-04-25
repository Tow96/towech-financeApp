import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { AuthenticationUserService } from '@towech-finance/authentication/repos/user';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { RefreshToken } from '@towech-finance/shared/utils/models';
import { StrategyNames } from './strategy.names';

// TODO: i18n
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, StrategyNames.REFRESH) {
  constructor(
    private readonly userRepo: AuthenticationUserService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request.cookies['jid'];
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
    });
  }

  public async validate(payload: RefreshToken): Promise<RefreshToken> {
    const user = await this.userRepo.validateRefreshToken(payload.user._id, payload.id);
    if (!user) throw new HttpException('Invalid credentials', 401);

    return { id: payload.id, user };
  }
}

@Injectable()
export class JwtRefreshGuard extends AuthGuard(StrategyNames.REFRESH) {}
