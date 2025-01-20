import { Inject, Injectable, Logger } from '@nestjs/common';
import { eq, getTableName } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { USER_SCHEMA_CONNECTION } from '../Users.Provider';
import { UsersSchema } from '../Users.Schema';

export type UserInfoModel = typeof UsersSchema.UserInfoTable.$inferSelect;

const tableName = `users.${getTableName(UsersSchema.UserInfoTable)}`;

@Injectable()
export class UserInfoRepository {
  private readonly _logger = new Logger(UserInfoRepository.name);
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>
  ) {}

  async delete(model: UserInfoModel): Promise<void> {
    await this._db
      .delete(UsersSchema.UserInfoTable)
      .where(eq(UsersSchema.UserInfoTable.id, model.id));
    this._logger.verbose(`Deleted entry with id: ${model.id} in table: ${tableName}}.`);
  }

  async getById(id: string): Promise<UserInfoModel | undefined> {
    this._logger.verbose(`Fetching if entry exists with id: ${id} in table: ${tableName}.`);
    const [value] = await this._db
      .select()
      .from(UsersSchema.UserInfoTable)
      .where(eq(UsersSchema.UserInfoTable.id, id));
    return value;
  }

  async insert(model: UserInfoModel): Promise<void> {
    await this._db.insert(UsersSchema.UserInfoTable).values({ ...model });

    this._logger.verbose(`Inserted entry with id: ${model.id} in table: ${tableName}.`);
  }

  async isEmailRegistered(email: string): Promise<boolean> {
    this._logger.verbose(
      `Fetching if entry exists with email: ${email} exists in table: ${tableName}.`
    );
    const data = await this._db
      .select()
      .from(UsersSchema.UserInfoTable)
      .where(eq(UsersSchema.UserInfoTable.email, email));

    return data.length > 0;
  }

  async update(model: UserInfoModel): Promise<void> {
    await this._db
      .update(UsersSchema.UserInfoTable)
      .set({ ...model })
      .where(eq(UsersSchema.UserInfoTable.id, model.id));
    this._logger.verbose(`Updated db entry with id: ${model.id} in table: ${tableName}.`);
  }
}
