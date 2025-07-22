import {
  Body,
  Controller,
  Delete,
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

import { AddMovementDto, EditMovementDto, MovementDto, SummaryDto } from './dto';
import { MovementRepository } from './repository';
import { CategoryRepository } from '@/lib/categories';

@Controller('movement')
export class MovementController {
  private readonly logger: Logger = new Logger(MovementController.name);

  constructor(
    private readonly _movementRepository: MovementRepository,
    private readonly _categoryRepository: CategoryRepository
  ) {}

  @Get()
  async getMonthMovements(@CurrentUser() user: User): Promise<MovementDto[]> {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    this.logger.log(`user: ${user.id} requesting movements for ${year}-${month + 1}`);

    const query = await this._movementRepository.getByMonth(user.id, year, month);
    return query.map(i => ({
      id: i.id,
      date: i.date,
      categoryId: i.categoryId,
      description: i.description,
      summary: i.summary.map(s => ({
        originWalletId: s.originWalletId,
        destinationWalletId: s.destinationWalletId,
        amount: s.amount,
      })),
    }));
  }

  @Post()
  async addMovement(
    @CurrentUser() user: User,
    @Body() data: AddMovementDto
  ): Promise<{ id: string }> {
    data.description = data.description.trim().toLowerCase();

    this.logger.log(`user: ${user.id} trying to add movement to category: ${data.categoryId}`);

    // Category validation
    const existingCategory = await this._categoryRepository.getCategoryById(data.categoryId);
    if (existingCategory === null || existingCategory.userId !== user.id)
      throw new NotFoundException(`Category ${data.categoryId} not found`);
    if (data.subCategoryId !== null) {
      const existingSubcategory = await this._categoryRepository.getSubCategoryById(
        data.categoryId,
        data.subCategoryId
      );
      if (existingSubcategory === null)
        throw new NotFoundException(`SubCategory ${data.subCategoryId} not found`);
    }

    const id = await this._movementRepository.insert(
      user.id,
      data.categoryId,
      data.subCategoryId,
      data.description,
      new Date(data.date),
      data.summary
    );
    return { id };
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editMovement(
    @CurrentUser() user: User,
    @Body() data: EditMovementDto,
    @Param('id') id: string
  ): Promise<void> {
    data.description = data.description.trim().toLowerCase();

    const movement = await this._movementRepository.getById(id);
    if (movement === null || movement.userId !== user.id)
      throw new NotFoundException(`Movement ${id} not found`);

    this.logger.log(`user: ${user.id} trying to edit movement: ${id}`);
    const existingCategory = await this._categoryRepository.getCategoryById(data.categoryId);
    if (existingCategory === null || existingCategory.userId !== user.id)
      throw new NotFoundException(`Category ${data.categoryId} not found`);
    if (data.subCategoryId !== null) {
      const existingSubcategory = await this._categoryRepository.getSubCategoryById(
        data.categoryId,
        data.subCategoryId
      );
      if (existingSubcategory === null)
        throw new NotFoundException(`SubCategory ${data.subCategoryId} not found`);
    }

    await this._movementRepository.update(id, {
      categoryId: data.categoryId,
      subCategoryId: data.subCategoryId,
      date: data.date,
      description: data.description,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMovement(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
    const movement = await this._movementRepository.getById(id);
    if (movement === null || movement.userId !== user.id)
      throw new NotFoundException(`Movement ${id} not found`);

    this.logger.log(`user: ${user.id} trying to delete movement: ${id}`);
    await this._movementRepository.delete(id);
  }
}
