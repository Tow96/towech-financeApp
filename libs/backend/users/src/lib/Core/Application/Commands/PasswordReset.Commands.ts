import { getRandomValues } from 'crypto';
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { encodeBase32UpperCaseNoPadding } from '../../../fake-oslo/encoding';

// Services
import { UserEmailService } from '../UserMail.Service';

// Repos
import { UserRepository } from '../../../Database/User.Repository';

@Injectable()
export class PasswordResetCommands {
  private readonly _logger = new Logger(PasswordResetCommands.name);

  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _mailingService: UserEmailService
  ) {}

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    this._logger.log(`Changing password for user: ${userId}.`);
    // Map
    const user = await this._userRepository.fetchUserById(userId);

    // Change
    const updated = user.setPassword(oldPassword, newPassword);
    if (!updated) throw new UnprocessableEntityException('Invalid password');

    // Persist
    await this._userRepository.persistChanges(user);

    // Return
    await this._mailingService.sendPasswordChangeEmail(user);
  }

  async generatePasswordResetCode(email: string): Promise<void> {
    this._logger.log(`Generating password reset code for email: ${email}.`);
    // Map
    const user = await this._userRepository.fetchUserByEmail(email);

    // Change
    const bytes = new Uint8Array(5);
    getRandomValues(bytes);
    const code = encodeBase32UpperCaseNoPadding(bytes);

    const updated = user.generatePasswordResetCode(code);
    if (!updated) throw new UnprocessableEntityException('Code generated too recently.');

    // Persist
    await this._userRepository.persistChanges(user);
    this._logger.verbose(`CODE: ${code}`);

    // Return
    await this._mailingService.sendPasswordResetEmail(user, code);
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    this._logger.log(`Resetting password for email: ${email}`);
    // Map
    const user = await this._userRepository.fetchUserByEmail(email);

    // Change
    const status = user.resetPassword(code, newPassword);
    if (!status) throw new UnprocessableEntityException('Invalid code');

    // Persist
    await this._userRepository.persistChanges(user);

    // Return
    await this._mailingService.sendPasswordChangeEmail(user);
  }
}
