// External packages
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/primitives';

// Internal imports
import { IWalletRepository } from '../../../common/wallets';

export class UpdateWalletCommand extends Command<Result<string>> {
  constructor(
    public readonly id: string,
    public readonly iconId?: number,
    public readonly name?: string
  ) {
    super();
  }
}

@CommandHandler(UpdateWalletCommand)
export class UpdateWalletHandler implements ICommandHandler<UpdateWalletCommand> {
  private readonly _logger = new Logger(`Distribution.${UpdateWalletHandler.name}`);

  constructor(private readonly _walletRepo: IWalletRepository) {}

  async execute(command: UpdateWalletCommand): Promise<Result<string>> {
    const wallet = await this._walletRepo.getById(command.id);
    if (wallet === null)
      return { status: CommandQueryResult.NotFound, message: 'Wallet not found.' };

    // Check if there is another wallet with the same name
    if (command.name) {
      const walletExists = await this._walletRepo.walletExists(wallet.userId, command.name);
      if (walletExists !== null)
        return {
          status: CommandQueryResult.Conflict,
          message: 'Wallet with same name already exists!',
        };
    }

    this._logger.log(`Updating wallet: ${wallet.id}`);
    wallet.update(command);
    await this._walletRepo.saveChanges(wallet);
    return { status: CommandQueryResult.Success, message: 'Wallet updated.' };
  }
}
