import { Module } from '@nestjs/common';
import { AuthorizationService } from './Authorization.Service';

@Module({
  providers: [AuthorizationService],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
