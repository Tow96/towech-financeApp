import { v4 as uuidV4 } from 'uuid';

import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { USER_SCHEMA_CONNECTION } from '../../Database/Users.Provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UsersSchema } from '../../Database/Users.Schema';
import { eq } from 'drizzle-orm';
import { UserEntity } from '../Domain/User.Entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>
  ) {}

  // Commands -------------------------------------------------------------------------------------
  async registerUser(name: string, email: string, password: string, role: string): Promise<string> {
    // Check if email is already registered.
    const emailRegistered = await this._db
      .select({ email: UsersSchema.UserInfoTable.email })
      .from(UsersSchema.UserInfoTable)
      .where(eq(UsersSchema.UserInfoTable.email, email));
    if (emailRegistered.length > 0)
      throw new UnprocessableEntityException(`User with email "${email}" already registered.`);

    // Create user and store
    const newUser = UserEntity.create(uuidV4(), email, name, password, role);

    // await this._db.insert(UsersSchema.UserInfoTable).values({
    //   id: newUser.Id,
    //   createdAt: newUser.CreatedAt,
    //   updatedAt: newUser.UpdatedAt,
    //   name: newUser.Name,
    //   email: newUser.Email,
    //   emailVerified: newUser.EmailVerified,
    //   passwordHash: newUser.PasswordHash,
    //   role: newUser.Role,
    // });

    // TODO: Send email

    return 'a';
  }
}
