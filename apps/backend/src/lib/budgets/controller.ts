import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser, User } from '@/lib/users';

import { AddBudgetDto, BudgetDto } from '@/lib/budgets/dto';
import { BudgetRepository } from '@/lib/budgets/repository';
import { CategoryType } from '@/lib/categories/dto';
import { MovementRepository } from '@/lib/movements/repository';
import { ReportDto } from '@/lib/movements/dto';

@Controller('budget')
export class BudgetController {
  private readonly logger: Logger = new Logger(BudgetController.name);

  constructor(
    private readonly _movementRepository: MovementRepository,
    private readonly _budgetRepository: BudgetRepository
  ) {}

  @Get('report')
  async getBudgetReport(
    @CurrentUser() user: User,
    @Query('year') year: string
  ): Promise<ReportDto[]> {
    const yearNum = parseInt(year) || new Date().getFullYear();

    this.logger.log(`user: ${user.id} requesting budget report for ${yearNum}`);
    return await this._movementRepository.getReport(user.id, yearNum);
  }

  @Get()
  async getAllBudgets(@CurrentUser() user: User): Promise<BudgetDto[]> {
    this.logger.log(`user: ${user.id} requesting budgets`);

    const query = await this._budgetRepository.getAll(user.id);

    return query.map(i => ({
      id: i.id,
      name: i.name,
      userId: i.userId,
      year: i.year,
      summary: i.summary.map(s => ({
        limit: s.limit,
        month: s.month,
        category: {
          type: <CategoryType>s.categoryType,
          id: s.categoryId,
          subId: s.categorySubId,
        },
      })),
    }));
  }

  @Post()
  async addBudget(@CurrentUser() user: User, @Body() data: AddBudgetDto): Promise<{ id: string }> {
    data.name = data.name.trim().toLowerCase();

    this.logger.log(`user: ${user.id} trying to add new budget for year ${data.year}`);
    const existingBudget = await this._budgetRepository.getIdByYear(user.id, data.year);
    if (existingBudget !== null)
      throw new ConflictException(`Budget for year ${data.year} already exists`);

    const id = await this._budgetRepository.insert(
      user.id,
      data.year,
      data.name,
      data.summary.map(s => ({
        id: '',
        budgetId: '',
        month: s.month,
        limit: s.limit,
        categoryType: s.category.type,
        categoryId: s.category.id,
        categorySubId: s.category.subId,
      }))
    );

    return { id };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBudget(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
    const budget = await this._budgetRepository.getById(id);
    if (budget === null || budget.userId !== user.id)
      throw new NotFoundException(`Budget ${id} not found`);

    this.logger.log(`user: ${user.id} trying to delete budget: ${budget.id}`);
    await this._budgetRepository.delete(budget.id);
  }
}
