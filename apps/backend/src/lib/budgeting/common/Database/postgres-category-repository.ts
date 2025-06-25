// External packages
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import { EventEmitter2 } from '@nestjs/event-emitter';

// App packages

// Slice packages
import { ICategoryRepository } from '../Core/i-category-repository';
import {
  CategoryArchivedEvent,
  CategoryCreatedEvent,
  CategoryRestoredEvent,
  CategoryUpdatedEvent,
} from '../Core/category-events';

// Internal references
import { BUDGETING_SCHEMA_CONNECTION } from './budgeting.provider';
import { BudgetingSchema } from './budgeting.schema';
import { CategoryMapper } from './mappers/category.mapper';
import { CategoryAggregate } from '../Core/category-aggregate';
import {
  SubCategoryCreatedEvent,
  SubCategoryRemovedEvent,
  SubCategoryUpdatedEvent,
} from '../Core/subcategory-events';
import { SubCategoryModel } from './models';

@Injectable()
export class PostgresCategoryRepository implements ICategoryRepository {
  private readonly _logger = new Logger(PostgresCategoryRepository.name);
  private readonly _categoryMapper = new CategoryMapper();

  constructor(
    @Inject(BUDGETING_SCHEMA_CONNECTION)
    private readonly _db: NodePgDatabase<typeof BudgetingSchema>,
    private readonly _eventEmitter: EventEmitter2
  ) {}

  async categoryExists(userId: string, name: string): Promise<boolean> {
    const exists = await this._db
      .select()
      .from(BudgetingSchema.categoriesTable)
      .where(
        and(
          eq(BudgetingSchema.categoriesTable.userId, userId),
          eq(BudgetingSchema.categoriesTable.name, name.trim().toLowerCase())
        )
      );

    return exists.length > 0;
  }

  async getAll(userId: string): Promise<CategoryAggregate[]> {
    this._logger.debug(`Fetching all categories for ${userId} from db`);

    const records = await this._db.query.categoriesTable.findMany({
      with: { subCategories: true },
      where: eq(BudgetingSchema.categoriesTable.userId, userId),
    });

    return records.map(record => this._categoryMapper.toDomain(record));
  }

  async getById(id: string): Promise<CategoryAggregate | null> {
    this._logger.debug(`Looking in db for category with id ${id}`);

    const records = await this._db.query.categoriesTable.findMany({
      with: { subCategories: true },
      where: eq(BudgetingSchema.categoriesTable.id, id),
    });

    if (records.length === 0) return null;

    return this._categoryMapper.toDomain(records[0]);
  }

  async getCategoryOwner(id: string): Promise<string | null> {
    const result = await this._db
      .select({ userId: BudgetingSchema.categoriesTable.userId })
      .from(BudgetingSchema.categoriesTable)
      .where(eq(BudgetingSchema.categoriesTable.id, id));

    if (result.length === 0) return null;
    return result[0].userId;
  }

  async saveChanges(category: CategoryAggregate) {
    // Db operations
    await this._db.transaction(async tx => {
      const model = this._categoryMapper.toPersistence(category);

      for (let i = 0; i < category.domainEvents.length; i++) {
        const event = category.domainEvents[i];

        let castedEvent:
          | SubCategoryCreatedEvent
          | SubCategoryUpdatedEvent
          | SubCategoryRemovedEvent;
        let subCategory: SubCategoryModel | undefined;

        switch (event.constructor) {
          case CategoryCreatedEvent:
            await tx.insert(BudgetingSchema.categoriesTable).values(model);
            break;
          case CategoryUpdatedEvent:
            await tx
              .update(BudgetingSchema.categoriesTable)
              .set(model)
              .where(eq(BudgetingSchema.categoriesTable.id, model.id));
            break;
          case CategoryArchivedEvent:
            await tx
              .update(BudgetingSchema.categoriesTable)
              .set(model)
              .where(eq(BudgetingSchema.categoriesTable.id, model.id));
            break;
          case CategoryRestoredEvent:
            await tx
              .update(BudgetingSchema.categoriesTable)
              .set(model)
              .where(eq(BudgetingSchema.categoriesTable.id, model.id));
            break;
          case SubCategoryCreatedEvent:
            castedEvent = event as SubCategoryCreatedEvent;
            subCategory = model.subCategories.find(s => s.id === castedEvent.categoryId);
            if (!subCategory) break;
            await tx.insert(BudgetingSchema.subCategoriesTable).values({ ...subCategory });
            break;
          case SubCategoryUpdatedEvent:
            castedEvent = event as SubCategoryUpdatedEvent;
            subCategory = model.subCategories.find(s => s.id === castedEvent.categoryId);
            if (!subCategory) break;
            await tx
              .update(BudgetingSchema.subCategoriesTable)
              .set(subCategory)
              .where(eq(BudgetingSchema.subCategoriesTable.id, subCategory.id));
            break;
          case SubCategoryRemovedEvent:
            castedEvent = event as SubCategoryRemovedEvent;
            await tx
              .delete(BudgetingSchema.subCategoriesTable)
              .where(eq(BudgetingSchema.subCategoriesTable.id, castedEvent.categoryId));
            break;
        }
      }
    });

    console.log('afafefafe');
    await category.publishEvents(this._logger, this._eventEmitter);
  }
}
