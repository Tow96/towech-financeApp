import { Module } from '@nestjs/common';
import { SignageController } from './signage.controller';
import { AuthenticationReposUserModule } from '@towech-finance/authentication/repos/user';

@Module({
  controllers: [SignageController],
  imports: [AuthenticationReposUserModule],
  providers: [],
})
export class AuthenticationHttpSignageModule {}
