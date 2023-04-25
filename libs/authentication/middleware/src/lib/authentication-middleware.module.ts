import { Module } from '@nestjs/common';
import { LocalStrategy } from './local-auth.middleware';
import { JwtRefreshStrategy } from './jwt-refresh.middleware';
import { JwtAuthStrategy } from './jwt-auth.middleware';
import { JwtAuthAdminStrategy } from './jwt-auth-admin.middleware';

@Module({
  controllers: [],
  exports: [LocalStrategy, JwtRefreshStrategy, JwtAuthStrategy, JwtAuthAdminStrategy],
})
export class AuthenticationMiddlewareModule {}
