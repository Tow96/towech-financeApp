import { v4 as uuidV4 } from 'uuid';

import { CreateUserCommand } from './CreateUser.Command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { IUserRepository, User } from '@financeApp/backend-domain';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, string> {
  private readonly logger = new Logger(CreateUserCommand.name);
  constructor(private readonly repository: IUserRepository) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const { name, email, role } = command;
    // this.logger.log('Creating new user');
    const newUser = User.create({
      id: uuidV4(),
      email,
      name,
      role,
    });
    this.logger.debug('This is a debug message');

    // this.logger.log('Inserting new user');
    await this.repository.insert(newUser);
    // this.logger.log('Successfully inserted new user');

    return newUser.Id;
  }
}
