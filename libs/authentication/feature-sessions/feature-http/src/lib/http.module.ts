import { Module } from '@nestjs/common';
// Modules
import { AuthenticationSessionsJwtModule } from '@finance/authentication/sessions/data-access-jwt';
import { AuthenticationUserModule } from '@finance/authentication/shared/data-access-user';
import { AuthenticationUtilsGuardsModule } from '@finance/authentication/shared/utils-guards';
import { AuthenticationLoggerModule } from '@finance/authentication/shared/logger';
// Controllers
import { AuthenticationSessionsHttpController } from './http.controller';

@Module({
  controllers: [AuthenticationSessionsHttpController],
  imports: [
    AuthenticationLoggerModule,
    AuthenticationUserModule,
    AuthenticationSessionsJwtModule,
    AuthenticationUtilsGuardsModule,
  ],
})
export class AuthenticationSessionsHttpModule {}
