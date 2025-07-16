// External packages
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import { EventEmitter2 } from '@nestjs/event-emitter';

// Slice packages
import {
  ICategoryRepository,
  CategoryArchivedEvent,
  CategoryCreatedEvent,
  CategoryRestoredEvent,
  CategoryUpdatedEvent,
  CategoryAggregate,
  SubCategoryCreatedEvent,
  SubCategoryRemovedEvent,
  SubCategoryUpdatedEvent,
} from '../core';

// Internal references
import { COMMON_SCHEMA_CONNECTION } from '../../common.provider';
import { CommonSchema } from '../../common.schemta';
import { CategoryMapper } from './mappers/category.mapper';
import { SubCategoryModel } from './models';

@Injectable()
export class PostgresCategoryRepository implements ICategoryRepository {
  private readonly _logger = new Logger(PostgresCategoryRepository.name);
  private readonly _categoryMapper = new CategoryMapper();

  constructor(
    @Inject(COMMON_SCHEMA_CONNECTION)
    private readonly _db: NodePgDatabase<typeof CommonSchema>,
    private readonly _eventEmitter: EventEmitter2
  ) {}

  async categoryExists(userId: string, name: string): Promise<boolean> {
    const exists = await this._db
      .select()
      .from(CommonSchema.categoriesTable)
      .where(
        and(
          eq(CommonSchema.categoriesTable.userId, userId),
          eq(CommonSchema.categoriesTable.name, name.trim().toLowerCase())
        )
      );

    return exists.length > 0;
  }

  async getAll(userId: string): Promise<CategoryAggregate[]> {
    this._logger.debug(`Fetching all categories for ${userId} from db`);

    const records = await this._db.query.categoriesTable.findMany({
      with: { subCategories: true },
      where: eq(CommonSchema.categoriesTable.userId, userId),
    });

    return records.map(record => this._categoryMapper.toDomain(record));
  }

  async getById(id: string): Promise<CategoryAggregate | null> {
    this._logger.debug(`Looking in db for category with id ${id}`);

    const records = await this._db.query.categoriesTable.findMany({
      with: { subCategories: true },
      where: eq(CommonSchema.categoriesTable.id, id),
    });

    if (records.length === 0) return null;

    return this._categoryMapper.toDomain(records[0]);
  }

  async getCategoryOwner(id: string): Promise<string | null> {
    const result = await this._db
      .select({ userId: CommonSchema.categoriesTable.userId })
      .from(CommonSchema.categoriesTable)
      .where(eq(CommonSchema.categoriesTable.id, id));

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
            await tx.insert(CommonSchema.categoriesTable).values(model);
            break;
          case CategoryUpdatedEvent:
          case CategoryArchivedEvent:
          case CategoryRestoredEvent:
            await tx
              .update(CommonSchema.categoriesTable)
              .set(model)
              .where(eq(CommonSchema.categoriesTable.id, model.id));
            break;
          case SubCategoryCreatedEvent:
            castedEvent = event as SubCategoryCreatedEvent;
            subCategory = model.subCategories.find(s => s.id === castedEvent.categoryId);
            if (!subCategory) break;
            await tx.insert(CommonSchema.subCategoriesTable).values({ ...subCategory });
            break;
          case SubCategoryUpdatedEvent:
            castedEvent = event as SubCategoryUpdatedEvent;
            subCategory = model.subCategories.find(s => s.id === castedEvent.categoryId);
            if (!subCategory) break;
            await tx
              .update(CommonSchema.subCategoriesTable)
              .set(subCategory)
              .where(eq(CommonSchema.subCategoriesTable.id, subCategory.id));
            break;
          case SubCategoryRemovedEvent:
            castedEvent = event as SubCategoryRemovedEvent;
            await tx
              .delete(CommonSchema.subCategoriesTable)
              .where(eq(CommonSchema.subCategoriesTable.id, castedEvent.categoryId));
            break;
        }
      }
    });
    await category.publishEvents(this._logger, this._eventEmitter);
  }
}
