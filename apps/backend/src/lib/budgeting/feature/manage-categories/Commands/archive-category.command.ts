// External packages
import { Logger } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

// App packages
import { ICategoryRepository } from '../../../../_common/categories';
import { CommandQueryResult, Result } from '../../../../_common/primitives';

export class ArchiveCategoryCommand extends Command<Result<string>> {
  constructor(public readonly id: string) {
    super();
  }
}

@CommandHandler(ArchiveCategoryCommand)
export class ArchiveCategoryHandler implements ICommandHandler<ArchiveCategoryCommand> {
  private readonly logger = new Logger(ArchiveCategoryHandler.name);

  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(command: ArchiveCategoryCommand): Promise<Result<string>> {
    const category = await this.categoryRepo.getById(command.id);
    if (category === null)
      return { status: CommandQueryResult.NotFound, message: 'Category not found' };

    if (category.deletedAt !== null)
      return {
        status: CommandQueryResult.Conflict,
        message: 'Category already archived',
      };

    this.logger.log(`Archiving category: ${category.id}`);
    category.archive();
    await this.categoryRepo.saveChanges(category);

    return { status: CommandQueryResult.Success, message: 'Category archived' };
  }
}
