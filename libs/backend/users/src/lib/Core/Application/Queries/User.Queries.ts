import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

// Schema
import { USER_SCHEMA_CONNECTION } from '../../../Database/Users.Provider';
import { UsersSchema } from '../../../Database/Users.Schema';

export type GetUserDto = {
  id: string;
  email: string;
  name: string;
  role: string;
  accountVerified: boolean;
};

export type GetUsersDto = {
  id: string;
  email: string;
  name: string;
  role: string;
};

@Injectable()
export class UserQueries {
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>
  ) {}

  async getAll(): Promise<GetUsersDto[]> {
    return this._db
      .select({
        id: UsersSchema.UserInfoTable.id,
        email: UsersSchema.UserInfoTable.email,
        name: UsersSchema.UserInfoTable.name,
        role: UsersSchema.UserInfoTable.role,
      })
      .from(UsersSchema.UserInfoTable);
  }

  async get(userId: string): Promise<GetUserDto> {
    const [data] = await this._db
      .select({
        id: UsersSchema.UserInfoTable.id,
        email: UsersSchema.UserInfoTable.email,
        name: UsersSchema.UserInfoTable.name,
        role: UsersSchema.UserInfoTable.role,
        accountVerified: UsersSchema.UserInfoTable.emailVerified,
      })
      .from(UsersSchema.UserInfoTable)
      .where(eq(UsersSchema.UserInfoTable.id, userId));

    if (!data) throw new NotFoundException('User not found');
    return data;
  }
}
