// External packages
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/command-query-result';

// Internal imports
import { ICategoryRepository } from '../../../common/Core/i-category-repository';

export class GetCategoryOwnerQuery extends Query<Result<string>> {
  constructor(public readonly categoryId: string) {
    super();
  }
}

@QueryHandler(GetCategoryOwnerQuery)
export class GetCategoryOwnerHandler implements IQueryHandler<GetCategoryOwnerQuery> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(query: GetCategoryOwnerQuery): Promise<Result<string>> {
    const owner = await this.categoryRepository.getCategoryOwner(query.categoryId);

    if (owner === null)
      return { status: CommandQueryResult.NotFound, message: 'Category not found' };
    return { status: CommandQueryResult.Success, message: owner };
  }
}
