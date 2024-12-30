import { Module } from '@nestjs/common';
import { LegacyModule } from '../legacy/legacy.module';
import { UserController } from './user.controller';
import { CreateUserCommandUseCase } from '../Core/Application/User/Commands/CreateUser/CreateUserCommand.use-case';
import { GetUserQueryUseCase } from '../Core/Application/User/Queries/GetUser/GetUserQuery.use-case';
import { IUserRepository } from '../Core/Domain/User/Abstractions/IUserRepository';
import { UserRepository } from '../Infrastructure/Persistence/User/Repositories/user.repository';

@Module({
  imports: [LegacyModule],
  controllers: [UserController],
  providers: [
    CreateUserCommandUseCase,
    GetUserQueryUseCase,
    UserRepository,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
})
export class AppModule {}
