import { Module } from '@nestjs/common';
// Modules
import { AuthenticationFeatureSessionsDataAccessUserModule } from '@finance/authentication/feature-sessions/data-access-user';
import { AuthenticationFeatureSessionsDataAccessJwtModule } from '@finance/authentication/feature-sessions/data-access-jwt';
import { AuthenticationFeatureSessionsUtilsGuardsModule } from '@finance/authentication/feature-sessions/utils-guards';
import { SharedFeaturesLoggerModule } from '@finance/authentication/shared/feature-logger';
// Controllers
import { AuthenticationFeatureSessionsHttpController } from './http.controller';

@Module({
  controllers: [AuthenticationFeatureSessionsHttpController],
  imports: [
    SharedFeaturesLoggerModule,
    AuthenticationFeatureSessionsDataAccessUserModule,
    AuthenticationFeatureSessionsDataAccessJwtModule,
    AuthenticationFeatureSessionsUtilsGuardsModule,
  ],
})
export class AuthenticationFeatureSessionsHttpModule {}
