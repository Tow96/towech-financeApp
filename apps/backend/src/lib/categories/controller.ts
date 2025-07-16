import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

import { CurrentUser, User } from '@/lib/users';
import { AddCategoryDto, CategoryDto, CategoryType } from '@/lib/categories/dto';
import { MAIN_SCHEMA_CONNECTION, mainSchema } from '@/lib/database';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

@Controller('category')
export class CategoryController {
  private readonly logger: Logger = new Logger(CategoryController.name);

  constructor(
    @Inject(MAIN_SCHEMA_CONNECTION)
    private readonly _db: NodePgDatabase<typeof mainSchema>
  ) {}

  @Get()
  async getAllCategories(@CurrentUser() user: User): Promise<CategoryDto[]> {
    this.logger.log(`user: ${user.id} requesting all categories`);

    const query = await this._db.query.Categories.findMany({
      with: { subCategories: true },
      where: eq(mainSchema.Categories.userId, user.id),
    });

    return query.map(i => ({
      id: i.id,
      iconId: i.iconId,
      name: i.name,
      subCategories: i.subCategories.map(s => ({ id: s.id, iconId: s.iconId, name: s.name })),
      type: <CategoryType>i.type,
      archived: i.deletedAt !== null,
    }));
  }

  @Post()
  async addCategory(
    @CurrentUser() user: User,
    @Body() data: AddCategoryDto
  ): Promise<{ id: string }> {
    this.logger.log(`user: ${user.id} trying to add category: ${data.name} of type ${data.type}`);

    const id = uuidV4();
    await this._db.insert(mainSchema.Categories).values({
      id,
      userId: user.id,
      iconId: data.iconId,
      name: data.name,
      type: data.type,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { id };
  }
}
