// External packages
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/primitives';
import { IMovementRepository } from '../../../common/movements/core';

export class GetMovementOwnerQuery extends Query<Result<string>> {
  constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(GetMovementOwnerQuery)
export class GetMovementOwnerHandler implements IQueryHandler<GetMovementOwnerQuery> {
  constructor(private readonly _movementRepo: IMovementRepository) {}

  async execute(query: GetMovementOwnerQuery): Promise<Result<string>> {
    const owner = await this._movementRepo.getMovementOwner(query.id);

    if (owner === null) return { status: CommandQueryResult.NotFound, message: 'Not found' };
    return { status: CommandQueryResult.Success, message: owner };
  }
}
