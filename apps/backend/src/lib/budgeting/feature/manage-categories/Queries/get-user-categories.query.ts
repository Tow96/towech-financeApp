// External packages
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

// App packages
import { CategoryAggregate, ICategoryRepository } from '../../../../_common/categories';
import { CommandQueryResult, Result } from '../../../../_common/primitives';

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
