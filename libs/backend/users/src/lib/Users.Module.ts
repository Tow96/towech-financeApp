import { Module } from '@nestjs/common';
import { UsersProvider, USER_SCHEMA_CONNECTION } from './Database/Users.Provider';

// Controllers
import { UserController } from './Api/Controllers/User.Controller';
import { EmailController } from './Api/Controllers/Email.Controller';
import { PasswordController } from './Api/Controllers/Password.Controller';
import { SessionController } from './Api/Controllers/Session.Controller';

// Repositories
import { UserInfoRepository } from './Database/Repositories/UserInfo.Repository';
import { EmailVerificationRepository } from './Database/Repositories/EmailVerification.Repository';
import { PasswordResetRepository } from './Database/Repositories/PasswordReset.Repository';

@Module({
  controllers: [UserController, EmailController, PasswordController, SessionController],
  providers: [
    UsersProvider,
    UserInfoRepository,
    EmailVerificationRepository,
    PasswordResetRepository,
  ],
  exports: [USER_SCHEMA_CONNECTION],
})
export class UsersModule {}
