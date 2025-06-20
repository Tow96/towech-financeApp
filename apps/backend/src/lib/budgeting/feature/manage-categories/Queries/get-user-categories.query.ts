// External packages
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/command-query-result';

// Internal imports
import { ICategoryRepository } from '../../../common/Core/i-category-repository';
import { CategoryAggregate } from '../../../common/Core/category-aggregate';

export class GetUserCategoriesQuery extends Query<Result<CategoryAggregate[]>> {
  constructor(public readonly userId: string) {
    super();
  }
}

@QueryHandler(GetUserCategoriesQuery)
export class GetUserCategoriesHandler implements IQueryHandler<GetUserCategoriesQuery> {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(query: GetUserCategoriesQuery): Promise<Result<CategoryAggregate[]>> {
    const categories = await this.categoryRepo.getAll(query.userId);

    return { status: CommandQueryResult.Success, message: categories };
  }
}
