// Libraries
import { Module } from '@nestjs/common';
// Strategies
import { JwtAuthAdminStrategy } from './jwt-auth-admin.pipe';
import { JwtAuthStrategy } from './jwt-auth.pipe';
import { JwtRefreshStrategy } from './jwt-refresh.pipe';
import { LocalStrategy } from './local-auth.pipe';

@Module({
  controllers: [],
  exports: [LocalStrategy, JwtRefreshStrategy, JwtAuthStrategy, JwtAuthAdminStrategy],
})
export class AuthenticationPassportModule {}
