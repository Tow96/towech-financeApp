// External packages
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/command-query-result';
import { IWalletRepository } from '../../../common/wallets';

export class GetWalletOwnerQuery extends Query<Result<string>> {
  constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(GetWalletOwnerQuery)
export class GetWalletOwnerHandler implements IQueryHandler<GetWalletOwnerQuery> {
  constructor(private readonly _walletRepo: IWalletRepository) {}

  async execute(query: GetWalletOwnerQuery): Promise<Result<string>> {
    const owner = await this._walletRepo.getWalletOwner(query.id);

    if (owner === null)
      return { status: CommandQueryResult.NotFound, message: 'wallet not found!' };
    return { status: CommandQueryResult.Success, message: owner };
  }
}
