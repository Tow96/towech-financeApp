import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { encodeBase32UpperCaseNoPadding } from '../../../fake-oslo/encoding';

// Repos
import { UserRepository } from '../../../Database/User.Repository';

@Injectable()
export class EmailVerificationCommands {
  private readonly _logger = new Logger(EmailVerificationCommands.name);

  constructor(private readonly _userRepository: UserRepository) {}

  async changeEmail(userId: string, email: string): Promise<void> {
    this._logger.log(`Updating email for user: ${userId}`);
    // Map data
    const emailRegistered = await this._userRepository.isEmailRegistered(email);
    if (emailRegistered)
      throw new UnprocessableEntityException(`User with email "${email}" already registered.`);
    const user = await this._userRepository.fetchUserById(userId);
    this._logger.verbose(user);

    // Update and save
    user.setBasicInfo({ email: email });
    await this._userRepository.persistChanges(user);
  }

  async generateEmailVerificationCode(userId: string): Promise<void> {
    this._logger.log(`Generating email verification code for user: ${userId}.`);
    // Map
    const user = await this._userRepository.fetchUserById(userId);
    if (user.EmailVerified) throw new UnprocessableEntityException('User already verified.');

    // Change
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    const code = encodeBase32UpperCaseNoPadding(bytes);

    const updated = user.generateEmailVerification(code);
    if (!updated) throw new UnprocessableEntityException('Code generated too recently.');

    // Persist
    await this._userRepository.persistChanges(user);
    this._logger.verbose(`CODE: ${code}`);

    // TODO: Send email
  }

  async verifyEmail(userId: string, code: string): Promise<void> {
    this._logger.log(`Verifying email for user: ${userId}`);

    // Map user
    const user = await this._userRepository.fetchUserById(userId);

    // Change
    const status = user.verifyEmail(code);
    if (!status) throw new UnprocessableEntityException('Invalid code');

    // Persist
    await this._userRepository.persistChanges(user);
  }
}
