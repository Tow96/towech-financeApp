import { getRandomValues } from 'crypto';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthorizationService, TokenDto } from '@financeapp/backend-authorization';
import { encodeBase32LowerCaseNoPadding } from '../../../fake-oslo/encoding';

// Repos
import { UserRepository } from '../../../Database/User.Repository';

// Entities
import { SessionEntity } from '../../Domain/Entities/Session.Entity';

export type SessionDto = {
  id: string;
  expiration: Date;
  auth: TokenDto;
};

@Injectable()
export class SessionCommands {
  private readonly _logger = new Logger(SessionCommands.name);

  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _authorizationService: AuthorizationService
  ) {}

  async createSession(email: string, password: string, isPermanent: boolean): Promise<SessionDto> {
    this._logger.log(`Creating session for user.`);
    // Map
    const user = await this._userRepository.fetchUserByEmail(email);
    this._logger.log(`Found user: ${user.Id}`);

    // Change
    const tokenBytes = new Uint8Array(20);
    getRandomValues(tokenBytes);
    const sessionId = encodeBase32LowerCaseNoPadding(tokenBytes);
    const session = user.addSession(password, sessionId, isPermanent);
    if (!session) throw new UnauthorizedException('Invalid credentials');
    this._logger.log(`Created session for user: ${user.Id}`);

    // Persist
    this._logger.verbose(sessionId);
    await this._userRepository.persistChanges(user);

    // Return
    const auth = this._authorizationService.generateAuthToken({
      accountVerified: user.EmailVerified,
      role: user.Role,
      userId: user.Id,
      legacyId: user.LegacyId,
    });
    return { id: sessionId, expiration: session.ExpiresAt, auth };
  }

  async deleteAllUserSessions(userId: string): Promise<void> {
    this._logger.log(`Deleting all sessions for user: ${userId}`);
    // Map
    const user = await this._userRepository.fetchUserById(userId);

    // Change
    user.deleteAllSessions();

    // Persist
    await this._userRepository.persistChanges(user);
  }

  async deleteSession(sessionId: string): Promise<void> {
    const encodedId = SessionEntity.encodeId(sessionId);
    this._logger.log(`Deleting session: ${encodedId}`);
    // Map
    const user = await this._userRepository.fetchUserBySession(encodedId);

    // Change
    user.deleteSession(encodedId);

    // Persist
    await this._userRepository.persistChanges(user);
  }

  async refreshSession(sessionId: string): Promise<SessionDto> {
    const encodedId = SessionEntity.encodeId(sessionId);
    this._logger.log(`Refreshing session: ${encodedId}`);

    // Map
    const user = await this._userRepository.fetchUserBySession(encodedId);

    // Change
    const session = user.refreshSession(encodedId);

    // Persist
    await this._userRepository.persistChanges(user);

    // Return
    const auth = this._authorizationService.generateAuthToken({
      accountVerified: user.EmailVerified,
      role: user.Role,
      userId: user.Id,
      legacyId: user.LegacyId,
    });
    return { id: sessionId, expiration: session?.ExpiresAt || new Date(0), auth };
  }
}
