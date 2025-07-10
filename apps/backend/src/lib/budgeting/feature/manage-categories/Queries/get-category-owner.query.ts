// External packages
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

// App packages
import { ICategoryRepository } from '../../../../_common/categories';
import { CommandQueryResult, Result } from '../../../../_common/primitives';

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
