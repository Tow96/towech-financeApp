import { v4 as uuidV4 } from 'uuid';
import { hash, verify } from '@node-rs/argon2';
import { encodeBase32UpperCaseNoPadding } from '../../fake-oslo/encoding';

import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';

import { UserInfoRepository } from '../../Database/Repositories/UserInfo.Repository';
import {
  PasswordResetModel,
  PasswordResetRepository,
} from '../../Database/Repositories/PasswordReset.Repository';

@Injectable()
export class PasswordService {
  constructor(
    private readonly _userInfoRepository: UserInfoRepository,
    private readonly _passwordResetRepository: PasswordResetRepository
  ) {}

  // Commands -------------------------------------------------------------------------------------
  async generatePasswordResetCode(userId: string): Promise<string> {
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

    return code;
  }

  async resetPassword(userId: string, code: string, newPassword: string): Promise<void> {
    let userExists = await this._userInfoRepository.getById(userId);
    if (!userExists) throw new NotFoundException('User not found.');

    const codeReq = await this._passwordResetRepository.getByUserId(userId);
    if (!codeReq) throw new UnprocessableEntityException('Invalid code'); // Saying another thing is TMI

    const timeLimit = new Date().getTime() - 24 * 60 * 60 * 1000; // 24 hours
    if (codeReq.createdAt.getTime() < timeLimit)
      throw new UnprocessableEntityException('Code expired, generate a new one');

    if (!(await verify(codeReq.hashedCode, code)))
      throw new UnprocessableEntityException('Invalid code');

    // Delete code
    await this._passwordResetRepository.delete(codeReq);

    // update user
    const passwordHash = await hash(newPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    userExists = { ...userExists, passwordHash: passwordHash, updatedAt: new Date() };
    await this._userInfoRepository.update(userExists);
  }
}
