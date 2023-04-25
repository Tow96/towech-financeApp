// Libraries
import { Module } from '@nestjs/common';
// Strategies
import { JwtAuthAdminStrategy } from './jwt-auth-admin.middleware';
import { JwtAuthStrategy } from './jwt-auth.middleware';
import { JwtRefreshStrategy } from './jwt-refresh.middleware';
import { LocalStrategy } from './local-auth.middleware';

@Module({
  controllers: [],
  exports: [LocalStrategy, JwtRefreshStrategy, JwtAuthStrategy, JwtAuthAdminStrategy],
})
export class AuthenticationMiddlewareModule {}
