// External packages
import { Logger } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/primitives';

// Internal imports
import { IWalletRepository } from '../../../common/wallets';

export class RestoreWalletCommand extends Command<Result<string>> {
  constructor(public readonly id: string) {
    super();
  }
}

@CommandHandler(RestoreWalletCommand)
export class RestoreWalletHandler implements ICommandHandler<RestoreWalletCommand> {
  private readonly _logger = new Logger(`Distribution.${RestoreWalletHandler.name}`);

  constructor(private readonly _walletRepo: IWalletRepository) {}

  async execute(command: RestoreWalletCommand): Promise<Result<string>> {
    const wallet = await this._walletRepo.getById(command.id);
    if (wallet === null)
      return { status: CommandQueryResult.NotFound, message: 'Wallet not found!' };

    if (wallet.deletedAt === null)
      return { status: CommandQueryResult.Conflict, message: 'Wallet is not archived.' };

    this._logger.log(`Restoring wallet: ${wallet.id}`);
    wallet.restore();
    await this._walletRepo.saveChanges(wallet);
    return { status: CommandQueryResult.Success, message: 'Wallet restored.' };
  }
}
