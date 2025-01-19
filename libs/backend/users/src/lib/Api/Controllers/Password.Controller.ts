import { v4 as uuidV4 } from 'uuid';
import { hash, verify } from '@node-rs/argon2';
import { encodeBase32UpperCaseNoPadding } from '../../fake-oslo/encoding';
import {
  Body,
  Controller,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { USER_SCHEMA_CONNECTION } from '../../Database/Users.Provider';
import { UsersSchema } from '../../Database/Users.Schema';
import { ChangePasswordDto } from '../Validation/ChangePassword.Dto';
import { eq } from 'drizzle-orm';
import { ResetPasswordDto } from '../Validation/ResetPassword.Dto';

@Controller('user-new/:id/password')
export class PasswordController {
  private readonly _logger = new Logger(PasswordController.name);
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>
  ) {}

  @Patch('')
  // TODO: User guard
  async changePassword(@Param('id') id: string, @Body() data: ChangePasswordDto): Promise<void> {
    const userExists = await this._db.query.UserInfoTable.findFirst({
      where: eq(UsersSchema.UserInfoTable.id, id),
    });
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
    await this._db
      .update(UsersSchema.UserInfoTable)
      .set({ passwordHash: passwordHash, updatedAt: new Date() })
      .where(eq(UsersSchema.UserInfoTable.id, id));

    this._logger.log(`Updated password for user: ${id}`);
  }

  @Post('/send-reset')
  async sendPasswordResetEmail(@Param('id') userId: string): Promise<void> {
    const userExists = await this._db.query.UserInfoTable.findFirst({
      where: eq(UsersSchema.UserInfoTable.id, userId),
    });
    if (!userExists) throw new NotFoundException('User not found.');

    const [previousCode] = await this._db
      .select()
      .from(UsersSchema.PasswordResetTable)
      .where(eq(UsersSchema.PasswordResetTable.id, userId));
    const minimumTime = new Date().getTime() - 10 * 60 * 1000; // 10 min
    if (previousCode !== undefined && previousCode.createdAt.getTime() > minimumTime)
      throw new UnprocessableEntityException('A reset code can only be generated every 10 minutes');

    // If older than 10 minutes, delete previous token
    if (previousCode)
      await this._db
        .delete(UsersSchema.PasswordResetTable)
        .where(eq(UsersSchema.PasswordResetTable.id, userId));

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
    await this._db.insert(UsersSchema.PasswordResetTable).values({
      id: uuidV4(),
      userId: userId,
      hashedCode: hashedCode,
      createdAt: new Date(),
    });
    this._logger.log(`Password reset token generated for user: ${userId}`);
    this._logger.debug(`Created password reset token: ${code} for user: ${userId}`);

    // TODO: Send email with code

    return;
  }

  @Post('/reset')
  async resetPassword(@Param('id') userId: string, @Body() data: ResetPasswordDto): Promise<void> {
    const userExists = await this._db.query.UserInfoTable.findFirst({
      where: eq(UsersSchema.UserInfoTable.id, userId),
    });
    if (!userExists) throw new NotFoundException('User not found.');

    const [code] = await this._db
      .select()
      .from(UsersSchema.PasswordResetTable)
      .where(eq(UsersSchema.PasswordResetTable.userId, userId));
    if (!code) throw new UnprocessableEntityException('Invalid code'); // Saying another thing is TMI

    const timeLimit = new Date().getTime() - 24 * 60 * 60 * 1000; // 24 hours
    if (code.createdAt.getTime() < timeLimit)
      throw new UnprocessableEntityException('Code expired, generate a new one');

    if (!(await verify(code.hashedCode, data.resetCode)))
      throw new UnprocessableEntityException('Invalid code');

    // delete code
    await this._db
      .delete(UsersSchema.PasswordResetTable)
      .where(eq(UsersSchema.PasswordResetTable.id, userId));

    // update user
    const passwordHash = await hash(data.newPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    await this._db
      .update(UsersSchema.UserInfoTable)
      .set({ passwordHash: passwordHash, updatedAt: new Date() })
      .where(eq(UsersSchema.UserInfoTable.id, userId));

    this._logger.log(`User: ${userId}, successfully reset their password`);
  }
}
