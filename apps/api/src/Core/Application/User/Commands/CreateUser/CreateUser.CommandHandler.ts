import { v4 as uuidV4 } from 'uuid';

import { CreateUserCommand } from './CreateUser.Command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepository } from '../../../../Domain/User/Abstractions/User.Repository';
import { User } from '../../../../Domain/User/Entities/User.Entity';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, string> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const { name, email, role } = command;
    const newUser = User.create({
      id: uuidV4(),
      email,
      name,
      role,
    });

    await this.repository.insert(newUser);

    return newUser.Id;
  }
}
