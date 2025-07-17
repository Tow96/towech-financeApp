// External packages
import { Logger } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/primitives';

// Internal imports
import { IWalletRepository } from '../../../common/wallets';

export class ArchiveWalletCommand extends Command<Result<string>> {
  constructor(public readonly id: string) {
    super();
  }
}

@CommandHandler(ArchiveWalletCommand)
export class ArchiveWalletHandler implements ICommandHandler<ArchiveWalletCommand> {
  private readonly _logger = new Logger(`Distribution.${ArchiveWalletHandler.name}`);

  constructor(private readonly _walletRepo: IWalletRepository) {}

  async execute(command: ArchiveWalletCommand): Promise<Result<string>> {
    const wallet = await this._walletRepo.getById(command.id);
    if (wallet === null)
      return { status: CommandQueryResult.NotFound, message: 'Wallet not found!' };

    if (wallet.deletedAt !== null)
      return { status: CommandQueryResult.Conflict, message: 'Wallet already archived.' };

    this._logger.log(`Archiving wallet: ${wallet.id}`);
    wallet.archive();
    await this._walletRepo.saveChanges(wallet);
    return { status: CommandQueryResult.Success, message: 'Wallet archived.' };
  }
}
