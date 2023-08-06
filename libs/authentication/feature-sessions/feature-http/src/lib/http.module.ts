import { Module } from '@nestjs/common';
// Modules
import { AuthenticationSessionsUserModule } from '@finance/authentication/feature-sessions/data-access-user';
import { AuthenticationSessionsJwtModule } from '@finance/authentication/feature-sessions/data-access-jwt';
import { AuthenticationFeatureSessionsUtilsGuardsModule } from '@finance/authentication/feature-sessions/utils-guards';
import { AuthenticationLoggerModule } from '@finance/authentication/shared/feature-logger';
// Controllers
import { AuthenticationSessionsHttpController } from './http.controller';

@Module({
  controllers: [AuthenticationSessionsHttpController],
  imports: [
    AuthenticationLoggerModule,
    AuthenticationSessionsUserModule,
    AuthenticationSessionsJwtModule,
    AuthenticationFeatureSessionsUtilsGuardsModule,
  ],
})
export class AuthenticationSessionsHttpModule {}
