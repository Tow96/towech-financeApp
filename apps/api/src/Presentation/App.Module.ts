import { Module } from '@nestjs/common';
import { LegacyModule } from '../legacy/legacy.module';
import { UserController } from './User.Controller';
import { GetUserQueryHandler } from '../Core/Application/User/Queries/GetUser/GetUser.QueryHandler';
import { IUserRepository } from '../Core/Domain/User/Abstractions/User.Repository';
import { UserRepository } from '../Infrastructure/Persistence/User/Repositories/User.Repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserCommandHandler } from '../Core/Application/User/Commands/CreateUser/CreateUser.CommandHandler';

@Module({
  imports: [LegacyModule, CqrsModule],
  controllers: [UserController],
  providers: [
    GetUserQueryHandler,
    CreateUserCommandHandler,
    UserRepository,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
})
export class AppModule {}
