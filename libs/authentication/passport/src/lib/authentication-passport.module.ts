// Libraries
import { Module } from '@nestjs/common';
// Strategies
import { JwtAuthAdminStrategy } from './jwt-auth-admin.guard';
import { JwtAuthStrategy } from './jwt-auth.guard';
import { JwtRefreshStrategy } from './jwt-refresh.guard';
import { LocalStrategy } from './local-auth.guard';
import { AuthenticationReposUserModule } from '@towech-finance/authentication/repos/user';

@Module({
  imports: [AuthenticationReposUserModule],
  providers: [LocalStrategy, JwtRefreshStrategy, JwtAuthStrategy, JwtAuthAdminStrategy],
  exports: [LocalStrategy, JwtRefreshStrategy, JwtAuthStrategy, JwtAuthAdminStrategy],
})
export class AuthenticationPassportModule {}
