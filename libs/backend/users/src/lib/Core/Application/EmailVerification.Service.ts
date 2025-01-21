import { v4 as uuidV4 } from 'uuid';
import { hash, verify } from '@node-rs/argon2';
import { encodeBase32UpperCaseNoPadding } from '../../fake-oslo/encoding';

import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';

import { UserInfoRepository } from '../../Database/Repositories/UserInfo.Repository';
import {
  EmailVerificationModel,
  EmailVerificationRepository,
} from '../../Database/Repositories/EmailVerification.Repository';

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly _userInfoRepository: UserInfoRepository,
    private readonly _emailVerificationRepository: EmailVerificationRepository
  ) {}

  // Commands -------------------------------------------------------------------------------------
  async changeEmail(userId: string, email: string): Promise<void> {
    // Input validation
    let userExists = await this._userInfoRepository.getById(userId);
    if (!userExists) throw new NotFoundException('User not found.');
    const emailRegistered = await this._userInfoRepository.getByEmail(email);
    if (emailRegistered) throw new UnprocessableEntityException('Email already registered.');

    // Db Manipulation
    userExists = { ...userExists, email: email, emailVerified: false, updatedAt: new Date() };
    await this._userInfoRepository.update(userExists);
  }

  async generateVerificationToken(userId: string): Promise<string> {
    const userExists = await this._userInfoRepository.getById(userId);
    if (!userExists) throw new NotFoundException('User not found.');

    // Disallow if a token was generated 10 minutes prior
    const previousToken = await this._emailVerificationRepository.getByUserId(userId);
    const minimumTime = new Date().getTime() - 10 * 60 * 1000;
    if (previousToken !== undefined && previousToken.createdAt.getTime() > minimumTime)
      throw new UnprocessableEntityException('Token generated too soon');

    // Delete existing token
    if (previousToken) await this._emailVerificationRepository.delete(previousToken);

    // Generates random OTP
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    const code = encodeBase32UpperCaseNoPadding(bytes);
    const hashedCode = await hash(code, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // Stores the new token
    const newCode: EmailVerificationModel = {
      id: uuidV4(),
      userId: userId,
      hashedCode: hashedCode,
      createdAt: new Date(),
    };
    await this._emailVerificationRepository.insert(newCode);

    return hashedCode;
  }

  async verifyEmail(userId: string, code: string): Promise<void> {
    let userExists = await this._userInfoRepository.getById(userId);
    if (!userExists) throw new NotFoundException('User not found.');

    const tokenExists = await this._emailVerificationRepository.getByUserId(userId);
    if (!tokenExists) throw new UnprocessableEntityException('Invalid token'); // Saying another thing is TMI

    const timeLimit = new Date().getTime() - 24 * 60 * 60 * 1000; // 24 hours
    if (tokenExists.createdAt.getTime() < timeLimit)
      throw new UnprocessableEntityException('Token expired, generate a new one');

    if (!(await verify(tokenExists.hashedCode, code)))
      throw new UnprocessableEntityException('Invalid token');

    // delete token
    await this._emailVerificationRepository.delete(tokenExists);

    // update user
    userExists = { ...userExists, emailVerified: true, updatedAt: new Date() };
    await this._userInfoRepository.update(userExists);
  }
}
