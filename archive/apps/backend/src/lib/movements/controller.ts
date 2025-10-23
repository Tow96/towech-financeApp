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
  Query,
} from '@nestjs/common';
import { CurrentUser, User } from '@/lib/users';

import { AddMovementDto, EditMovementDto, MovementDto } from './dto';
import { MovementRepository } from './repository';
import { CategoryRepository } from '@/lib/categories';
import { CategoryType } from '@/lib/categories/dto';

@Controller('movement')
export class MovementController {
  private readonly logger: Logger = new Logger(MovementController.name);

  constructor(
    private readonly _movementRepository: MovementRepository,
    private readonly _categoryRepository: CategoryRepository
  ) {}

  @Get()
  async getMonthMovements(
    @CurrentUser() user: User,
    @Query('year') year: string,
    @Query('month') month: string
  ): Promise<MovementDto[]> {
    const yearNum = parseInt(year) || new Date().getFullYear();
    const monthNum = parseInt(month) || new Date().getMonth() + 1;

    this.logger.log(`user: ${user.id} requesting movements for ${yearNum}-${monthNum}`);

    const query = await this._movementRepository.getByMonth(user.id, yearNum, monthNum);
    return query.map(i => ({
      id: i.id,
      date: i.date,
      description: i.description,
      category: {
        type: <CategoryType>i.categoryType,
        id: i.categoryId,
        subId: i.categorySubId,
      },
      summary: i.summary.map(s => ({
        amount: s.amount,
        wallet: {
          originId: s.originWalletId,
          destinationId: s.destinationWalletId,
        },
      })),
    }));
  }

  @Post()
  async addMovement(
    @CurrentUser() user: User,
    @Body() data: AddMovementDto
  ): Promise<{ id: string }> {
    this.logger.log(
      `user: ${user.id} trying to add movement to category: ${data.category.type}-${data.category.id || 'null'}-${data.category.subId || 'null'}`
    );

    // Category validation
    if (data.category.id !== null) {
      const existingCategory = await this._categoryRepository.getCategoryById(data.category.id);
      if (existingCategory === null || existingCategory.userId !== user.id)
        throw new NotFoundException(`Category ${data.category.id} not found`);
      if (data.category.subId !== null) {
        const existingSubcategory = await this._categoryRepository.getSubCategoryById(
          data.category.id,
          data.category.subId
        );
        if (existingSubcategory === null)
          throw new NotFoundException(`SubCategory ${data.category.subId} not found`);
      }
    }

    this.logger.debug(`Received time: ${data.date}`);
    const id = await this._movementRepository.insert(
      user.id,
      data.category.type,
      data.category.id,
      data.category.subId,
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
    const movement = await this._movementRepository.getById(id);
    if (movement === null || movement.userId !== user.id)
      throw new NotFoundException(`Movement ${id} not found`);

    this.logger.log(`user: ${user.id} trying to update category: ${id}`);
    // Category validation
    if (data.category.id !== null) {
      const existingCategory = await this._categoryRepository.getCategoryById(data.category.id);
      if (existingCategory === null || existingCategory.userId !== user.id)
        throw new NotFoundException(`Category ${data.category.id} not found`);
      if (data.category.subId !== null) {
        const existingSubcategory = await this._categoryRepository.getSubCategoryById(
          data.category.id,
          data.category.subId
        );
        if (existingSubcategory === null)
          throw new NotFoundException(`SubCategory ${data.category.subId} not found`);
      }
    }

    this.logger.debug(`received date ${data.date}`);
    await this._movementRepository.update(id, {
      categoryType: data.category.type,
      categoryId: data.category.id,
      categorySubId: data.category.subId,
      date: new Date(data.date),
      description: data.description,
      summary: data.summary.map(s => ({
        id: '',
        amount: s.amount,
        originWalletId: s.wallet.originId,
        destinationWalletId: s.wallet.destinationId,
        movementId: '',
      })),
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
