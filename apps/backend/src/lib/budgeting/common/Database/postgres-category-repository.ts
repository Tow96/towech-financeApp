// External packages
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

// App packages

// Slice packages
import { ICategoryRepository } from '../Core/i-category-repository';

// Internal references
import { BUDGETING_SCHEMA_CONNECTION } from './budgeting.provider';
import { BudgetingSchema } from './budgeting.schema';
import { CategoryMapper } from './mappers/category.mapper';
import { CategoryEntity } from '../Core/Category.entity';
import { eq } from 'drizzle-orm';

@Injectable()
export class PostgresCategoryRepository implements ICategoryRepository {
  private readonly _logger = new Logger(PostgresCategoryRepository.name);
  private readonly _categoryMapper = new CategoryMapper();

  constructor(
    @Inject(BUDGETING_SCHEMA_CONNECTION)
    private readonly _db: NodePgDatabase<typeof BudgetingSchema>
  ) {}

  async getAll(userId: string): Promise<CategoryEntity[]> {
    this._logger.debug(`Fetching all categories for ${userId} from db`);
    const records = await this._db
      .select()
      .from(BudgetingSchema.categoriesTable)
      .where(eq(BudgetingSchema.categoriesTable.userId, userId));

    return records.map(record => this._categoryMapper.toEntity(record));
  }

  async getById(id: string): Promise<CategoryEntity | null> {
    this._logger.debug(`Looking in db for category with id ${id}`);
    const records = await this._db
      .select()
      .from(BudgetingSchema.categoriesTable)
      .where(eq(BudgetingSchema.categoriesTable.id, id));

    if (records.length === 0) return null;
    return this._categoryMapper.toEntity(records[0]);
  }

  async insertEntity(entity: CategoryEntity): Promise<string> {
    this._logger.debug(`Inserting entry in category table with id ${entity.id}`);

    const record = this._categoryMapper.toPersistence(entity);
    await this._db.insert(BudgetingSchema.categoriesTable).values(record);

    return record.id;
  }

  async updateEntity(entity: CategoryEntity): Promise<void> {
    this._logger.debug(`Updating entry in category table with id ${entity.id}`);

    const record = this._categoryMapper.toPersistence(entity);
    await this._db
      .update(BudgetingSchema.categoriesTable)
      .set(record)
      .where(eq(BudgetingSchema.categoriesTable.userId, entity.id));
  }

  async deleteEntity(id: string): Promise<void> {
    this._logger.debug(`Deleting entry in category table with id ${id}`);

    await this._db
      .delete(BudgetingSchema.categoriesTable)
      .where(eq(BudgetingSchema.categoriesTable.id, id));
  }
}
