import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { CurrentUser, User } from '@/lib/users';
import { AddCategoryDto, CategoryDto, CategoryType, EditCategoryDto } from '@/lib/categories/dto';
import { MAIN_SCHEMA_CONNECTION, mainSchema } from '@/lib/database';

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
    data.name = data.name.trim().toLowerCase();

    this.logger.log(`user: ${user.id} trying to add category: ${data.name} of type ${data.type}`);
    const exists = await this._db
      .select({ id: mainSchema.Categories.id })
      .from(mainSchema.Categories)
      .where(
        and(
          eq(mainSchema.Categories.userId, user.id),
          eq(mainSchema.Categories.type, data.type.toString()),
          eq(mainSchema.Categories.name, data.name)
        )
      );

    if (exists.length > 0)
      throw new ConflictException({
        errors: { name: `Category ${data.name} already exists for type ${data.type}` },
      });

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

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editCategory(
    @CurrentUser() user: User,
    @Body() data: EditCategoryDto,
    @Param('id') id: string
  ): Promise<void> {
    data.name = data.name.trim().toLowerCase();

    const category = await this._db
      .select()
      .from(mainSchema.Categories)
      .where(eq(mainSchema.Categories.id, id));

    if (category.length === 0 || category[0].userId !== user.id)
      throw new NotFoundException(`category ${id} not found`);

    this.logger.log(`user: ${user.id} trying to update category: ${id}`);
    const nameExists = await this._db
      .select({ id: mainSchema.Categories.id })
      .from(mainSchema.Categories)
      .where(
        and(
          eq(mainSchema.Categories.userId, user.id),
          eq(mainSchema.Categories.type, category[0].type.toString()),
          eq(mainSchema.Categories.name, data.name)
        )
      );

    if (nameExists.length > 0)
      throw new ConflictException({
        errors: {
          name: `Category "${data.name}" already exists for type ${category[0].type.toString()}`,
        },
      });

    await this._db
      .update(mainSchema.Categories)
      .set({
        name: data.name,
        iconId: data.iconId,
      })
      .where(eq(mainSchema.Categories.id, id));
  }

  @Put(':id/archive')
  @HttpCode(HttpStatus.NO_CONTENT)
  async archiveCategory(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
    const category = await this._db
      .select()
      .from(mainSchema.Categories)
      .where(eq(mainSchema.Categories.id, id));

    if (category.length === 0 || category[0].userId !== user.id)
      throw new NotFoundException(`category ${id} not found`);

    await this._db
      .update(mainSchema.Categories)
      .set({ deletedAt: new Date() })
      .where(eq(mainSchema.Categories.id, id));
  }
}
