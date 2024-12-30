import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../../../../Domain/User/Entities/user.entity';
import { IUserRepository } from '../../../../Domain/User/Abstractions/IUserRepository';
import { CreateUserCommandDto } from './CreateUserCommand.dto';

@Injectable()
export class CreateUserCommandUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async run(dto: CreateUserCommandDto): Promise<string> {
    const newUser = User.create({
      id: uuidv4(),
      email: dto.email,
      name: dto.name,
      role: dto.role,
    });

    await this.userRepository.insert(newUser);

    return newUser.Id;
  }
}
