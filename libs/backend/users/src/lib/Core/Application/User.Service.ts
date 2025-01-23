import { v4 as uuidV4 } from 'uuid';

import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { USER_SCHEMA_CONNECTION } from '../../Database/Users.Provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UsersSchema } from '../../Database/Users.Schema';
import { eq } from 'drizzle-orm';
import { UserEntity } from '../Domain/Entities/User.Entity';
import {
  encodeBase32LowerCaseNoPadding,
  encodeBase32UpperCaseNoPadding,
} from '../../fake-oslo/encoding';
import { SessionEntity } from '../Domain/Entities/Session.Entity';
import { AuthorizationService, TokenDto } from './Authorization.Service';
import { UserRepository } from '../../Database/User.Repository';

@Injectable()
export class UserService {
  private readonly _logger = new Logger(UserService.name);
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>,
    private readonly _userRepository: UserRepository,
    private readonly _authorizationService: AuthorizationService
  ) {}

  async createSession(
    email: string,
    password: string,
    isPermanent: boolean
  ): Promise<{ id: string; expiration: Date; auth: TokenDto }> {
    this._logger.log(`Creating session for user.`);
    // Map data
    const user = await this._userRepository.fetchUserByEmail(email);
    this._logger.log(`Found user: ${user.Id}`);

    // Create session
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const sessionId = encodeBase32LowerCaseNoPadding(tokenBytes);
    const session = user.addSession(password, sessionId, isPermanent);
    if (!session) throw new UnauthorizedException('Invalid credentials');

    this._logger.verbose(sessionId);
    this._logger.log(`Created session for user: ${user.Id}`);
    await this._userRepository.persistChanges(user);

    const auth = this._authorizationService.generateAuthToken({
      accountVerified: user.EmailVerified,
      role: user.Role,
      userId: user.Id,
    });

    return { id: sessionId, expiration: session.ExpiresAt, auth };
  }

  async changeEmail(userId: string, email: string): Promise<void> {
    this._logger.log(`Updating email for user: ${userId}`);
    const emailRegistered = await this._db
      .select({ email: UsersSchema.UserInfoTable.email })
      .from(UsersSchema.UserInfoTable)
      .where(eq(UsersSchema.UserInfoTable.email, email));
    if (emailRegistered.length > 0)
      throw new UnprocessableEntityException(`User with email "${email}" already registered.`);

    // Map data
    const user = await this._userRepository.fetchUserById(userId);
    this._logger.verbose(user);

    // Update and save
    user.setBasicInfo({ email: email });
    await this._userRepository.persistChanges(user);
  }

  async changeName(userId: string, name: string): Promise<void> {
    this._logger.log(`Updating name for user: ${userId}.`);

    // Map data
    const user = await this._userRepository.fetchUserById(userId);

    // Update and save
    user.setBasicInfo({ name: name });
    await this._userRepository.persistChanges(user);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    this._logger.log(`Changing password for user: ${userId}.`);

    // Map data
    const user = await this._userRepository.fetchUserById(userId);

    // Update and save
    const updated = user.setPassword(oldPassword, newPassword);
    if (!updated) throw new UnprocessableEntityException('Invalid password');

    await this._userRepository.persistChanges(user);
  }

  async delete(userId: string): Promise<void> {
    const [userExists] = await this._db
      .select({ id: UsersSchema.UserInfoTable.id })
      .from(UsersSchema.UserInfoTable)
      .where(eq(UsersSchema.UserInfoTable.id, userId));
    if (!userExists) throw new NotFoundException('User not found.');

    this._logger.log(`Deleting user: ${userId}.`);

    await this._db
      .delete(UsersSchema.UserInfoTable)
      .where(eq(UsersSchema.UserInfoTable.id, userId));
  }

  async deleteSession(sessionId: string) {
    const encodedId = SessionEntity.encodeId(sessionId);
    this._logger.log(`Deleting session: ${encodedId}`);

    const user = await this._userRepository.fetchUserBySession(encodedId);
    user.deleteSession(encodedId);

    await this._userRepository.persistChanges(user);
  }

  async deleteAllUserSessions(userId: string) {
    const user = await this._userRepository.fetchUserById(userId);
    user.deleteAllSessions();
    await this._userRepository.persistChanges(user);
  }

  async generateEmailVerificationCode(userId: string): Promise<void> {
    this._logger.log(`Generating email verification code for user: ${userId}.`);

    // Map user
    const user = await this._userRepository.fetchUserById(userId);
    if (user.EmailVerified) throw new UnprocessableEntityException('User already verified.');

    // Create code
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    const code = encodeBase32UpperCaseNoPadding(bytes);

    const updated = user.generateEmailVerification(code);
    if (!updated) throw new UnprocessableEntityException('Code generated too recently.');

    this._logger.verbose(`CODE: ${code}`);
    await this._userRepository.persistChanges(user);

    // TODO: Send email
  }

  async generatePasswordResetCode(userId: string): Promise<void> {
    this._logger.log(`Generating password reset code for user: ${userId}.`);

    // Map user
    const user = await this._userRepository.fetchUserById(userId);

    // Create code
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    const code = encodeBase32UpperCaseNoPadding(bytes);

    const updated = user.generatePasswordResetCode(code);
    if (!updated) throw new UnprocessableEntityException('Code generated too recently.');

    this._logger.verbose(`CODE: ${code}`);
    await this._userRepository.persistChanges(user);

    // TODO: Send email
  }

  async refreshSession(
    sessionId: string
  ): Promise<{ id: string; expiration: Date; auth: TokenDto }> {
    const encodedId = SessionEntity.encodeId(sessionId);
    this._logger.log(`Refreshing session: ${encodedId}`);

    const user = await this._userRepository.fetchUserBySession(encodedId);
    const session = user.refreshSession(encodedId);
    await this._userRepository.persistChanges(user);

    const auth = this._authorizationService.generateAuthToken({
      accountVerified: user.EmailVerified,
      role: user.Role,
      userId: user.Id,
    });

    return { id: sessionId, expiration: session?.ExpiresAt || new Date(0), auth };
  }

  async register(name: string, email: string, password: string, role: string): Promise<string> {
    this._logger.log(`Checking if user with email "${email}" is already registered.`);
    const emailRegistered = await this._db
      .select({ email: UsersSchema.UserInfoTable.email })
      .from(UsersSchema.UserInfoTable)
      .where(eq(UsersSchema.UserInfoTable.email, email));
    if (emailRegistered.length > 0)
      throw new UnprocessableEntityException(`User with email "${email}" already registered.`);

    this._logger.log(`Creating user with email "${email}".`);
    const newUser = UserEntity.create(uuidV4(), email, name, password, role);

    this._logger.log(`Saving changes`);
    await this._userRepository.persistChanges(newUser);

    // TODO: Send email

    return newUser.Id;
  }

  async resetPassword(userId: string, code: string, newPassword: string): Promise<void> {
    this._logger.log(`Resetting password for user: ${userId}`);

    // Map user
    const user = await this._userRepository.fetchUserById(userId);

    // Verify
    const status = user.resetPassword(code, newPassword);
    if (!status) throw new UnprocessableEntityException('Invalid code');

    await this._userRepository.persistChanges(user);
  }

  async verifyEmail(userId: string, code: string): Promise<void> {
    this._logger.log(`Verifying email for user: ${userId}`);

    // Map user
    const user = await this._userRepository.fetchUserById(userId);

    // Verify
    const status = user.verifyEmail(code);
    if (!status) throw new UnprocessableEntityException('Invalid code');

    await this._userRepository.persistChanges(user);
  }
}
