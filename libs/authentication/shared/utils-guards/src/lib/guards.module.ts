// Libraries
import { Module } from '@nestjs/common';
// Strategies
import { JwtAuthAdminStrategy } from './guards/jwt-auth-admin.guard';
import { JwtAuthStrategy } from './guards/jwt-auth.guard';
import { JwtRefreshStrategy } from './guards/jwt-refresh.guard';
import { LocalStrategy } from './guards/local-auth.guard';
// Services
import { AuthenticationUserModule } from '@finance/authentication/shared/data-access-user';

@Module({
  imports: [AuthenticationUserModule],
  providers: [LocalStrategy, JwtRefreshStrategy, JwtAuthStrategy, JwtAuthAdminStrategy],
  exports: [LocalStrategy, JwtRefreshStrategy, JwtAuthStrategy, JwtAuthAdminStrategy],
})
export class AuthenticationUtilsGuardsModule {}
