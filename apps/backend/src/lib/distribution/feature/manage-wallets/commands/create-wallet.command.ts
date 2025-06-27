// External packages
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/command-query-result';

// Internal imports
import { IWalletRepository, WalletAggregate } from '../../../common/wallets';

export class CreateWalletCommand extends Command<Result<string>> {
  constructor(
    public readonly userId: string,
    public readonly iconId: number,
    public readonly name: string
  ) {
    super();
  }
}

@CommandHandler(CreateWalletCommand)
export class CreateWalletHandler implements ICommandHandler<CreateWalletCommand> {
  private readonly _logger = new Logger(`Distribution.${CreateWalletHandler.name}`);

  constructor(private readonly _walletRepo: IWalletRepository) {}

  async execute(command: CreateWalletCommand): Promise<Result<string>> {
    const walletExists = await this._walletRepo.walletExists(command.userId, command.name);
    if (walletExists !== null)
      return {
        status: CommandQueryResult.Conflict,
        message: 'Wallet with same name already exists!',
      };

    this._logger.log(`Creating new wallet with name: ${command.name} for user: ${command.userId}`);

    const newWallet = WalletAggregate.create({ ...command });
    await this._walletRepo.saveChanges(newWallet);
    return { status: CommandQueryResult.Success, message: newWallet.id };
  }
}
