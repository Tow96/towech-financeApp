import { Module } from '@nestjs/common';
import { DrizzleProvider, DATABASE_CONNECTION } from './Database/drizzle.provider';
import { UserService } from './Core/User.Service';

import { UserController } from './Api/Controllers/User.Controller';
import { EmailController } from './Api/Controllers/Email.Controller';

@Module({
  controllers: [UserController, EmailController],
  providers: [DrizzleProvider, UserService],
  exports: [DATABASE_CONNECTION],
})
export class UsersModule {}
