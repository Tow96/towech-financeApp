import { v4 as uuidV4 } from 'uuid';
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';

// Repos
import { UserRepository } from '../../../Database/User.Repository';
import { UserEntity } from '../../Domain/Entities/User.Entity';

@Injectable()
export class UserInfoCommands {
  private readonly _logger = new Logger(UserInfoCommands.name);

  constructor(private readonly _userRepository: UserRepository) {}

  async changeName(userId: string, name: string): Promise<void> {
    this._logger.log(`Updating name for user: ${userId}.`);
    // Map
    const user = await this._userRepository.fetchUserById(userId);

    // Change
    user.setBasicInfo({ name: name });

    // Persist
    await this._userRepository.persistChanges(user);
  }

  async delete(userId: string): Promise<void> {
    this._logger.log(`Deleting user: ${userId}.`);
    // Map
    const user = await this._userRepository.fetchUserById(userId);

    // Change
    user.delete();

    // Persist
    this._userRepository.persistChanges(user);
  }

  async register(name: string, email: string, password: string, role: string): Promise<string> {
    this._logger.log(`Checking if user with email "${email}" is already registered.`);

    // Map
    const emailRegistered = await this._userRepository.isEmailRegistered(email);
    if (emailRegistered)
      throw new UnprocessableEntityException(`User with email "${email}" already registered.`);

    // Change
    this._logger.log(`Creating user with email "${email}".`);
    const newUser = UserEntity.create(uuidV4(), email, name, password, role);

    // Persist
    await this._userRepository.persistChanges(newUser);

    // Return
    // TODO: Send email
    return newUser.Id;
  }
}
