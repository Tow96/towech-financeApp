// Libraries
import { Module } from '@nestjs/common';
// Providers
import { AuthenticationTokenService } from './authentication-tokens.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [AuthenticationTokenService],
  exports: [AuthenticationTokenService],
})
export class AuthenticationTokensModule {}
