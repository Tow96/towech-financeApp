// External Packages
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

// App packages
import { CurrentUser } from '../../../users/lib/current-user.decorator';
import { User } from '../../../users/core/user.entity';
import { CommandQueryResult } from '../../../_common/command-query-result';

// Slice common packages
import { CategoryType } from '../../common/Core/category-aggregate';

// Internal imports
import { GetUserCategoriesQuery } from './Queries/get-user-categories.query';
import { CategoryDto, DtoMapper } from './dto.mapper';
import { CreateCategoryCommand } from './Commands/create-category.command';
import { GetCategoryOwnerQuery } from './Queries/get-category-owner.query';
import { UpdateCategoryCommand } from './Commands/update-category.command';
import { ArchiveCategoryCommand } from './Commands/archive-category.command';
import { RestoreCategoryCommand } from './Commands/restore-category.command';

@Controller('category')
export class ManageCategoriesController {
  private readonly logger = new Logger(ManageCategoriesController.name);
  private readonly mapper = new DtoMapper();

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get()
  async getAllCategories(@CurrentUser() user: User): Promise<GetAllCategoriesResponse> {
    let result = await this.queryBus.execute(new GetUserCategoriesQuery(user.id));

    // If there are no income or expense categories, then basic "other" categories are created;
    let requery = false;
    if (result.message.filter(c => c.type === CategoryType.expense).length === 0) {
      await this.commandBus.execute(
        new CreateCategoryCommand(user.id, 0, 'Other expense', CategoryType.expense)
      );
      requery = true;
    }
    if (result.message.filter(c => c.type === CategoryType.income).length === 0) {
      await this.commandBus.execute(
        new CreateCategoryCommand(user.id, 1, 'Other income', CategoryType.income)
      );
      requery = true;
    }

    if (requery) result = await this.queryBus.execute(new GetUserCategoriesQuery(user.id));
    return { categories: result.message.map(c => this.mapper.categoryToDto(c)) };
  }

  @Post()
  async createCategory(
    @CurrentUser() user: User,
    @Body() body: CreateCategoryRequest
  ): Promise<CreateCategoryResponse> {
    // TODO: Validate inputs

    const command = new CreateCategoryCommand(user.id, body.iconId, body.name, body.type);
    const result = await this.commandBus.execute(command);

    if (result.status === CommandQueryResult.Conflict) throw new ConflictException(result.message);
    return { id: result.message };
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCategory(
    @CurrentUser() user: User,
    @Body() body: UpdateCategoryRequest,
    @Param('id') id: string
  ): Promise<void> {
    await this.validateCategoryOwnership(user.id, id);

    // TODO: Validate inputs

    const command = new UpdateCategoryCommand(id, body.iconId, body.name);
    const result = await this.commandBus.execute(command);

    switch (result.status) {
      case CommandQueryResult.Conflict:
        throw new ConflictException(result.message);
      case CommandQueryResult.NotFound:
        throw new NotFoundException('Category not found');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async archiveCategory(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
    await this.validateCategoryOwnership(user.id, id);

    const command = new ArchiveCategoryCommand(id);
    const result = await this.commandBus.execute(command);

    switch (result.status) {
      case CommandQueryResult.Conflict:
        throw new ConflictException(result.message);
      case CommandQueryResult.NotFound:
        throw new NotFoundException('Category not found');
    }
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restoreCategory(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
    await this.validateCategoryOwnership(user.id, id);

    const command = new RestoreCategoryCommand(id);
    const result = await this.commandBus.execute(command);

    switch (result.status) {
      case CommandQueryResult.Conflict:
        throw new ConflictException(result.message);
      case CommandQueryResult.NotFound:
        throw new NotFoundException('Category not found');
    }
  }

  private async validateCategoryOwnership(userId: string, categoryId: string): Promise<void> {
    const ownerQuery = await this.queryBus.execute(new GetCategoryOwnerQuery(categoryId));
    if (ownerQuery.status === CommandQueryResult.NotFound)
      throw new NotFoundException(ownerQuery.message);
    if (ownerQuery.message !== userId) throw new ForbiddenException();
  }
}

interface GetAllCategoriesResponse {
  categories: CategoryDto[];
}

interface CreateCategoryRequest {
  iconId: number;
  name: string;
  type: CategoryType;
}

interface CreateCategoryResponse {
  id: string;
}

interface UpdateCategoryRequest {
  iconId?: number;
  name?: string;
}
