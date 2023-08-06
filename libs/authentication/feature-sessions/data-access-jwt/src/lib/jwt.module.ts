/** jwt.module.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Module that uses JWT to generate tokens
 */
// Libraries
import { Module } from '@nestjs/common';
// Providers
import { AuthenticationFeatureSessionsDataAccessJwtService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [AuthenticationFeatureSessionsDataAccessJwtService],
  exports: [AuthenticationFeatureSessionsDataAccessJwtService],
})
export class AuthenticationFeatureSessionsDataAccessJwtModule {}
