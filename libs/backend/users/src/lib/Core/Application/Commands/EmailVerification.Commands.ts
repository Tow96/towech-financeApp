import { getRandomValues } from 'crypto';
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { encodeBase32UpperCaseNoPadding } from '../../../fake-oslo/encoding';

// Services
import { UserEmailService } from '../UserMail.Service';

// Repos
import { UserRepository } from '../../../Database/User.Repository';

@Injectable()
export class EmailVerificationCommands {
  private readonly _logger = new Logger(EmailVerificationCommands.name);

  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _mailingService: UserEmailService
  ) {}

  async generateEmailVerificationCode(userId: string): Promise<void> {
    this._logger.log(`Generating email verification code for user: ${userId}.`);
    // Map
    const user = await this._userRepository.fetchUserById(userId);
    if (user.EmailVerified) throw new UnprocessableEntityException('User already verified.');

    // Change
    const bytes = new Uint8Array(5);
    getRandomValues(bytes);
    const code = encodeBase32UpperCaseNoPadding(bytes);

    const updated = user.generateEmailVerification(code);
    if (!updated) throw new UnprocessableEntityException('Code generated too recently.');

    // Persist
    await this._userRepository.persistChanges(user);
    this._logger.verbose(`CODE: ${code}`);

    // Return
    await this._mailingService.sendVerificationEmail(user, code);
  }

  async verifyEmail(email: string, code: string): Promise<void> {
    this._logger.log(`Verifying email: ${email}`);
    // Map user
    const user = await this._userRepository.fetchUserByEmail(email);

    // Change
    const status = user.verifyEmail(code);
    if (!status) throw new UnprocessableEntityException('Invalid code');

    // Persist
    await this._userRepository.persistChanges(user);

    // Return
    await this._mailingService.sendEmailVerifiedEmail(user);
  }
}
