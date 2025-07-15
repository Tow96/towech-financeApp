// External packages
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/primitives';
import { CategoryAggregate, ICategoryRepository } from '../../../../_common/categories';

// Internal imports
import { IMovementRepository, SummaryItem } from '../../../common/movements/core';
import { IWalletRepository } from '../../../common/wallets';

export class UpdateMovementCommand extends Command<Result<string>> {
  constructor(
    public readonly id: string,
    public readonly categoryId?: string,
    public readonly subCategoryId?: string | null,
    public readonly description?: string,
    public readonly date?: Date,
    public readonly summary?: SummaryItem[]
  ) {
    super();
  }
}

@CommandHandler(UpdateMovementCommand)
export class UpdateMovementHandler implements ICommandHandler<UpdateMovementCommand> {
  private readonly _logger: Logger = new Logger(`Distribution.${UpdateMovementHandler.name}`);

  constructor(
    private readonly _walletRepo: IWalletRepository,
    private readonly _categoryRepo: ICategoryRepository,
    private readonly _movementRepo: IMovementRepository
  ) {}

  async execute(command: UpdateMovementCommand): Promise<Result<string>> {
    const movement = await this._movementRepo.getById(command.id);
    if (movement === null)
      return { status: CommandQueryResult.NotFound, message: 'Movement not found' };

    if (command.summary !== undefined) {
      const uniqueWallets = Array.from(
        new Set([
          ...command.summary.map(s => s.originWalletId).filter(s => s !== null),
          ...command.summary.map(s => s.destinationWalletId).filter(s => s !== null),
        ])
      );

      const walletOwnerErrors: string[] = [];
      // for (let i = 0; i < uniqueWallets.length; i++) {
      //   const owner = await this._walletRepo.getWalletOwner(uniqueWallets[i]);
      //   if (command.userId !== owner)
      //     walletOwnerErrors.push(`User does not own wallet ${uniqueWallets[i]}`);
      // }
      if (walletOwnerErrors.length > 0)
        return { status: CommandQueryResult.Conflict, message: walletOwnerErrors.join(', ') };
    }

    // let category: CategoryAggregate | null = null;
    // if (command.categoryId !== undefined) {
    //   category = await this._categoryRepo.getById(command.categoryId);
    //   if (category === null || category.userId !== command.userId)
    //     return { status: CommandQueryResult.Conflict, message: 'Category not found' };
    // }

    this._logger.log(`Updating movement: ${command.id}`);

    // movement.update({
    //   summary: command.summary,
    //   date: command.date,
    //   description: command.description,
    //   category: command.categoryId === null ? undefined : category,
    //   subCategoryId: command.subCategoryId,
    // });
    await this._movementRepo.saveChanges(movement);
    return { status: CommandQueryResult.Success, message: 'Movement updated' };
  }
}
