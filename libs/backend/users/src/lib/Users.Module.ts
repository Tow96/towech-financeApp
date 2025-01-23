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
import { AdminRequestingUserGuard } from './Api/Guards/AdminUser.Guard';
import { AdminCreatorGuard } from './Api/Guards/AdminCreator.Guard';
import { AdminGuard } from './Api/Guards/Admin.Guard';
import { RequestingUserGuard } from './Api/Guards/RequestingUser.Guard';
import { UserService } from './Core/Application/User.Service';

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

    // Repos
    UserProvider,
  ],
  exports: [USER_SCHEMA_CONNECTION],
})
export class UsersModule {}
