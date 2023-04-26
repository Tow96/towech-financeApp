import { Module } from '@nestjs/common';
import { SignageController } from './signage.controller';
import { AuthenticationReposUserModule } from '@towech-finance/authentication/repos/user';
import { SharedFeaturesLoggerModule } from '@towech-finance/shared/features/logger';

@Module({
  controllers: [SignageController],
  imports: [AuthenticationReposUserModule, SharedFeaturesLoggerModule],
  providers: [],
})
export class AuthenticationHttpSignageModule {}
