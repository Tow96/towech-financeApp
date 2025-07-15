import { Body, Controller, Get, Logger, Post } from '@nestjs/common';

import { CurrentUser, User } from '@/lib/users';
import { AddCategoryDto, CategoryDto, CategoryType } from '@/lib/categories/dto';

@Controller('category')
export class CategoryController {
  private readonly logger: Logger = new Logger(CategoryController.name);

  private MockCategories: CategoryDto[] = [
    {
      id: 'aiejfgoaief',
      name: 'cat 1',
      archived: false,
      type: CategoryType.income,
      iconId: 1,
      subCategories: [],
    },
    {
      id: 'sdjfgeiogjlkas',
      name: 'cat 2',
      archived: false,
      type: CategoryType.expense,
      iconId: 2,
      subCategories: [
        { id: 'ieiiao', iconId: 12, name: 'sub A' },
        { id: 'iedifs', iconId: 3, name: 'sub B' },
        { id: 'feafe', iconId: 1, name: 'sub c' },
        { id: 'gega', iconId: 5, name: 'sub d' },
      ],
    },
    {
      id: 'aetioaepoti',
      name: 'cat 3',
      archived: true,
      iconId: 4,
      type: CategoryType.transfer,
      subCategories: [],
    },
    {
      id: 'alkjeigjlakejgem',
      name: 'cat 4',
      archived: false,
      iconId: 8,
      type: CategoryType.transfer,
      subCategories: [],
    },
    {
      id: 'lakdkjfgoiae',
      name: 'cat 5',
      archived: true,
      type: CategoryType.expense,
      iconId: 9,
      subCategories: [
        { id: 'feage', iconId: 12, name: 'sub A' },
        { id: 'ageah', iconId: 3, name: 'sub B' },
        { id: 'aefe', iconId: 1, name: 'sub c' },
        { id: 'gaege', iconId: 5, name: 'sub d' },
      ],
    },
  ];

  @Get()
  getAllCategories(@CurrentUser() user: User): CategoryDto[] {
    this.logger.log(`user: ${user.id} requesting all categories`);

    return this.MockCategories;
  }

  @Post()
  addCategory(@CurrentUser() user: User, @Body() data: AddCategoryDto): { id: string } {
    this.logger.log(JSON.stringify(data));
    this.logger.log(`user: ${user.id} trying to add category: ${data.name} of type ${data.type}`);

    const id = new Date().getTime().toString();
    this.MockCategories.push({
      id,
      iconId: data.iconId,
      name: data.name,
      subCategories: [],
      type: data.type,
      archived: false,
    });

    return { id };
  }
}
