import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { eq, SQL } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

// Schema
import { USER_SCHEMA_CONNECTION } from './Users.Provider';
import { UsersSchema } from './Users.Schema';

// Entities
import { UserEntity, UserStatus } from '../Core/Domain/Entities/User.Entity';
import { OTPStatus } from '../Core/Domain/Entities/OneTimePassword.Entity';
import { SessionStatus } from '../Core/Domain/Entities/Session.Entity';

@Injectable()
export class UserRepository {
  private readonly _logger = new Logger(UserRepository.name);

  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>
  ) {}

  private async fetchUser(where: SQL<unknown>): Promise<UserEntity> {
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
      .where(where);

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

  public async fetchUserByEmail(email: string): Promise<UserEntity> {
    this._logger.log(`Fetching user by email from database.`);
    return this.fetchUser(eq(UsersSchema.UserInfoTable.email, email));
  }

  public async fetchUserById(userId: string): Promise<UserEntity> {
    this._logger.log(`Fetching user: ${userId} from database.`);
    return this.fetchUser(eq(UsersSchema.UserInfoTable.id, userId));
  }

  public async fetchUserBySession(encodedId: string): Promise<UserEntity> {
    this._logger.log(`Fetching user by session from database.`);

    const [query] = await this._db
      .select({ userId: UsersSchema.SessionTable.userId })
      .from(UsersSchema.SessionTable)
      .where(eq(UsersSchema.SessionTable.id, encodedId));
    if (!query) throw new NotFoundException('Invalid credentials.');

    return this.fetchUserById(query.userId);
  }

  public async isEmailRegistered(email: string): Promise<boolean> {
    const emailRegistered = await this._db
      .select({ email: UsersSchema.UserInfoTable.email })
      .from(UsersSchema.UserInfoTable)
      .where(eq(UsersSchema.UserInfoTable.email, email));

    return emailRegistered.length > 0;
  }

  public async persistChanges(user: UserEntity): Promise<void> {
    this._logger.log(`User updated, saving changes.`);
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

    await Promise.all(
      user.Sessions.map(async (x): Promise<void> => {
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
      })
    );
  }
}
