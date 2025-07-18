import { v4 as uuidV4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { MAIN_SCHEMA_CONNECTION, mainSchema } from '@/lib/database';
import { CategoryType } from './dto';
import { CategoryEntity, SubCategoryEntity } from './entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @Inject(MAIN_SCHEMA_CONNECTION)
    private readonly _db: NodePgDatabase<typeof mainSchema>
  ) {}

  getAllUserCategories(userId: string): Promise<any[]> {
    return this._db.query.Categories.findMany({
      with: { subCategories: true },
      where: eq(mainSchema.Categories.userId, userId),
    });
  }

  async getCategoryById(id: string): Promise<CategoryEntity | null> {
    const query: CategoryEntity[] = await this._db
      .select()
      .from(mainSchema.Categories)
      .where(eq(mainSchema.Categories.id, id));

    return query.length > 0 ? query[0] : null;
  }

  async getCategoryIdByName(userId: string, type: string, name: string): Promise<string | null> {
    const query = await this._db
      .select({ id: mainSchema.Categories.id })
      .from(mainSchema.Categories)
      .where(
        and(
          eq(mainSchema.Categories.userId, userId),
          eq(mainSchema.Categories.type, type),
          eq(mainSchema.Categories.name, name)
        )
      );

    return query.length !== 0 ? query[0].id : null;
  }

  async insertCategory(
    userId: string,
    iconId: number,
    type: CategoryType,
    name: string
  ): Promise<string> {
    const id = uuidV4();
    await this._db.insert(mainSchema.Categories).values({
      id,
      userId,
      iconId,
      name,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return id;
  }

  async updateCategory(id: string, data: Partial<CategoryEntity>): Promise<void> {
    await this._db
      .update(mainSchema.Categories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(mainSchema.Categories.id, id));
  }

  async getSubCategoryById(parentId: string, id: string): Promise<SubCategoryEntity | null> {
    const query = await this._db
      .select()
      .from(mainSchema.SubCategories)
      .where(
        and(eq(mainSchema.SubCategories.parentId, parentId), eq(mainSchema.SubCategories.id, id))
      );

    return query.length > 0 ? query[0] : null;
  }

  async insertSubCategory(parentId: string, iconId: number, name: string): Promise<string> {
    const id = uuidV4();
    await this._db.insert(mainSchema.SubCategories).values({
      id,
      parentId,
      iconId,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return id;
  }

  async getSubCategoryIdByName(parentId: string, name: string): Promise<string | null> {
    const query = await this._db
      .select({ id: mainSchema.SubCategories.id })
      .from(mainSchema.SubCategories)
      .where(
        and(
          eq(mainSchema.SubCategories.parentId, parentId),
          eq(mainSchema.SubCategories.name, name)
        )
      );

    return query.length > 0 ? query[0].id : null;
  }

  async updateSubCategory(id: string, data: Partial<SubCategoryEntity>): Promise<void> {
    await this._db
      .update(mainSchema.SubCategories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(mainSchema.SubCategories.id, id));
  }
}
