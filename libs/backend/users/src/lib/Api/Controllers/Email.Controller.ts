import { v4 as uuidV4 } from 'uuid';
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

import { DATABASE_CONNECTION } from '../../Database/drizzle.provider';
import * as schema from '../../Database/Schemas';
import { ChangeEmailDto } from '../Validation/ChangeEmail.Dto';
import { VerifyEmailDto } from '../Validation/VerifyEmail.Dto';

@Controller('user-new/:id/email')
export class EmailController {
  private readonly _logger = new Logger(EmailController.name);
  constructor(@Inject(DATABASE_CONNECTION) private readonly _db: NodePgDatabase<typeof schema>) {}

  @Patch('')
  async changeEmail(@Param('id') id: string, @Body() data: ChangeEmailDto): Promise<void> {
    const userExists = await this._db.query.UserSchema.findFirst({
      where: eq(schema.UserSchema.id, id),
    });
    if (!userExists) throw new NotFoundException('User not found.');

    // Update user
    await this._db
      .update(schema.UserSchema)
      .set({ email: data.email, emailVerified: false, updatedAt: new Date() })
      .where(eq(schema.UserSchema.id, id));

    this._logger.log(`Updated email of user with id ${id}.`);
  }

  @Post('/send-verification')
  async sendVerificationEmail(@Param('id') userId: string): Promise<void> {
    const userExists = await this._db.query.UserSchema.findFirst({
      where: eq(schema.UserSchema.id, userId),
    });
    if (!userExists) throw new NotFoundException('User not found.');

    const [previousToken] = await this._db
      .select()
      .from(schema.EmailVerificationSchema)
      .where(eq(schema.EmailVerificationSchema.userId, userId));
    const minimumTime = new Date().getTime() - 10 * 60 * 1000;
    if (previousToken !== undefined && previousToken.tokenCreatedAt.getTime() > minimumTime)
      throw new UnprocessableEntityException('Token generated too soon');

    // If older than 10 minutes, deletes the token
    if (previousToken)
      await this._db
        .delete(schema.EmailVerificationSchema)
        .where(eq(schema.EmailVerificationSchema.id, previousToken.id));

    // Generates random OTP
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    const code = encodeBase32UpperCaseNoPadding(bytes);

    // Stores the new token
    await this._db.insert(schema.EmailVerificationSchema).values({
      id: uuidV4(),
      userId: userId,
      verificationToken: code, // TODO: Store hashed
      tokenCreatedAt: new Date(),
    });
    this._logger.log(`Email verification token generated for user: ${userId}`);
    this._logger.debug(`Created email verification code: ${code} for user: ${userId}`);

    // TODO: Send email with code

    return;
  }

  @Post('/verify')
  async verifyEmail(@Param('id') id: string, @Body() data: VerifyEmailDto): Promise<void> {
    const userExists = await this._db.query.UserSchema.findFirst({
      where: eq(schema.UserSchema.id, id),
    });
    if (!userExists) throw new NotFoundException('User not found.');

    const [tokenExists] = await this._db
      .select()
      .from(schema.EmailVerificationSchema)
      .where(eq(schema.EmailVerificationSchema.userId, id));
    if (!tokenExists) throw new UnprocessableEntityException('Invalid token'); // Saying another thing is TMI

    const timeLimit = new Date().getTime() - 24 * 60 * 60 * 1000; // 24 hours
    if (tokenExists.tokenCreatedAt.getTime() < timeLimit)
      throw new UnprocessableEntityException('Token expired, generate a new one');

    // TODO: Verify using hash
    if (tokenExists.verificationToken !== data.token)
      throw new UnprocessableEntityException('Invalid token');

    // delete token
    await this._db
      .delete(schema.EmailVerificationSchema)
      .where(eq(schema.EmailVerificationSchema.id, tokenExists.id));

    // update user
    await this._db
      .update(schema.UserSchema)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(schema.UserSchema.id, id));

    this._logger.log(`User: ${id}, successfully verified their account`);
  }
}
