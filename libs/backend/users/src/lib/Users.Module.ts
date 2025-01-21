import { Module } from '@nestjs/common';

// Controllers
import { UserController } from './Api/Controllers/User.Controller';
import { EmailController } from './Api/Controllers/Email.Controller';
import { PasswordController } from './Api/Controllers/Password.Controller';
import { SessionController } from './Api/Controllers/Session.Controller';

// Services
import { AuthorizationService } from './Core/Application/Authorization.Service';

// Repositories
import { UserProvider, USER_SCHEMA_CONNECTION } from './Database/Users.Provider';
import { EmailVerificationRepository } from './Database/Repositories/EmailVerification.Repository';
import { UserInfoRepository } from './Database/Repositories/UserInfo.Repository';
import { PasswordResetRepository } from './Database/Repositories/PasswordReset.Repository';
import { SessionsRepository } from './Database/Repositories/Sessions.Repository';
import { AdminRequestingUserGuard } from './Api/Guards/AdminUser.Guard';
import { AdminCreatorGuard } from './Api/Guards/AdminCreator.Guard';
import { AdminGuard } from './Api/Guards/Admin.Guard';
import { RequestingUserGuard } from './Api/Guards/RequestingUser.Guard';
import { UserInfoService } from './Core/Application/UserInfo.Service';
import { EmailVerificationService } from './Core/Application/EmailVerification.Service';
import { PasswordService } from './Core/Application/Password.Service';
import { UserService } from './Core/Application/User.Service';
import { SessionService } from './Core/Application/Session.Service';

@Module({
  controllers: [UserController, EmailController, PasswordController, SessionController],
  providers: [
    // Services
    AuthorizationService,

    // Guards
    AdminGuard,
    AdminCreatorGuard,
    AdminRequestingUserGuard,
    RequestingUserGuard,

    // Services
    UserService,
    UserInfoService,
    EmailVerificationService,
    PasswordService,
    SessionService,

    // Repos
    UserProvider,
    EmailVerificationRepository,
    UserInfoRepository,
    PasswordResetRepository,
    SessionsRepository,
  ],
  exports: [USER_SCHEMA_CONNECTION],
})
export class UsersModule {}
