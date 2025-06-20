// External packages
import { Logger } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/command-query-result';

// Internal imports
import { ICategoryRepository } from '../../../common/Core/i-category-repository';

export class RestoreCategoryCommand extends Command<Result<string>> {
  constructor(public readonly id: string) {
    super();
  }
}

@CommandHandler(RestoreCategoryCommand)
export class RestoreCategoryHandler implements ICommandHandler<RestoreCategoryCommand> {
  private readonly logger = new Logger(RestoreCategoryHandler.name);

  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(command: RestoreCategoryCommand): Promise<Result<string>> {
    const category = await this.categoryRepo.getById(command.id);
    if (category === null) return { status: CommandQueryResult.NotFound, message: 'Category not found' };

    if (category.deletedAt === null)
      return { status: CommandQueryResult.Conflict, message: 'Category not archived' };

    this.logger.log(`Restoring category: ${category.id}`);
    category.restore();
    await this.categoryRepo.saveChanges(category);

    return { status: CommandQueryResult.Success, message: 'Category restored' };
  }
}
