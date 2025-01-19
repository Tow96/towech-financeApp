import { v4 as uuidV4 } from 'uuid';
import { hash, verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
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

import { USER_SCHEMA_CONNECTION } from '../../Database/Users.Provider';
import { ChangeEmailDto } from '../Validation/ChangeEmail.Dto';
import { VerifyEmailDto } from '../Validation/VerifyEmail.Dto';
import { UsersSchema } from '../../Database/Users.Schema';

@Controller('user-new/:id/email')
export class EmailController {
  private readonly _logger = new Logger(EmailController.name);
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>
  ) {}

  @Patch('')
  // TODO: User guard
  async changeEmail(@Param('id') id: string, @Body() data: ChangeEmailDto): Promise<void> {
    const userExists = await this._db.query.UserInfoTable.findFirst({
      where: eq(UsersSchema.UserInfoTable.id, id),
    });
    if (!userExists) throw new NotFoundException('User not found.');

    // Update user
    await this._db
      .update(UsersSchema.UserInfoTable)
      .set({ email: data.email, emailVerified: false, updatedAt: new Date() })
      .where(eq(UsersSchema.UserInfoTable.id, id));

    this._logger.log(`Updated email of user with id ${id}.`);
  }

  @Post('/send-verification')
  // TODO: User/admin guard
  async sendVerificationEmail(@Param('id') userId: string): Promise<void> {
    const userExists = await this._db.query.UserInfoTable.findFirst({
      where: eq(UsersSchema.UserInfoTable.id, userId),
    });
    if (!userExists) throw new NotFoundException('User not found.');

    const [previousToken] = await this._db
      .select()
      .from(UsersSchema.EmailVerificationTable)
      .where(eq(UsersSchema.EmailVerificationTable.userId, userId));
    const minimumTime = new Date().getTime() - 10 * 60 * 1000;
    if (previousToken !== undefined && previousToken.createdAt.getTime() > minimumTime)
      throw new UnprocessableEntityException('Token generated too soon');

    // If older than 10 minutes, deletes the token
    if (previousToken)
      await this._db
        .delete(UsersSchema.EmailVerificationTable)
        .where(eq(UsersSchema.EmailVerificationTable.id, previousToken.id));

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
    await this._db.insert(UsersSchema.EmailVerificationTable).values({
      id: uuidV4(),
      userId: userId,
      hashedCode: hashedCode,
      createdAt: new Date(),
    });
    this._logger.log(`Email verification token generated for user: ${userId}`);
    this._logger.debug(`Created email verification code: ${code} for user: ${userId}`);

    // TODO: Send email with code

    return;
  }

  @Post('/verify')
  async verifyEmail(@Param('id') userId: string, @Body() data: VerifyEmailDto): Promise<void> {
    const userExists = await this._db.query.UserInfoTable.findFirst({
      where: eq(UsersSchema.UserInfoTable.id, userId),
    });
    if (!userExists) throw new NotFoundException('User not found.');

    const [tokenExists] = await this._db
      .select()
      .from(UsersSchema.EmailVerificationTable)
      .where(eq(UsersSchema.EmailVerificationTable.userId, userId));
    if (!tokenExists) throw new UnprocessableEntityException('Invalid token'); // Saying another thing is TMI

    const timeLimit = new Date().getTime() - 24 * 60 * 60 * 1000; // 24 hours
    if (tokenExists.createdAt.getTime() < timeLimit)
      throw new UnprocessableEntityException('Token expired, generate a new one');

    if (!(await verify(tokenExists.hashedCode, data.token)))
      throw new UnprocessableEntityException('Invalid token');

    // delete token
    await this._db
      .delete(UsersSchema.EmailVerificationTable)
      .where(eq(UsersSchema.EmailVerificationTable.id, tokenExists.id));

    // update user
    await this._db
      .update(UsersSchema.UserInfoTable)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(UsersSchema.UserInfoTable.id, userId));

    this._logger.log(`User: ${userId}, successfully verified their account`);
  }
}
