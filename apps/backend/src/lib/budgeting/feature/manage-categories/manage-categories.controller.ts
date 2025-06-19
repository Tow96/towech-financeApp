// External Packages
import { Body, ConflictException, Controller, Get, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

// App packages
import { CurrentUser } from '../../../users/lib/current-user.decorator';
import { User } from '../../../users/core/user.entity';

// Slice common packages
// Internal imports
import { CategoryDto } from './dto';
import { CategoryType } from '../../common/Core/category-aggregate';
import { CommandResult, CreateCategoryCommand } from './Commands/create-category.command';

@Controller('category')
export class ManageCategoriesController {
  private readonly logger = new Logger(ManageCategoriesController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Get()
  getAllCategories(@CurrentUser() user: User): GetAllCategoriesResponseDto {
    this.logger.log(`Getting categories for user ${user.id}`);

    return {
      Income: [],
      Expense: [
        {
          id: '1',
          iconUrl: 'https://avatar.iran.liara.run/public',
          name: 'Category 1',
          archived: false,
          subcategories: [],
        },
        {
          id: '2',
          iconUrl: 'https://avatar.iran.liara.run/public',
          name: 'Category 2',
          archived: false,
          subcategories: [
            {
              id: '10',
              iconUrl: 'https://avatar.iran.liara.run/public',
              name: 'Subcategory 1',
              archived: false,
            },
            {
              id: '11',
              iconUrl: 'https://avatar.iran.liara.run/public',
              name: 'Subcategory 1',
              archived: false,
            },
            {
              id: '12',
              iconUrl: 'https://avatar.iran.liara.run/public',
              name: 'Subcategory 1',
              archived: false,
            },
          ],
        },
        {
          id: '3',
          iconUrl: 'https://avatar.iran.liara.run/public',
          name: 'Category 3',
          archived: false,
          subcategories: [
            {
              id: '30',
              iconUrl: 'https://avatar.iran.liara.run/public',
              name: 'Subcategory 21',
              archived: true,
            },
          ],
        },
        {
          id: '4',
          iconUrl: 'https://avatar.iran.liara.run/public',
          name: 'Category 4',
          subcategories: [],
          archived: true,
        },
        {
          id: '5',
          iconUrl: 'https://avatar.iran.liara.run/public',
          name: 'Category 5',
          subcategories: [],
          archived: true,
        },
        {
          id: '6',
          iconUrl: 'https://avatar.iran.liara.run/public',
          name: 'Category 6',
          archived: false,
          subcategories: [
            {
              id: '40',
              iconUrl: 'https://avatar.iran.liara.run/public',
              name: 'Subcategory 210',
              archived: false,
            },
          ],
        },
      ],
    };
  }

  @Post()
  async createCategory(
    @CurrentUser() user: User,
    @Body() body: CreateCategoryRequestDto
  ): Promise<{ id: string }> {
    // TODO: Validate inputs

    const result = await this.commandBus.execute(
      new CreateCategoryCommand(user.id, 2, body.name, body.type)
    );

    if (result.status === CommandResult.Conflict) throw new ConflictException(result.message);

    return { id: result.message };
  }
}

interface GetAllCategoriesResponseDto {
  Income: CategoryDto[];
  Expense: CategoryDto[];
}

interface CreateCategoryRequestDto {
  name: string;
  type: CategoryType;
}
