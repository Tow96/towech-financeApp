import { v4 as uuidV4 } from 'uuid';
import { hash, verifySync } from '@node-rs/argon2';
import {
  encodeBase32LowerCaseNoPadding,
  encodeBase32UpperCaseNoPadding,
  encodeHexLowerCase,
} from '../../fake-oslo/encoding';

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { UserInfoRepository } from '../../Database/Repositories/UserInfo.Repository';
import { SessionModel, SessionsRepository } from '../../Database/Repositories/Sessions.Repository';
import { sha256 } from '../../fake-oslo/crypto/sha2';
import { AuthDto, AuthorizationService } from './Authorization.Service';

const TEMPORARY_SESSION_DURATION = 1000 * 60 * 30; // 30 min
const PERMANENT_SESSION_DURATION = 1000 * 60 * 60 * 24 * 30; // 30 days

@Injectable()
export class SessionService {
  constructor(
    private readonly _userInfoRepository: UserInfoRepository,
    private readonly _sessionRepository: SessionsRepository,
    private readonly _authorizationService: AuthorizationService
  ) {}

  // Commands -------------------------------------------------------------------------------------
  private encodeToken = (token: string): string =>
    encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  private generateSessionExpiration = (isPermanent: boolean) =>
    new Date(Date.now() + (isPermanent ? PERMANENT_SESSION_DURATION : TEMPORARY_SESSION_DURATION));

  async login(
    email: string,
    password: string,
    keepSession: boolean
  ): Promise<{ model: SessionModel; token: string; auth: AuthDto }> {
    const userExists = await this._userInfoRepository.getByEmail(email);
    if (!userExists) throw new UnauthorizedException('Invalid credentials.');

    if (!verifySync(userExists.passwordHash, password))
      throw new UnauthorizedException('Invalid credentials.');

    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const sessionToken = encodeBase32LowerCaseNoPadding(tokenBytes);
    const newSession: SessionModel = {
      id: this.encodeToken(sessionToken),
      userId: userExists.id,
      expiresAt: this.generateSessionExpiration(keepSession),
      permanentSession: keepSession,
    };

    await this._sessionRepository.insert(newSession);

    const authToken = this._authorizationService.generateAuthToken(userExists);
    return { model: newSession, token: sessionToken, auth: authToken };
  }

  async refresh(token: string): Promise<{ model: SessionModel; token: string; auth: AuthDto }> {
    const sessionId = this.encodeToken(token);
    let session = await this._sessionRepository.getById(sessionId);
    if (!session) throw new UnauthorizedException('Invalid credentials');

    const userExists = await this._userInfoRepository.getById(session.userId);
    if (!userExists) throw new UnauthorizedException('Invalid credentials.');

    // Delete session if expired
    if (Date.now() >= session.expiresAt.getTime()) {
      await this._sessionRepository.delete(session);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Refresh session if its expiration is less than half than the duration
    const tresholdTime =
      session.expiresAt.getTime() -
      (session.permanentSession ? PERMANENT_SESSION_DURATION : TEMPORARY_SESSION_DURATION) / 2;
    if (Date.now() > tresholdTime) {
      session = { ...session, expiresAt: this.generateSessionExpiration(session.permanentSession) };
      await this._sessionRepository.update(session);
    }

    const auth = this._authorizationService.generateAuthToken(userExists);
    return { model: session, token: token, auth: auth };
  }

  async logout(token: string): Promise<void> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    const session = await this._sessionRepository.getById(sessionId);
    if (!session) throw new UnauthorizedException('Invalid credentials');

    await this._sessionRepository.delete(session);
  }

  async logoutAll(userId: string): Promise<void> {
    const userExists = this._userInfoRepository.getById(userId);
    if (!userExists) throw new NotFoundException('User not found');
    await this._sessionRepository.deleteAll(userId);
  }
}
