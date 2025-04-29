import { v4 as uuidV4 } from 'uuid';
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';

// Repos
import { UserRepository } from '../../../Database/User.Repository';
import { UserEntity } from '../../Domain/Entities/User.Entity';
import { UserEmailService } from '../UserMail.Service';

@Injectable()
export class UserInfoCommands {
  private readonly _logger = new Logger(UserInfoCommands.name);

  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _mailingService: UserEmailService
  ) {}

  async update(userId: string, name?: string, email?: string): Promise<void> {
    this._logger.log(`Updating info for user: ${userId}.`);
    // Map
    const user = await this._userRepository.fetchUserById(userId);
    if (email) {
      const emailRegistered = await this._userRepository.isEmailRegistered(email);
      if (emailRegistered)
        throw new UnprocessableEntityException(`User with email "${email}" already registered.`);
    }

    // Change
    user.setBasicInfo({ name, email });

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
    await this._userRepository.persistChanges(user);
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
    await this._mailingService.sendRegistrationEmail(newUser);
    return newUser.Id;
  }
}
