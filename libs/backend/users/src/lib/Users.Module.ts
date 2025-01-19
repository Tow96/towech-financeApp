import { Module } from '@nestjs/common';
import { UsersProvider, USER_SCHEMA_CONNECTION } from './Database/Users.Provider';

import { UserController } from './Api/Controllers/User.Controller';
import { EmailController } from './Api/Controllers/Email.Controller';
import { PasswordController } from './Api/Controllers/Password.Controller';

@Module({
  controllers: [UserController, EmailController, PasswordController],
  providers: [UsersProvider],
  exports: [USER_SCHEMA_CONNECTION],
})
export class UsersModule {}
