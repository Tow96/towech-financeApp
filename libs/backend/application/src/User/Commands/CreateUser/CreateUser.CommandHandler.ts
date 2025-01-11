import { v4 as uuidV4 } from 'uuid';

import { CreateUserCommand } from './CreateUser.Command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { IUserRepository, User, UserInputException } from '@financeApp/backend-domain';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, string> {
  private readonly logger = new Logger(CreateUserCommand.name);
  constructor(private readonly repository: IUserRepository) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const { name, email, password } = command;

    // Validate
    const userExists = await this.repository.existsByEmail(email);
    if (userExists) throw new UserInputException(`User with email "${email}" already exists`); // TODO: create exceptions
    const newUser = User.create({
      id: uuidV4(),
      email,
      name,
      password,
    });

    // DB manipulation
    await this.repository.insert(newUser);
    this.logger.log(`Inserted user with new id: ${newUser.Id}`);

    // TODO: Send email
    this.logger.error('TODO: Send email');

    // return
    return newUser.Id;
  }
}
