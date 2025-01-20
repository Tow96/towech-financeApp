import { v4 as uuidV4 } from 'uuid';
import { hash, verify } from '@node-rs/argon2';
import { encodeBase32UpperCaseNoPadding } from '../../fake-oslo/encoding';
import {
  Body,
  Controller,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';

import { ChangePasswordDto } from '../Validation/ChangePassword.Dto';
import { ResetPasswordDto } from '../Validation/ResetPassword.Dto';
import { UserInfoRepository } from '../../Database/Repositories/UserInfo.Repository';
import {
  PasswordResetModel,
  PasswordResetRepository,
} from '../../Database/Repositories/PasswordReset.Repository';

@Controller('user-new/:id/password')
export class PasswordController {
  private readonly _logger = new Logger(PasswordController.name);
  constructor(
    private readonly _userInfoRepository: UserInfoRepository,
    private readonly _passwordResetRepository: PasswordResetRepository
  ) {}

  @Patch('/')
  // TODO: User guard
  async changePassword(@Param('id') id: string, @Body() data: ChangePasswordDto): Promise<void> {
    let userExists = await this._userInfoRepository.getById(id);
    if (!userExists) throw new NotFoundException('User not found.');

    // Validate old password
    if (!(await verify(userExists.passwordHash, data.oldPassword)))
      throw new UnprocessableEntityException('Invalid password');

    // Hash new password
    const passwordHash = await hash(data.newPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // Update user
    userExists = { ...userExists, passwordHash: passwordHash, updatedAt: new Date() };
    await this._userInfoRepository.update(userExists);

    this._logger.log(`Updated password for user: ${id}`);
  }

  @Post('/send-reset')
  async sendPasswordResetEmail(@Param('id') userId: string): Promise<void> {
    const userExists = await this._userInfoRepository.getById(userId);
    if (!userExists) throw new NotFoundException('User not found.');

    // If a code was generated within 10 minutes, disallow
    const previousCode = await this._passwordResetRepository.getByUserId(userId);
    const minimumTime = new Date().getTime() - 10 * 60 * 1000; // 10 min
    if (previousCode !== undefined && previousCode.createdAt.getTime() > minimumTime)
      throw new UnprocessableEntityException('A reset code can only be generated every 10 minutes');

    // Delete previous token
    if (previousCode) await this._passwordResetRepository.delete(previousCode);

    // Generate random OTP
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    const code = encodeBase32UpperCaseNoPadding(bytes);
    const hashedCode = await hash(code, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // Store the new token
    const newCode: PasswordResetModel = {
      id: uuidV4(),
      userId: userId,
      hashedCode: hashedCode,
      createdAt: new Date(),
    };
    await this._passwordResetRepository.insert(newCode);
    this._logger.log(`Password reset token generated for user: ${userId}`);
    this._logger.debug(`Created password reset token: ${code} for user: ${userId}`);

    // TODO: Send email with code

    return;
  }

  @Post('/reset')
  async resetPassword(@Param('id') userId: string, @Body() data: ResetPasswordDto): Promise<void> {
    let userExists = await this._userInfoRepository.getById(userId);
    if (!userExists) throw new NotFoundException('User not found.');

    const code = await this._passwordResetRepository.getByUserId(userId);
    if (!code) throw new UnprocessableEntityException('Invalid code'); // Saying another thing is TMI

    const timeLimit = new Date().getTime() - 24 * 60 * 60 * 1000; // 24 hours
    if (code.createdAt.getTime() < timeLimit)
      throw new UnprocessableEntityException('Code expired, generate a new one');

    if (!(await verify(code.hashedCode, data.resetCode)))
      throw new UnprocessableEntityException('Invalid code');

    // Delete code
    await this._passwordResetRepository.delete(code);

    // update user
    const passwordHash = await hash(data.newPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    userExists = { ...userExists, passwordHash: passwordHash, updatedAt: new Date() };
    await this._userInfoRepository.update(userExists);

    this._logger.log(`User: ${userId}, successfully reset their password`);
  }
}
