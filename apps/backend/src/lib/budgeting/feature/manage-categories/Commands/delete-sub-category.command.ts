// External packages
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

// App packages
import { ICategoryRepository } from '../../../../_common/categories';
import { CommandQueryResult, Result } from '../../../../_common/primitives';

export class DeleteSubCategoryCommand extends Command<Result<string>> {
  constructor(
    public readonly categoryId: string,
    public readonly subCategoryId: string
  ) {
    super();
  }
}

@CommandHandler(DeleteSubCategoryCommand)
export class DeleteSubCategoryHandler implements ICommandHandler<DeleteSubCategoryCommand> {
  private readonly logger = new Logger(DeleteSubCategoryCommand.name);

  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(command: DeleteSubCategoryCommand): Promise<Result<string>> {
    const parentCategory = await this.categoryRepository.getById(command.categoryId);
    if (!parentCategory)
      return { status: CommandQueryResult.NotFound, message: 'Parent category not found' };

    this.logger.log(`Deleting subcategory with id: ${command.subCategoryId}`);

    parentCategory.removeSubCategory(command.subCategoryId);
    await this.categoryRepository.saveChanges(parentCategory);

    return { status: CommandQueryResult.Success, message: 'Deleted successfully' };
  }
}
