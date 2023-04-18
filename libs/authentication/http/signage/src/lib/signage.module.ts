import { Module } from '@nestjs/common';
import { SignageController } from './signage.controller';

@Module({
  controllers: [SignageController],
  providers: [],
})
export class AuthenticationHttpSignageModule {}
