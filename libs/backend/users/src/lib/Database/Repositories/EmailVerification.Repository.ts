import { Inject, Injectable, Logger } from '@nestjs/common';
import { eq, getTableName } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { USER_SCHEMA_CONNECTION } from '../Users.Provider';
import { UsersSchema } from '../Users.Schema';

export type EmailVerificationModel = typeof UsersSchema.EmailVerificationTable.$inferSelect;
const tableName = `users.${getTableName(UsersSchema.EmailVerificationTable)}`;

@Injectable()
export class EmailVerificationRepository {
  private readonly _logger = new Logger(EmailVerificationRepository.name);
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>
  ) {}

  async delete(model: EmailVerificationModel): Promise<void> {
    await this._db
      .delete(UsersSchema.EmailVerificationTable)
      .where(eq(UsersSchema.EmailVerificationTable.id, model.id));
    this._logger.debug(`Deleted entry with id: ${model.id} in table: ${tableName}.`);
  }

  async getByUserId(userId: string): Promise<EmailVerificationModel | undefined> {
    this._logger.debug(`Fetching if entry exists with userId: ${userId} in table: ${tableName}.`);

    const [value] = await this._db
      .select()
      .from(UsersSchema.EmailVerificationTable)
      .where(eq(UsersSchema.EmailVerificationTable.userId, userId));
    return value;
  }

  async insert(model: EmailVerificationModel): Promise<void> {
    await this._db.insert(UsersSchema.EmailVerificationTable).values({ ...model });

    this._logger.debug(`Inserted entry with id: ${model.id} in table: ${tableName}`);
  }
}
