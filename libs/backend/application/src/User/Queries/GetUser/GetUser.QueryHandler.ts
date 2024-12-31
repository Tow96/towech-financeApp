import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetUserQuery } from './GetUser.Query';
import { GetUserQueryResponse } from './GetUser.QueryResponse';
import { IUserRepository } from '@financeApp/backend-domain';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery, GetUserQueryResponse> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(query: GetUserQuery): Promise<GetUserQueryResponse> {
    const user = await this.repository.findById(query.id);
    // TODO: create exceptions
    if (!user) throw new Error('User not found!');

    return {
      name: user.Name,
      email: user.Email,
      role: user.Role,
      id: user.Id,
      accountConfirmed: user.AccountConfirmed,
    };
  }
}
