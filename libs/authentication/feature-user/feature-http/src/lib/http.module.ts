import { Module } from '@nestjs/common';
// Modules
import { AuthenticationLoggerModule } from '@finance/authentication/shared/logger';
import { AuthenticationUserModule } from '@finance/authentication/shared/data-access-user';
import { AuthenticationUtilsGuardsModule } from '@finance/authentication/shared/utils-guards';
// Controllers
import { AuthenticationUserHttpController } from './http.controller';

@Module({
  controllers: [AuthenticationUserHttpController],
  imports: [AuthenticationLoggerModule, AuthenticationUserModule, AuthenticationUtilsGuardsModule],
})
export class AuthenticationUserHttpModule {}
