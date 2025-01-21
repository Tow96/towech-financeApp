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
import { UserEntity } from '../Domain/User.Entity';

@Injectable()
export class UserService {
  private readonly _logger = new Logger(UserService.name);
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>
  ) {}
  // Queries --------------------------------------------------------------------------------------
  async getAll(): Promise<{ id: string; email: string; name: string }[]> {
    return this._db
      .select({
        id: UsersSchema.UserInfoTable.id,
        email: UsersSchema.UserInfoTable.email,
        name: UsersSchema.UserInfoTable.name,
      })
      .from(UsersSchema.UserInfoTable);
  }

  async get(userId: string): Promise<{ id: string; email: string; name: string }> {
    const [data] = await this._db
      .select({
        id: UsersSchema.UserInfoTable.id,
        email: UsersSchema.UserInfoTable.email,
        name: UsersSchema.UserInfoTable.name,
      })
      .from(UsersSchema.UserInfoTable)
      .where(eq(UsersSchema.UserInfoTable.id, userId));

    if (!data) throw new NotFoundException('User not found');
    return data;
  }

  // Commands -------------------------------------------------------------------------------------
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
    await this._db.insert(UsersSchema.UserInfoTable).values({
      id: newUser.Id,
      createdAt: newUser.CreatedAt,
      updatedAt: newUser.UpdatedAt,
      name: newUser.Name,
      email: newUser.Email,
      emailVerified: newUser.EmailVerified,
      passwordHash: newUser.PasswordHash,
      role: newUser.Role,
    } as typeof UsersSchema.UserInfoTable.$inferInsert);

    // TODO: Send email

    return newUser.Id;
  }
}
