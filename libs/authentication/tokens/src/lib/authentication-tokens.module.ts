// Libraries
import { Module } from '@nestjs/common';
// Providers
import { AuthenticationTokenService } from './authentication-tokens.service';

@Module({
  controllers: [],
  providers: [AuthenticationTokenService],
  exports: [AuthenticationTokenService],
})
export class AuthenticationTokensModule {}
