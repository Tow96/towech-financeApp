// External packages
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/primitives';

// Internal imports
import { IMovementRepository } from '../../../common/movements/core';

export class DeleteMovementCommand extends Command<Result<any>> {
  constructor(public readonly id: string) {
    super();
  }
}

@CommandHandler(DeleteMovementCommand)
export class DeleteMovementHandler implements ICommandHandler<DeleteMovementCommand> {
  private readonly _logger = new Logger(`Distribution.${DeleteMovementHandler.name}`);

  constructor(private readonly _movementRepo: IMovementRepository) {}

  async execute(command: DeleteMovementCommand): Promise<Result<string>> {
    const movement = await this._movementRepo.getById(command.id);
    if (movement === null)
      return { status: CommandQueryResult.NotFound, message: 'Movement not found' };

    this._logger.log(`Deleting movement ${command.id}`);
    movement.delete();
    await this._movementRepo.saveChanges(movement);
    return { status: CommandQueryResult.Success, message: `Movement deleted` };
  }
}
