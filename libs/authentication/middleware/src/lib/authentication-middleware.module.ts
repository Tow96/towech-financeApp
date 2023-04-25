import { Module } from '@nestjs/common';
import { LocalStrategy } from './local-auth.middleware';
import { JwtRefreshStrategy } from './jwt-refresh.middleware';

export enum StrategyNames {
  LOCAL = 'local',
  REFRESH = 'jwt-refresh',
  AUTH = 'jwt-auth',
}

@Module({
  controllers: [],
  providers: [LocalStrategy, JwtRefreshStrategy],
  exports: [LocalStrategy, JwtRefreshStrategy],
})
export class AuthenticationMiddlewareModule {}
