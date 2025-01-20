import { Inject, Injectable, Logger } from '@nestjs/common';
import { eq, getTableName } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { USER_SCHEMA_CONNECTION } from '../Users.Provider';
import { UsersSchema } from '../Users.Schema';

export type SessionModel = typeof UsersSchema.SessionTable.$inferSelect;
const tableName = `users.${getTableName(UsersSchema.SessionTable)}`;

@Injectable()
export class SessionsRepository {
  private readonly _logger = new Logger(SessionsRepository.name);
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>
  ) {}

  async delete(model: SessionModel): Promise<void> {
    await this._db
      .delete(UsersSchema.SessionTable)
      .where(eq(UsersSchema.SessionTable.id, model.id));
    this._logger.verbose(`Deleted entry with id: ${model.id} in table: ${tableName}`);
  }

  async deleteAll(userId: string): Promise<void> {
    await this._db
      .delete(UsersSchema.SessionTable)
      .where(eq(UsersSchema.SessionTable.userId, userId));
    this._logger.verbose(`Deleted all entries with user id: ${userId} in table: ${tableName}`);
  }

  async getById(id: string): Promise<SessionModel | undefined> {
    this._logger.verbose(`Fetching if entry exists with id: ${id} in table ${tableName}`);
    const [value] = await this._db
      .select()
      .from(UsersSchema.SessionTable)
      .where(eq(UsersSchema.SessionTable.id, id));
    return value;
  }

  async insert(model: SessionModel): Promise<void> {
    await this._db.insert(UsersSchema.SessionTable).values({ ...model });

    this._logger.verbose(`Inserted entry with id: ${model.id} in table: ${tableName}`);
  }

  async update(model: SessionModel): Promise<void> {
    await this._db
      .update(UsersSchema.SessionTable)
      .set({ ...model })
      .where(eq(UsersSchema.SessionTable.id, model.id));
    this._logger.verbose(`Updated db entry with id: ${model.id} in table: ${tableName}`);
  }
}
