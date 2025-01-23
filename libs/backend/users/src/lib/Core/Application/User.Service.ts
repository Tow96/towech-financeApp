import { v4 as uuidV4 } from 'uuid';

import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { USER_SCHEMA_CONNECTION } from '../../Database/Users.Provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UsersSchema } from '../../Database/Users.Schema';
import { eq } from 'drizzle-orm';
import { UserEntity } from '../Domain/Entities/User.Entity';
import { encodeBase32UpperCaseNoPadding } from '../../fake-oslo/encoding';
import { AuthorizationService } from './Authorization.Service';
import { UserRepository } from '../../Database/User.Repository';

@Injectable()
export class UserService {
  private readonly _logger = new Logger(UserService.name);
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>,
    private readonly _userRepository: UserRepository,
    private readonly _authorizationService: AuthorizationService
  ) {}

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
