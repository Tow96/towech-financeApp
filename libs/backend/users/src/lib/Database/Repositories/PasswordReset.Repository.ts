import { Inject, Injectable, Logger } from '@nestjs/common';
import { eq, getTableName } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { USER_SCHEMA_CONNECTION } from '../Users.Provider';
import { UsersSchema } from '../Users.Schema';

export type PasswordResetModel = typeof UsersSchema.PasswordResetTable.$inferSelect;
const tableName = getTableName(UsersSchema.PasswordResetTable);

@Injectable()
export class PasswordResetRepository {
  private readonly _logger = new Logger(PasswordResetRepository.name);
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>
  ) {}

  async delete(model: PasswordResetModel): Promise<void> {
    await this._db
      .delete(UsersSchema.PasswordResetTable)
      .where(eq(UsersSchema.PasswordResetTable, model.id));
    this._logger.verbose(`Deleted entry with id: ${model.id} in table: ${tableName}.`);
  }

  async getByUserId(userId: string): Promise<PasswordResetModel | undefined> {
    const [value] = await this._db
      .select()
      .from(UsersSchema.PasswordResetTable)
      .where(eq(UsersSchema.PasswordResetTable.userId, userId));
    this._logger.verbose(`Fetched entry with id: ${value.id} in table: ${tableName}.`);
    return value;
  }

  async insert(model: PasswordResetModel): Promise<void> {
    await this._db.insert(UsersSchema.PasswordResetTable).values({ ...model });

    this._logger.verbose(`Inserted entry with id: ${model.id} in table: ${tableName}`);
  }
}
