// External packages
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/primitives';
import { ICategoryRepository } from '../../../../_common/categories';

// Internal imports
import {
  IMovementRepository,
  MovementAggregate,
  SummaryItem,
} from '../../../common/movements/core';
import { IWalletRepository } from '../../../common/wallets';

export class CreateMovementCommand extends Command<Result<string>> {
  constructor(
    public readonly userId: string,
    public readonly categoryId: string,
    public readonly subCategoryId: string | null,
    public readonly description: string,
    public readonly date: Date,
    public readonly summary: SummaryItem[]
  ) {
    super();
  }
}

@CommandHandler(CreateMovementCommand)
export class CreateMovementHandler implements ICommandHandler<CreateMovementCommand> {
  private readonly _logger: Logger = new Logger(`Distribution.${CreateMovementHandler.name}`);

  constructor(
    private readonly _walletRepo: IWalletRepository,
    private readonly _categoryRepo: ICategoryRepository,
    private readonly _movementRepo: IMovementRepository
  ) {}

  async execute(command: CreateMovementCommand): Promise<Result<string>> {
    const uniqueWallets = Array.from(
      new Set([
        ...command.summary.map(s => s.originWalletId).filter(s => s !== null),
        ...command.summary.map(s => s.destinationWalletId).filter(s => s !== null),
      ])
    );

    const walletOwnerErrors: string[] = [];
    for (let i = 0; i < uniqueWallets.length; i++) {
      const owner = await this._walletRepo.getWalletOwner(uniqueWallets[i]);
      if (command.userId !== owner)
        walletOwnerErrors.push(`User does not own wallet ${uniqueWallets[i]}`);
    }
    if (walletOwnerErrors.length > 0)
      return { status: CommandQueryResult.Conflict, message: walletOwnerErrors.join(', ') };

    const category = await this._categoryRepo.getById(command.categoryId);
    if (category === null || category.userId !== command.userId)
      return { status: CommandQueryResult.Conflict, message: 'Category not found' };

    this._logger.log(`Creating new movement for user ${command.userId}`);
    const newMovement = MovementAggregate.create({ ...command, category });

    await this._movementRepo.saveChanges(newMovement);
    return { status: CommandQueryResult.Success, message: 'id' };
  }
}
