import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUser, User } from '@/lib/users';

import {
  AddCategoryDto,
  AddSubCategoryDto,
  CategoryDto,
  CategoryType,
  EditCategoryDto,
  EditSubCategoryDto,
} from './dto';
import { CategoryRepository } from './repository';

@Controller('category')
export class CategoryController {
  private readonly logger: Logger = new Logger(CategoryController.name);

  constructor(private readonly _categoryRepository: CategoryRepository) {}

  @Get()
  async getAllCategories(@CurrentUser() user: User): Promise<CategoryDto[]> {
    this.logger.log(`user: ${user.id} requesting all categories`);

    const query = await this._categoryRepository.getAllUserCategories(user.id);
    return query.map(i => ({
      id: i.id,
      iconId: i.iconId,
      name: i.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      subCategories: i.subCategories.map(s => ({
        id: s.id,
        iconId: s.iconId,
        name: s.name,
        archived: !!s.archivedAt,
      })),
      type: <CategoryType>i.type,
      archived: !!i.archivedAt,
    }));
  }

  @Post()
  async addCategory(
    @CurrentUser() user: User,
    @Body() data: AddCategoryDto
  ): Promise<{ id: string }> {
    this.logger.log(`user: ${user.id} trying to add category: ${data.name} of type ${data.type}`);

    const existingCategory = await this._categoryRepository.getCategoryIdByName(
      user.id,
      data.type,
      data.name
    );
    if (existingCategory !== null)
      throw new ConflictException(`Category ${data.name} already exists for type ${data.type}`);

    const id = await this._categoryRepository.insertCategory(
      user.id,
      data.iconId,
      data.type,
      data.name
    );
    return { id };
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editCategory(
    @CurrentUser() user: User,
    @Body() data: EditCategoryDto,
    @Param('id') id: string
  ): Promise<void> {
    const category = await this._categoryRepository.getCategoryById(id);
    if (category === null || category.userId !== user.id)
      throw new NotFoundException(`Category ${id} not found`);

    this.logger.log(`user: ${user.id} trying to update category: ${id}`);
    const existingCategory = await this._categoryRepository.getCategoryIdByName(
      user.id,
      category.type,
      data.name
    );
    if (existingCategory !== null && existingCategory !== category.id)
      throw new ConflictException(
        `Category "${data.name}" already exists for type ${category.type.toString()}`
      );

    await this._categoryRepository.updateCategory(id, { name: data.name, iconId: data.iconId });
  }

  @Put(':id/archive')
  @HttpCode(HttpStatus.NO_CONTENT)
  async archiveCategory(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
    const category = await this._categoryRepository.getCategoryById(id);
    if (category === null || category.userId !== user.id)
      throw new NotFoundException(`category ${id} not found`);

    this.logger.log(`user: ${user.id} trying to archive category: ${id}`);
    await this._categoryRepository.updateCategory(id, { archivedAt: new Date() });
  }

  @Put(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restoreCategory(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
    const category = await this._categoryRepository.getCategoryById(id);
    if (category === null || category.userId !== user.id)
      throw new NotFoundException(`category ${id} not found`);

    this.logger.log(`user: ${user.id} trying to restore category: ${id}`);
    await this._categoryRepository.updateCategory(id, { archivedAt: null });
  }

  @Post(':parentId/subcategory')
  async addSubCategory(
    @CurrentUser() user: User,
    @Body() data: AddSubCategoryDto,
    @Param('parentId') parentId: string
  ): Promise<{ id: string }> {
    data.name = data.name.trim().toLowerCase();

    const category = await this._categoryRepository.getCategoryById(parentId);
    if (category === null || category.userId !== user.id)
      throw new NotFoundException(`category ${parentId} not found`);

    this.logger.log(
      `user: ${user.id} trying to add subcategory ${data.name} to category ${parentId}`
    );
    const existingSubCategory = await this._categoryRepository.getSubCategoryIdByName(
      parentId,
      data.name
    );
    if (existingSubCategory !== null)
      throw new ConflictException(`Subcategory ${data.name} already exists for category.`);

    const id = await this._categoryRepository.insertSubCategory(parentId, data.iconId, data.name);
    return { id };
  }

  @Put(':parentId/subcategory/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editSubCategory(
    @CurrentUser() user: User,
    @Body() data: EditSubCategoryDto,
    @Param('parentId') parentId: string,
    @Param('id') id: string
  ): Promise<void> {
    data.name = data.name.trim().toLowerCase();

    const category = await this._categoryRepository.getCategoryById(parentId);
    if (category === null || category.userId !== user.id)
      throw new NotFoundException(`category ${parentId} not found`);

    const subCategory = await this._categoryRepository.getSubCategoryById(parentId, id);
    if (subCategory === null) throw new NotFoundException(`subcategory ${parentId} not found`);

    this.logger.log(`user: ${user.id} trying to update subCategory: ${id}`);
    const existingSubCategory = await this._categoryRepository.getSubCategoryIdByName(
      parentId,
      data.name
    );
    if (existingSubCategory !== null && existingSubCategory !== subCategory.id)
      throw new ConflictException(`Subcategory ${data.name} already exists for category.`);

    await this._categoryRepository.updateSubCategory(id, { name: data.name, iconId: data.iconId });
  }

  @Put(':parentId/subcategory/:id/archive')
  @HttpCode(HttpStatus.NO_CONTENT)
  async archiveSubCategory(
    @CurrentUser() user: User,
    @Param('parentId') parentId: string,
    @Param('id') id: string
  ): Promise<void> {
    const category = await this._categoryRepository.getCategoryById(parentId);
    if (category === null || category.userId !== user.id)
      throw new NotFoundException(`category ${parentId} not found`);

    const subCategory = await this._categoryRepository.getSubCategoryById(parentId, id);
    if (subCategory === null) throw new NotFoundException(`subcategory ${parentId} not found`);

    this.logger.log(`user: ${user.id} trying to archive subcategory: ${id}`);
    await this._categoryRepository.updateSubCategory(id, { archivedAt: new Date() });
  }

  @Put(':parentId/subcategory/:id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restoreSubCategory(
    @CurrentUser() user: User,
    @Param('parentId') parentId: string,
    @Param('id') id: string
  ): Promise<void> {
    const category = await this._categoryRepository.getCategoryById(parentId);
    if (category === null || category.userId !== user.id)
      throw new NotFoundException(`category ${parentId} not found`);

    const subCategory = await this._categoryRepository.getSubCategoryById(parentId, id);
    if (subCategory === null) throw new NotFoundException(`subcategory ${parentId} not found`);

    this.logger.log(`user: ${user.id} trying to restore subcategory: ${id}`);
    await this._categoryRepository.updateSubCategory(id, { archivedAt: null });
  }
}
