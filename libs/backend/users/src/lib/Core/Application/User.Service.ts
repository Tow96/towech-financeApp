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
import { UserEntity, UserStatus } from '../Domain/Entities/User.Entity';
import { OTPStatus } from '../Domain/Entities/OneTimePassword.Entity';
import {
  encodeBase32LowerCaseNoPadding,
  encodeBase32UpperCaseNoPadding,
} from '../../fake-oslo/encoding';
import { SessionEntity, SessionStatus } from '../Domain/Entities/Session.Entity';
import { AuthorizationService, TokenDto } from './Authorization.Service';

@Injectable()
export class UserService {
  private readonly _logger = new Logger(UserService.name);
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>,
    private readonly _authorizationService: AuthorizationService
  ) {}

  // Commands -------------------------------------------------------------------------------------
  private async fetchUserFromDbByEmail(email: string): Promise<UserEntity> {
    this._logger.log(`Fetching user by email from database.`);

    const query = await this._db
      .select()
      .from(UsersSchema.UserInfoTable)
      .leftJoin(
        UsersSchema.EmailVerificationTable,
        eq(UsersSchema.UserInfoTable.id, UsersSchema.EmailVerificationTable.id)
      )
      .leftJoin(
        UsersSchema.PasswordResetTable,
        eq(UsersSchema.PasswordResetTable.id, UsersSchema.PasswordResetTable.id)
      )
      .fullJoin(
        UsersSchema.SessionTable,
        eq(UsersSchema.UserInfoTable.id, UsersSchema.SessionTable.userId)
      )
      .where(eq(UsersSchema.UserInfoTable.email, email));

    if (query.length === 0) throw new NotFoundException('User not found.');
    if (!query[0].info) throw new NotFoundException('User not found.');
    const sessions = query.map((x) => x.sessions).filter((x) => x !== null);

    return UserEntity.getFromDb({
      info: query[0].info,
      email_verification: query[0].email_verification,
      password_reset: query[0].password_reset,
      sessions: sessions,
    });
  }
  private async fetchUserFromDbById(userId: string): Promise<UserEntity> {
    this._logger.log(`Fetching user: ${userId} from database.`);
    const query = await this._db
      .select()
      .from(UsersSchema.UserInfoTable)
      .leftJoin(
        UsersSchema.EmailVerificationTable,
        eq(UsersSchema.UserInfoTable.id, UsersSchema.EmailVerificationTable.id)
      )
      .leftJoin(
        UsersSchema.PasswordResetTable,
        eq(UsersSchema.PasswordResetTable.id, UsersSchema.PasswordResetTable.id)
      )
      .fullJoin(
        UsersSchema.SessionTable,
        eq(UsersSchema.UserInfoTable.id, UsersSchema.SessionTable.userId)
      )
      .where(eq(UsersSchema.UserInfoTable.id, userId));

    if (query.length === 0) throw new NotFoundException('User not found.');
    if (!query[0].info) throw new NotFoundException('User not found.');
    const sessions = query.map((x) => x.sessions).filter((x) => x !== null);

    return UserEntity.getFromDb({
      info: query[0].info,
      email_verification: query[0].email_verification,
      password_reset: query[0].password_reset,
      sessions: sessions,
    });
  }
  private async fetchUserFromDbBySession(sessionId: string): Promise<UserEntity> {
    this._logger.log(`Fetching user session from database.`);
    // These are two queries
    const [query] = await this._db
      .select({ userId: UsersSchema.SessionTable.userId })
      .from(UsersSchema.SessionTable)
      .where(eq(UsersSchema.SessionTable.id, sessionId));
    if (!query) throw new NotFoundException('Invalid credentials.');

    return this.fetchUserFromDbById(query.userId);
  }

  private async saveChanges(user: UserEntity): Promise<void> {
    this._logger.log(`User updated, saving changes.`);
    this._logger.verbose(user);

    // TODO: Use batch to improve efficiency

    // If the user was deleted, remove it and finish
    if (user.Status === UserStatus.DELETED) {
      await this._db
        .delete(UsersSchema.UserInfoTable)
        .where(eq(UsersSchema.UserInfoTable.id, user.Id));
      return;
    }
    if (user.Status === UserStatus.CREATED) {
      await this._db.insert(UsersSchema.UserInfoTable).values({
        id: user.Id,
        createdAt: user.CreatedAt,
        updatedAt: user.UpdatedAt,
        name: user.Name,
        email: user.Email,
        emailVerified: user.EmailVerified,
        passwordHash: user.PasswordHash,
        role: user.Role,
      } as typeof UsersSchema.UserInfoTable.$inferInsert);
    }
    if (user.Status === UserStatus.UPDATED) {
      await this._db
        .update(UsersSchema.UserInfoTable)
        .set({
          id: user.Id,
          createdAt: user.CreatedAt,
          email: user.Email,
          emailVerified: user.EmailVerified,
          name: user.Name,
          passwordHash: user.PasswordHash,
          role: user.Role,
          updatedAt: user.UpdatedAt,
        } as typeof UsersSchema.UserInfoTable.$inferInsert)
        .where(eq(UsersSchema.UserInfoTable.id, user.Id));
    }

    if (user.EmailVerificationCode) {
      if (user.EmailVerificationCode.Status === OTPStatus.CREATED)
        await this._db.insert(UsersSchema.EmailVerificationTable).values({
          id: user.Id,
          createdAt: user.EmailVerificationCode.CreatedAt,
          hashedCode: user.EmailVerificationCode.CodeHash,
        });
      if (user.EmailVerificationCode.Status === OTPStatus.UPDATED)
        await this._db
          .update(UsersSchema.EmailVerificationTable)
          .set({
            hashedCode: user.EmailVerificationCode.CodeHash,
            createdAt: user.EmailVerificationCode.CreatedAt,
          })
          .where(eq(UsersSchema.EmailVerificationTable.id, user.Id));
      if (
        user.EmailVerificationCode.Status === OTPStatus.DELETED ||
        user.EmailVerificationCode.Status === OTPStatus.EXPIRED
      )
        await this._db
          .delete(UsersSchema.EmailVerificationTable)
          .where(eq(UsersSchema.EmailVerificationTable.id, user.Id));
    }

    if (user.PasswordResetCode) {
      if (user.PasswordResetCode.Status === OTPStatus.CREATED)
        await this._db.insert(UsersSchema.PasswordResetTable).values({
          id: user.Id,
          createdAt: user.PasswordResetCode.CreatedAt,
          hashedCode: user.PasswordResetCode.CodeHash,
        });
      if (user.PasswordResetCode.Status === OTPStatus.UPDATED)
        await this._db
          .update(UsersSchema.PasswordResetTable)
          .set({
            hashedCode: user.PasswordResetCode.CodeHash,
            createdAt: user.PasswordResetCode.CreatedAt,
          })
          .where(eq(UsersSchema.PasswordResetTable.id, user.Id));
      if (
        user.PasswordResetCode.Status === OTPStatus.DELETED ||
        user.PasswordResetCode.Status === OTPStatus.EXPIRED
      )
        await this._db
          .delete(UsersSchema.PasswordResetTable)
          .where(eq(UsersSchema.PasswordResetTable.id, user.Id));
    }

    user.Sessions.forEach(async (x) => {
      if (x.Status === SessionStatus.CREATED)
        await this._db.insert(UsersSchema.SessionTable).values({
          id: x.EncodedId,
          expiresAt: x.ExpiresAt,
          permanentSession: x.IsPermanent,
          userId: user.Id,
        });
      if (x.Status === SessionStatus.UPDATED)
        await this._db
          .update(UsersSchema.SessionTable)
          .set({ expiresAt: x.ExpiresAt })
          .where(eq(UsersSchema.SessionTable.id, x.EncodedId));
      if (x.Status === SessionStatus.DELETED || x.Status === SessionStatus.EXPIRED)
        await this._db
          .delete(UsersSchema.SessionTable)
          .where(eq(UsersSchema.SessionTable.id, x.EncodedId));
    });
  }

  async createSession(
    email: string,
    password: string,
    isPermanent: boolean
  ): Promise<{ id: string; expiration: Date; auth: TokenDto }> {
    this._logger.log(`Creating session for user.`);
    // Map data
    const user = await this.fetchUserFromDbByEmail(email);
    this._logger.log(`Found user: ${user.Id}`);

    // Create session
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const sessionId = encodeBase32LowerCaseNoPadding(tokenBytes);
    const session = user.addSession(password, sessionId, isPermanent);
    if (!session) throw new UnauthorizedException('Invalid credentials');

    this._logger.verbose(sessionId);
    this._logger.log(`Created session for user: ${user.Id}`);
    this.saveChanges(user);

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
    const user = await this.fetchUserFromDbById(userId);
    this._logger.verbose(user);

    // Update and save
    user.setBasicInfo({ email: email });
    this.saveChanges(user);
  }

  async changeName(userId: string, name: string): Promise<void> {
    this._logger.log(`Updating name for user: ${userId}.`);

    // Map data
    const user = await this.fetchUserFromDbById(userId);

    // Update and save
    user.setBasicInfo({ name: name });
    this.saveChanges(user);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    this._logger.log(`Changing password for user: ${userId}.`);

    // Map data
    const user = await this.fetchUserFromDbById(userId);

    // Update and save
    const updated = user.setPassword(oldPassword, newPassword);
    if (!updated) throw new UnprocessableEntityException('Invalid password');

    this.saveChanges(user);
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

    const user = await this.fetchUserFromDbBySession(encodedId);
    user.deleteSession(encodedId);

    this.saveChanges(user);
  }

  async deleteAllUserSessions(userId: string) {
    const user = await this.fetchUserFromDbById(userId);
    user.deleteAllSessions();
    this.saveChanges(user);
  }

  async generateEmailVerificationCode(userId: string): Promise<void> {
    this._logger.log(`Generating email verification code for user: ${userId}.`);

    // Map user
    const user = await this.fetchUserFromDbById(userId);
    if (user.EmailVerified) throw new UnprocessableEntityException('User already verified.');

    // Create code
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    const code = encodeBase32UpperCaseNoPadding(bytes);

    const updated = user.generateEmailVerification(code);
    if (!updated) throw new UnprocessableEntityException('Code generated too recently.');

    this._logger.verbose(`CODE: ${code}`);
    this.saveChanges(user);

    // TODO: Send email
  }

  async generatePasswordResetCode(userId: string): Promise<void> {
    this._logger.log(`Generating password reset code for user: ${userId}.`);

    // Map user
    const user = await this.fetchUserFromDbById(userId);

    // Create code
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    const code = encodeBase32UpperCaseNoPadding(bytes);

    const updated = user.generatePasswordResetCode(code);
    if (!updated) throw new UnprocessableEntityException('Code generated too recently.');

    this._logger.verbose(`CODE: ${code}`);
    this.saveChanges(user);

    // TODO: Send email
  }

  async refreshSession(
    sessionId: string
  ): Promise<{ id: string; expiration: Date; auth: TokenDto }> {
    const encodedId = SessionEntity.encodeId(sessionId);
    this._logger.log(`Refreshing session: ${encodedId}`);

    const user = await this.fetchUserFromDbBySession(encodedId);
    const session = user.refreshSession(encodedId);
    this.saveChanges(user);

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
    await this.saveChanges(newUser);

    // TODO: Send email

    return newUser.Id;
  }

  async resetPassword(userId: string, code: string, newPassword: string): Promise<void> {
    this._logger.log(`Resetting password for user: ${userId}`);

    // Map user
    const user = await this.fetchUserFromDbById(userId);

    // Verify
    const status = user.resetPassword(code, newPassword);
    if (!status) throw new UnprocessableEntityException('Invalid code');

    this.saveChanges(user);
  }

  async verifyEmail(userId: string, code: string): Promise<void> {
    this._logger.log(`Verifying email for user: ${userId}`);

    // Map user
    const user = await this.fetchUserFromDbById(userId);

    // Verify
    const status = user.verifyEmail(code);
    if (!status) throw new UnprocessableEntityException('Invalid code');

    this.saveChanges(user);
  }
}
