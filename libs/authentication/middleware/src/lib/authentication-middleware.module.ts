import { Module } from '@nestjs/common';
import { LocalStrategy } from './local-auth.middleware';
import { JwtRefreshStrategy } from './jwt-refresh.middleware';

@Module({
  controllers: [],
  providers: [LocalStrategy, JwtRefreshStrategy],
  exports: [LocalStrategy, JwtRefreshStrategy],
})
export class AuthenticationMiddlewareModule {}
