// Libraries
import { Module } from '@nestjs/common';
// Modules
import { AuthenticationReposUserModule } from '@towech-finance/authentication/repos/user';
import { AuthenticationPassportModule } from '@towech-finance/authentication/passport';
import { SharedFeaturesLoggerModule } from '@towech-finance/shared/features/logger';
// Controllers
import { SignageController } from './signage.controller';
import { AuthenticationTokensModule } from '@towech-finance/authentication/tokens';

@Module({
  controllers: [SignageController],
  imports: [
    AuthenticationPassportModule,
    AuthenticationReposUserModule,
    AuthenticationTokensModule,
    SharedFeaturesLoggerModule,
  ],
  providers: [],
})
export class AuthenticationHttpSignageModule {}
