import { Module } from '@nestjs/common';
import { MailingModule } from '@financeapp/backend-mailing';

// Controllers
import { UserController } from './Api/Controllers/User.Controller';
import { EmailController } from './Api/Controllers/Email.Controller';
import { PasswordController } from './Api/Controllers/Password.Controller';
import { SessionController } from './Api/Controllers/Session.Controller';

// Guards
import { AdminGuard } from './Api/Guards/Admin.Guard';
import { AdminCreatorGuard } from './Api/Guards/AdminCreator.Guard';
import { AdminRequestingUserGuard } from './Api/Guards/AdminUser.Guard';
import { RequestingUserGuard } from './Api/Guards/RequestingUser.Guard';

// Services
import { UserInfoCommands } from './Core/Application/Commands/UserInfo.Commands';
import { EmailVerificationCommands } from './Core/Application/Commands/EmailVerification.Commands';
import { PasswordResetCommands } from './Core/Application/Commands/PasswordReset.Commands';
import { SessionCommands } from './Core/Application/Commands/Session.Commands';
import { UserQueries } from './Core/Application/Queries/User.Queries';

// Repositories
import { AuthorizationModule } from '@financeapp/backend-authorization';
import { UserProvider, USER_SCHEMA_CONNECTION } from './Database/Users.Provider';
import { UserRepository } from './Database/User.Repository';
import { UserEmailService } from './Core/Application/UserMail.Service';

@Module({
  imports: [MailingModule, AuthorizationModule],
  controllers: [UserController, EmailController, PasswordController, SessionController],
  providers: [
    // Guards
    AdminGuard,
    AdminCreatorGuard,
    AdminRequestingUserGuard,
    RequestingUserGuard,

    // Services
    UserInfoCommands,
    EmailVerificationCommands,
    PasswordResetCommands,
    SessionCommands,
    UserQueries,
    UserEmailService,

    // Repos
    UserProvider,
    UserRepository,
  ],
  exports: [USER_SCHEMA_CONNECTION],
})
export class UsersModule {}
