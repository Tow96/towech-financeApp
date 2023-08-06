/** jwt.module.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Module that uses JWT to generate tokens
 */
// Libraries
import { Module } from '@nestjs/common';
// Providers
import { AuthenticationSessionsJwtService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [AuthenticationSessionsJwtService],
  exports: [AuthenticationSessionsJwtService],
})
export class AuthenticationSessionsJwtModule {}
